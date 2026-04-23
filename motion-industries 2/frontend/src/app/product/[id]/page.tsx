"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ChatBotUI from "../../chatbot/ChatBotUI";

type Product = {
  id: number; //JPA primary key from backend 
  partNumber: string;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
};


export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  fetch(`/api/products/${id}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Failed to load product: ${res.statusText}`);
      }
      return res.json();
    })
    .then((data) => setProduct(data))
    .catch((err) => setError(err.message));
}, [id]);



  const downloadCSV = () => {
    if (!product) return;

    const rows = [
      ["Field", "Value"],
      ["Part Number", product.partNumber],
      ["Name", product.name],
      ["Description", product.description],
      ["Price", `$${product.price}`],
      ["Category", product.category],
      ["In Stock", product.inStock ? "Yes" : "No"],
    ];

    const csv = rows.map((r) => r.map(String).join(",")).join("\n");
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
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Motion Industries - Product Info", 14, 20);
    doc.setFontSize(12);
    doc.text(`Part Number: ${product.partNumber}`, 14, 40);
    doc.text(`Name: ${product.name}`, 14, 50);
    doc.text(`Description: ${product.description}`, 14, 60);
    doc.text(`Price: $${product.price}`, 14, 70);
    doc.text(`Category: ${product.category}`, 14, 80);
    doc.text(`In Stock: ${product.inStock ? "Yes" : "No"}`, 14, 90);

    doc.save(`${product.partNumber}.pdf`);
  };

  if(error){
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

        <div className="flex gap-4 text-sm">
          <a href="/search" className="hover:text-[#0C6CD4]">
            Products
          </a>
          <a href="/signin" className="hover:text-[#0C6CD4]">
            Sign In
          </a>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <a
          href="/search"
          className="text-[#0C6CD4] text-sm mb-6 inline-block hover:text-[#0a5bb2]"
        >
          ← Back to Search
        </a>
        <div className="h-0.5 w-10 bg-[#D62828] mb-6" />

        <div className="bg-white rounded-lg border border-[#E5E5E5] p-8 shadow-sm">
          <p className="text-[#666666] text-sm mb-1">Product #{product.partNumber}</p>
          <h1 className="text-3xl font-bold text-[#333333] mb-4">{product.name}</h1>
          <p className="text-[#555555] mb-6">{product.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white border border-[#E5E5E5] rounded-md p-4">
              <p className="text-sm text-[#666666]">Price</p>
              <p className="text-xl font-semibold text-[#0C6CD4]">${product.price}</p>
            </div>

            <div className="bg-white border border-[#E5E5E5] rounded-md p-4">
              <p className="text-sm text-[#666666]">Category</p>
              <p className="font-medium">{product.category}</p>
            </div>

            <div className="bg-white border border-[#E5E5E5] rounded-md p-4">
              <p className="text-sm text-[#666666]">Availability</p>
              <p className={product.inStock ? "font-medium text-[#0C6CD4]" : "font-medium text-[#D62828]"}>
                {product.inStock ? "In Stock" : "Out of Stock"}
              </p>
            </div>
          </div>

          <div className="flex gap-3 border-t pt-6">
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