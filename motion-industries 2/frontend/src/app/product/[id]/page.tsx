"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ChatBotUI from "../../chatbot/ChatBotUI";
import api from "../../../lib/api";

type Product = {
  id: number; //JPA primary key from backend
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

useEffect(() => {
  api.get(`/products/${id}`)
    .then((res) => setProduct(res.data))
    .catch((err) => setError(err.message));
}, [id]);

const downloadCSV = () => {
    if (!product) return;

    const escape = (val: string) =>
      val.includes(",") || val.includes('"') ? `"${val.replace(/"/g, '""')}"` : val;

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const headers = [
      "Date", "Account", "Line No.", "Manufacturer", "MFR Part No.",
      "Description", "Mi Item No.", "CSN", "Due Date", "End User/Department",
      "Extended Description", "Stock Status", "Qty", "Unit Price", "Ext Price"
    ];

    const row = [
      today,
      "",
      "1",
      "Motion Industries",
      product.partNumber,
      product.name,
      product.partNumber,
      "",
      "",
      "",
      product.description,
      product.inStock ? "IN STOCK" : "OUT OF STOCK",
      "1",
      `$${product.price.toFixed(2)}`,
      `$${product.price.toFixed(2)}`,
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

    // ── DARK HEADER BAR ──
    doc.setFillColor(17, 24, 39);
    doc.rect(0, 0, pageWidth, 22, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Motion Industries', margin, 14);
    doc.setTextColor(20, 184, 166);
    doc.setFontSize(10);
    doc.text('MiMOTION', pageWidth - margin, 14, { align: 'right' });

    // ── PRODUCT SPECIFICATION HEADER ──
    doc.setTextColor(17, 24, 39);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Product Specification Sheet', margin, 33);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    doc.text(product.category, pageWidth - margin, 33, { align: 'right' });

    // Divider
    doc.setDrawColor(229, 231, 235);
    doc.line(margin, 37, pageWidth - margin, 37);

    const fullWidth = pageWidth - margin * 2;

    // ── PRODUCT CARD (full width) ──
    let ly = 43;
    doc.setDrawColor(229, 231, 235);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, ly - 4, fullWidth, 82, 2, 2, 'FD');

    // Product image — proxy to bypass CORS, canvas to normalize format (WebP → PNG)
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

    // Brand | Part Number
    const infoX = margin + 28;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(17, 24, 39);
    doc.text('Motion Industries | ', infoX, ly + 5);
    const miWidth = doc.getTextWidth('Motion Industries | ');
    doc.setTextColor(20, 184, 166);
    doc.text(product.partNumber, infoX + miWidth, ly + 5);

    // Product name
    ly += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(17, 24, 39);
    doc.text(product.name, infoX, ly);

    // Description (auto-wrapped)
    ly += 6;
    doc.setFontSize(8);
    doc.setTextColor(75, 85, 99);
    const splitDesc = doc.splitTextToSize(product.description, fullWidth - 32);
    doc.text(splitDesc, infoX, ly);

    // MI ITEM + Category
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

    // Divider in product card
    ly += 6;
    doc.setDrawColor(229, 231, 235);
    doc.line(margin + 4, ly, margin + fullWidth - 4, ly);

    // QTY + In Stock + Price
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


  if(error){
    return <p className="p-10 text-red-500">Error: {error}</p>;
  }
  if (!product) {
    return <p className="p-10 text-gray-500">Loading...</p>;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <a
          href="/search"
          className="text-teal-600 text-sm mb-6 inline-block hover:text-teal-800"
        >
          ← Back to Search
        </a>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Product Detail <span className="text-sm font-normal text-gray-500 ml-2">1 item</span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* LEFT COLUMN — Product listing */}
          <div className="flex-1 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex gap-4">

              {/* Product image */}
              <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0 overflow-hidden">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain" />
                ) : (
                  <span className="text-gray-400 text-xs text-center">No Image</span>
                )}
              </div>

              {/* Product info */}
              <div className="flex-1">
                <p className="font-bold text-gray-900 text-lg mb-1">
                  Motion Industries | <span className="text-teal-700">{product.partNumber}</span>
                </p>
                <p className="text-sm text-gray-600 mb-3">{product.description}</p>

                <p className="text-xs text-gray-500">MI ITEM <span className="text-gray-800 font-medium ml-1">{product.partNumber}</span></p>
                <p className="text-xs text-gray-500">Category <span className="text-gray-800 font-medium ml-1">{product.category}</span></p>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-700">QTY 1</span>
                    {product.inStock ? (
                      <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                        ✓ In stock
                      </span>
                    ) : (
                      <span className="text-red-500 text-sm font-medium">Out of Stock</span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">${product.price} /each</p>
                    <p className="text-lg font-bold text-gray-900">${product.price}</p>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={downloadPDF}
                    className="flex-1 bg-gray-900 hover:bg-gray-700 text-white py-2.5 rounded-lg font-medium text-sm transition"
                  >
                    Download PDF
                  </button>
                  <button
                    onClick={downloadCSV}
                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-lg font-medium text-sm transition"
                  >
                    Download CSV
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      <ChatBotUI productId={product.id} />
    </main>
  );
}