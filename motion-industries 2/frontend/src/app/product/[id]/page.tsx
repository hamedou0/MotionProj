'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ChatBotUI from '../../chatbot/ChatBotUI';

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then(setProduct);
  }, [id]);

  const downloadCSV = () => {
    if (!product) return;
    const rows = [
      ['Field', 'Value'],
      ['Part Number', product.partNumber],
      ['Name', product.name],
      ['Description', product.description],
      ['Price', `$${product.price}`],
      ['Category', product.category],
      ['In Stock', product.inStock ? 'Yes' : 'No'],
    ];
    const csv = rows.map((r) => r.map((v) => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${product.partNumber}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPDF = async () => {
    if (!product) return;
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Motion Industries - Product Info', 14, 20);
    doc.setFontSize(12);
    doc.text(`Part Number: ${product.partNumber}`, 14, 40);
    doc.text(`Name: ${product.name}`, 14, 50);
    doc.text(`Description: ${product.description}`, 14, 60);
    doc.text(`Price: $${product.price}`, 14, 70);
    doc.text(`Category: ${product.category}`, 14, 80);
    doc.text(`In Stock: ${product.inStock ? 'Yes' : 'No'}`, 14, 90);
    doc.save(`${product.partNumber}.pdf`);
  };

  if (!product) return <p className="p-10 text-gray-500">Loading...</p>;

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
        <a href="/" className="text-xl font-bold">Motion Industries</a>
        <div className="flex gap-4 text-sm">
          <a href="/search" className="hover:text-teal-400">Products</a>
          <a href="/signin" className="hover:text-teal-400">Sign In</a>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <a href="/search" className="text-teal-600 text-sm mb-6 inline-block">← Back to Search</a>

        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <p className="text-gray-400 text-sm mb-1">{product.partNumber}</p>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-6">{product.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 rounded p-4">
              <p className="text-sm text-gray-500">Price</p>
              <p className="text-xl font-bold text-teal-600">${product.price}</p>
            </div>
            <div className="bg-gray-50 rounded p-4">
              <p className="text-sm text-gray-500">Category</p>
              <p className="font-semibold">{product.category}</p>
            </div>
            <div className="bg-gray-50 rounded p-4">
              <p className="text-sm text-gray-500">Availability</p>
              <p className={`font-semibold ${product.inStock ? 'text-green-600' : 'text-red-500'}`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </p>
            </div>
          </div>

          {/* Export Buttons — core feature */}
          <div className="flex gap-3 border-t pt-6">
            <button
              onClick={downloadPDF}
              className="flex-1 bg-gray-900 hover:bg-gray-700 text-white py-2.5 rounded-lg font-medium text-sm transition"
            >
              ↓ Download PDF
            </button>
            <button
              onClick={downloadCSV}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-lg font-medium text-sm transition"
            >
              ↓ Download CSV
            </button>
          </div>
        </div>
      </div>

      {/* ChatBot floats on product pages */}
      <ChatBotUI productId={Number(id)} />
    </main>
  );
}
