"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ChatBotUI from "../../chatbot/ChatBotUI";
import api from "../../../lib/api";
import { getUser, logout, SessionUser } from "../../../lib/auth";

type Product = {
  id: number;
  partNumber: string;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
  imageUrl?: string;
};

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => setError(err.message));
  }, [id]);

  const downloadCSV = () => {
    if (!product) return;

    const escape = (val: string) =>
      val.includes(",") || val.includes('"') ? `"${val.replace(/"/g, '""')}"` : val;

    const today = new Date().toISOString().split("T")[0];

    const headers = [
      "Date", "Account", "Line No.", "Manufacturer", "MFR Part No.",
      "Description", "Mi Item No.", "CSN", "Due Date", "End User/Department",
      "Extended Description", "Stock Status", "Qty", "Unit Price", "Ext Price"
    ];

    const row = [
      today, "", "1", "Motion Industries", product.partNumber,
      product.name, product.partNumber, "", "", "",
      product.description, product.inStock ? "IN STOCK" : "OUT OF STOCK",
      "1", `$${product.price.toFixed(2)}`, `$${product.price.toFixed(2)}`,
    ];

    const csv = [headers, row].map((r) => r.map(escape).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${product.partNumber}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPDF = async () => {
    if (!product) return;

    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageWidth = 210;
    const margin = 14;

    doc.setFillColor(17, 24, 39);
    doc.rect(0, 0, pageWidth, 22, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Motion Industries', margin, 14);
    doc.setTextColor(20, 184, 166);
    doc.setFontSize(10);
    doc.text('MiMOTION', pageWidth - margin, 14, { align: 'right' });

    doc.setTextColor(17, 24, 39);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Product Specification Sheet', margin, 33);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    doc.text(product.category, pageWidth - margin, 33, { align: 'right' });

    doc.setDrawColor(229, 231, 235);
    doc.line(margin, 37, pageWidth - margin, 37);

    const fullWidth = pageWidth - margin * 2;
    let ly = 43;
    doc.setDrawColor(229, 231, 235);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, ly - 4, fullWidth, 82, 2, 2, 'FD');

    const drawImagePlaceholder = () => {
      doc.setFillColor(243, 244, 246);
      doc.setDrawColor(209, 213, 219);
      doc.rect(margin + 4, ly, 20, 20, 'FD');
      doc.setFontSize(6);
      doc.setTextColor(156, 163, 175);
      doc.text('No Image', margin + 14, ly + 11, { align: 'center' });
    };

    if (product.imageUrl) {
      try {
        const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(product.imageUrl)}`;
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error('proxy failed');
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        const imgEl = new Image();
        await new Promise<void>((resolve, reject) => {
          imgEl.onload = () => resolve();
          imgEl.onerror = reject;
          imgEl.src = objectUrl;
        });
        const MAX = 400;
        const w = imgEl.naturalWidth || MAX;
        const h = imgEl.naturalHeight || MAX;
        const scale = Math.min(MAX / w, MAX / h, 1);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(w * scale);
        canvas.height = Math.round(h * scale);
        canvas.getContext('2d')!.drawImage(imgEl, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        URL.revokeObjectURL(objectUrl);
        doc.addImage(dataUrl, 'PNG', margin + 4, ly, 20, 20);
      } catch {
        drawImagePlaceholder();
      }
    } else {
      drawImagePlaceholder();
    }

    const infoX = margin + 28;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(17, 24, 39);
    doc.text('Motion Industries | ', infoX, ly + 5);
    const miWidth = doc.getTextWidth('Motion Industries | ');
    doc.setTextColor(20, 184, 166);
    doc.text(product.partNumber, infoX + miWidth, ly + 5);

    ly += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(17, 24, 39);
    doc.text(product.name, infoX, ly);

    ly += 6;
    doc.setFontSize(8);
    doc.setTextColor(75, 85, 99);
    const splitDesc = doc.splitTextToSize(product.description, fullWidth - 32);
    doc.text(splitDesc, infoX, ly);

    ly += splitDesc.length * 4 + 4;
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text('MI ITEM', margin + 4, ly);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(17, 24, 39);
    doc.text(product.partNumber, margin + 22, ly);

    ly += 5;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text('Category', margin + 4, ly);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(17, 24, 39);
    doc.text(product.category, margin + 22, ly);

    ly += 6;
    doc.setDrawColor(229, 231, 235);
    doc.line(margin + 4, ly, margin + fullWidth - 4, ly);

    ly += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(55, 65, 81);
    doc.text('QTY 1', margin + 4, ly);

    if (product.inStock) {
      doc.setTextColor(22, 163, 74);
      doc.text('In stock', margin + 20, ly);
    } else {
      doc.setTextColor(220, 38, 38);
      doc.text('Out of Stock', margin + 20, ly);
    }

    doc.setTextColor(107, 114, 128);
    doc.setFontSize(7);
    doc.text(`$${product.price.toFixed(2)} /each`, margin + fullWidth - 4, ly - 3, { align: 'right' });
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(17, 24, 39);
    doc.text(`$${product.price.toFixed(2)}`, margin + fullWidth - 4, ly + 4, { align: 'right' });

    doc.save(`${product.partNumber}.pdf`);
  };

  if (error) {
    return <p className="p-10 text-red-500">Error: {error}</p>;
  }
  if (!product) {
    return <p className="p-10 text-[#666666]">Loading...</p>;
  }

  return (
    <main className="min-h-screen bg-[#F5F5F5] text-[#333333]">
      <nav className="bg-[#222222] text-white px-6 py-4 flex items-center justify-between border-b border-[#D62828]/70 shadow-sm">
        <a href="/" className="text-xl font-bold">
          Motion Industries
        </a>
        <div className="flex gap-4 items-center text-sm">
          <a href="/search" className="hover:text-[#0C6CD4]">Products</a>
          {user ? (
            <>
              <span className="text-[#0C6CD4]">Hi, {user.firstName}</span>
              <button onClick={logout} className="bg-[#0C6CD4] hover:bg-[#0a5bb2] px-4 py-2 rounded text-white text-sm">
                Sign Out
              </button>
            </>
          ) : (
            <a href="/signin" className="hover:text-[#0C6CD4]">Sign In</a>
          )}
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <a href="/search" className="text-[#0C6CD4] text-sm mb-6 inline-block hover:text-[#0a5bb2]">
          ← Back to Search
        </a>
        <div className="h-0.5 w-10 bg-[#D62828] mb-4" />

        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-2xl font-bold text-[#333333]">Product Detail</h1>
          <span className="text-sm text-[#888888]">1 item</span>
        </div>

        <div className="bg-white rounded-lg border border-[#E5E5E5] shadow-sm overflow-hidden">
          <div className="p-6 flex gap-5">
            {/* Image */}
            <div className="flex-shrink-0 w-20 h-20 flex items-center justify-center">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="w-20 h-20 object-contain" />
              ) : (
                <div className="w-20 h-20 bg-[#F3F4F6] rounded border border-[#E5E5E5]" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#333333] mb-1">
                Motion Industries |{" "}
                <span className="text-[#0C6CD4]">{product.partNumber}</span>
              </p>
              <p className="text-sm text-[#555555] mb-3">{product.name}</p>

              <div className="flex flex-col gap-1 mb-3">
                <div className="flex gap-2 text-sm">
                  <span className="text-[#999999] w-16">MI ITEM</span>
                  <span className="font-semibold text-[#333333]">{product.partNumber}</span>
                </div>
                <div className="flex gap-2 text-sm">
                  <span className="text-[#999999] w-16">Category</span>
                  <span className="font-semibold text-[#333333]">{product.category}</span>
                </div>
              </div>

              <hr className="border-[#E5E5E5] mb-3" />

              <div className="flex items-end justify-between">
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-[#555555]">QTY 1</span>
                  {product.inStock ? (
                    <span className="text-green-600 font-medium">✓ In stock</span>
                  ) : (
                    <span className="text-[#D62828] font-medium">Out of Stock</span>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#999999]">${product.price.toFixed(2)} /each</p>
                  <p className="text-lg font-bold text-[#333333]">${product.price.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 px-6 pb-6">
            <button
              onClick={downloadPDF}
              className="flex-1 bg-[#222222] hover:bg-[#111111] text-white py-2.5 rounded-lg font-medium text-sm transition"
            >
              Download PDF
            </button>
            <button
              onClick={downloadCSV}
              className="flex-1 bg-[#0C6CD4] hover:bg-[#0a5bb2] text-white py-2.5 rounded-lg font-medium text-sm transition"
            >
              Download CSV
            </button>
          </div>
        </div>
      </div>
      <ChatBotUI productId={product.id} />
    </main>
  );
}
