'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getUser, logout, SessionUser } from '../../lib/auth';
import api from '../../lib/api';

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
  { id: 7, partNumber: 'MI-1007', name: 'Ball Bearings', price: 24.95 },
  { id: 8, partNumber: 'MI-1008', name: 'Roller Bearings', price: 31.5 },
  { id: 9, partNumber: 'MI-1009', name: 'Mounted Bearings', price: 44.25 },
  { id: 10, partNumber: 'MI-1010', name: 'Hydraulic Pumps', price: 289.0 },
  { id: 11, partNumber: 'MI-1011', name: 'Hydraulic Valves', price: 112.4 },
  { id: 12, partNumber: 'MI-1012', name: 'Hydraulic Hoses', price: 68.9 },
  { id: 13, partNumber: 'MI-1013', name: 'Protective Gloves', price: 15.75 },
  { id: 14, partNumber: 'MI-1014', name: 'Safety Helmets', price: 39.99 },
  { id: 15, partNumber: 'MI-1015', name: 'Protective Eyewear', price: 12.5 },
  { id: 16, partNumber: 'MI-1016', name: 'Electric Motors', price: 214.3 },
  { id: 17, partNumber: 'MI-1017', name: 'Power Supplies', price: 74.8 },
  { id: 18, partNumber: 'MI-1018', name: 'Industrial Sensors', price: 58.2 },
  { id: 19, partNumber: 'MI-1019', name: 'Cleaning Agents', price: 28.5 },
  { id: 20, partNumber: 'MI-1020', name: 'Industrial Lubricants', price: 35.75 },
  { id: 21, partNumber: 'MI-1021', name: 'Solvents', price: 22.4 },
  { id: 22, partNumber: 'MI-1022', name: 'Cleaning Supplies', price: 18.9 },
  { id: 23, partNumber: 'MI-1023', name: 'Storage Containers', price: 52.0 },
  { id: 24, partNumber: 'MI-1024', name: 'Air Hoses', price: 36.8 },
  { id: 25, partNumber: 'MI-1025', name: 'Hose Couplings', price: 15.3 },
  { id: 26, partNumber: 'MI-1026', name: 'Tube Fittings', price: 21.75 },
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    setUser(getUser()); // popu;ates after hydration, mo ssr mismatch
  }, []);


  const search = async (searchQuery = query) => {
    setLoading(true);
    setUsingFallback(false);

    try {
      const { data } = await api.get<Product[]>(`/products?search=${encodeURIComponent(searchQuery)}`);
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
    const urlSearchParam = searchParams.get('search') || '';
    setQuery(urlSearchParam);
    search(urlSearchParam);
  }, [searchParams]);

  return (
    <main className="min-h-screen bg-[#F5F5F5] text-[#333333]">
      <nav className="bg-[#222222] text-white px-6 py-4 flex items-center justify-between border-b border-[#D62828]/70 shadow-sm">
  <a href="/" className="text-xl font-bold">Motion Industries</a>
  <div className="flex gap-3 items-center text-sm">
    {user ? (
      <>
        <span className="text-[#0C6CD4]">Hi, {user.firstName}</span>
        <button onClick={logout}
          className="bg-[#0C6CD4] hover:bg-[#0a5bb2] px-4 py-2 rounded text-white text-sm">
          Sign Out
        </button>
      </>
    ) : (
      <>
        <a href="/signin" className="hover:text-[#0C6CD4]">Sign In</a>
        <a href="/signup" className="text-[#0C6CD4] hover:text-[#D62828]">Register</a>
      </>
    )}
  </div>
</nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold mb-2 text-[#333333]">Product Search</h2>
        <div className="h-0.5 w-10 bg-[#D62828] mb-6" />

        <div className="flex gap-3 mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && search()}
            placeholder="Search by name, part number..."
            className="flex-1 border border-[#BDBDBD] rounded-lg px-4 py-2 text-sm text-[#333333] bg-white"
          />
          <button
            onClick={() => search()}
            className="bg-[#222222] hover:bg-[#111111] text-white px-6 py-2 rounded-lg text-sm"
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
          <div className="flex items-center gap-3 py-2 text-[#555555]">
            <span className="h-5 w-5 rounded-full border-2 border-[#BDBDBD] border-t-[#0C6CD4] animate-spin" />
            <span className="text-sm">Loading products...</span>
          </div>
        ) : products === null ? (
          <p className="text-[#666666] text-sm">Enter a search term to find products</p>
        ) : products.length === 0 ? (
          <p className="text-[#666666] text-sm">No Results Found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              usingFallback ? (
                <div
                  key={p.id}
                  className="bg-white border border-[#E5E5E5] rounded-lg p-4 transition shadow-sm"
                >
                  <p className="text-xs text-[#666666] mb-1">{p.partNumber}</p>
                  <h3 className="font-semibold text-[#333333] mb-2">{p.name}</h3>
                  <p className="text-[#0C6CD4] font-bold">${p.price}</p>
                  <p className="mt-3 text-xs text-[#666666]">Product details unavailable in sample mode</p>
                </div>
              ) : (
                <a
                  key={p.id}
                  href={`/product/${p.id}`}
                  className="bg-white border border-[#E5E5E5] rounded-lg p-4 hover:shadow-sm transition"
                >
                <p className="text-xs text-[#666666] mb-1">{p.partNumber}</p>
                <h3 className="font-semibold text-[#333333] mb-2">{p.name}</h3>
                <p className="text-[#0C6CD4] font-bold">${p.price}</p>
                </a>
              )
            ))}
          </div>
        )}
      </div>
    </main>
  );
}