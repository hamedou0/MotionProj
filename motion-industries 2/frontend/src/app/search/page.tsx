'use client';

import { useState, useEffect } from 'react';

type Product = {
  id: number;
  partNumber: string;
  name: string;
  price: number;
};

const mockProducts: Product[] = [
  { id: 1, partNumber: 'MI-1001', name: 'Hydraulic Pump Assembly', price: 249.99 },
  { id: 2, partNumber: 'MI-1002', name: 'Industrial Bearing Kit', price: 89.5 },
  { id: 3, partNumber: 'MI-1003', name: 'Pneumatic Valve Controller', price: 134.75 },
  { id: 4, partNumber: 'MI-1004', name: 'Conveyor Belt Motor', price: 319.0 },
  { id: 5, partNumber: 'MI-1005', name: 'Pressure Sensor Module', price: 59.95 },
  { id: 6, partNumber: 'MI-1006', name: 'Safety Relay Switch', price: 42.25 },
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

  const search = async (searchQuery = query) => {
    setLoading(true);
    setUsingFallback(false);

    try {
      const res = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}`);

      if (!res.ok) {
        throw new Error('Failed to fetch products');
      }

      const data: Product[] = await res.json();
      setProducts(data);
    } catch {
      setUsingFallback(true);

      const normalizedQuery = searchQuery.trim().toLowerCase();
      const singularQuery = normalizedQuery.endsWith('s')
        ? normalizedQuery.slice(0, -1)
        : normalizedQuery;

      const filteredMockProducts = !normalizedQuery
        ? mockProducts
        : mockProducts.filter((product) => {
            const name = product.name.toLowerCase();
            const partNumber = product.partNumber.toLowerCase();
            return (
              name.includes(normalizedQuery) ||
              partNumber.includes(normalizedQuery) ||
              (singularQuery !== normalizedQuery &&
                (name.includes(singularQuery) || partNumber.includes(singularQuery)))
            );
          });

      setProducts(filteredMockProducts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const urlSearchParam = params.get('search') || '';
    setQuery(urlSearchParam);
    search(urlSearchParam);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold mb-6">Product Search</h2>

        <div className="flex gap-3 mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && search()}
            placeholder="Search by name, part number..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm"
          />
          <button
            onClick={() => search()}
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg text-sm"
          >
            Search
          </button>
        </div>

        {usingFallback && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg mb-6 text-sm">
            Live product data is unavailable right now. Showing sample results.
          </div>
        )}

        {loading ? (
          <div className="flex items-center gap-3 py-2 text-gray-600">
            <span className="h-5 w-5 rounded-full border-2 border-gray-300 border-t-teal-600 animate-spin" />
            <span className="text-sm">Loading products...</span>
          </div>
        ) : products === null ? (
          <p className="text-gray-400 text-sm">Enter a search term to find products</p>
        ) : products.length === 0 ? (
          <p className="text-gray-400 text-sm">No Results Found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <a
                key={p.id}
                href={`/product/${p.id}`}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
              >
                <p className="text-xs text-gray-400 mb-1">{p.partNumber}</p>
                <h3 className="font-semibold text-gray-900 mb-2">{p.name}</h3>
                <p className="text-teal-600 font-bold">${p.price}</p>
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}