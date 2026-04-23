'use client';

import { useState, useEffect} from 'react';
import { getUser, logout, SessionUser} from '../lib/auth';



type ProductCategory = {
  name: string;
  items: string[];
};

const productCategories: ProductCategory[] = [
  {
    name: 'Bearings',
    items: ['Ball Bearings', 'Roller Bearings', 'Mounted Bearings'],
  },
  {
    name: 'Chemicals',
    items: ['Cleaning Agents', 'Lubricants', 'Solvents'],
  },
  {
    name: 'Electrical',
    items: ['Motors', 'Power Supplies', 'Sensors'],
  },
  {
    name: 'Facility Maintenance',
    items: ['Cleaning Supplies', 'Lubricants', 'Storage'],
  },
  {
    name: 'Hose & Fittings',
    items: ['Air Hoses', 'Couplings', 'Tube Fittings'],
  },
  {
    name: 'Hydraulics',
    items: ['Hydraulic Pumps', 'Hydraulic Valves', 'Hydraulic Hoses'],
  },
  {
    name: 'Safety',
    items: ['Gloves', 'Helmets', 'Protective Eyewear'],
  },
];

const featuredSolutions = [
  {
    title: 'MRO Solutions',
    description: 'Keep operations running with maintenance, repair, and replacement essentials.',
  },
  {
    title: 'Facility Essentials',
    description: 'Stock daily-use products that support clean, efficient, and reliable facilities.',
  },
  {
    title: 'Safety',
    description: 'Protect your team with trusted PPE and jobsite safety products.',
  },
];

const popularCategories = [
  'Bearings',
  'Chemicals',
  'Electrical',
  'Facility Maintenance',
  'Hose & Fittings',
  'Hydraulics',
];

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>(productCategories[0]);

  const goToSearch = () => {
    window.location.href = `/search?search=${encodeURIComponent(query)}`;
  };

  const handleSelectItem = (itemName: string) => {
    window.location.href = `/search?search=${encodeURIComponent(itemName)}`;
  };

  const handleSelectCategory = (category: ProductCategory) => {
    setSelectedCategory(category);

  };

  const [user, setUser] = useState<SessionUser | null>(null)
  useEffect(() => {
    setUser(getUser());
  }, []);
  return (
    <main className="min-h-screen bg-[#F5F5F5] text-[#333333]">
  <nav className="sticky top-0 z-50 bg-[#222222] text-white px-6 py-4 flex items-center justify-between border-b border-[#D62828]/70 shadow-sm">
    <h1 className="text-xl font-bold">Motion Industries</h1>
    <div className="flex gap-3 items-center text-sm">
      <a href="/search" className="hover:text-[#0C6CD4]">Products</a>
      {user ? (
        <>
          <span className="text-[#0C6CD4]">Hi, {user.firstName}</span>
          <button
            onClick={logout}
            className="bg-[#0C6CD4] hover:bg-[#0a5bb2] px-4 py-2 rounded text-white text-sm"
          >
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

      <section className="w-full bg-[#111111] text-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 pt-10 pb-6 text-center">
        <p className="text-sm font-semibold tracking-wide text-[#D62828] uppercase mb-3">
          Motion Industries Capstone
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Discover Industrial Products Faster
        </h2>
        <p className="text-gray-200 text-lg max-w-3xl mx-auto">
          Browse industrial products, find the right part quickly, and export product information as PDF or CSV for your team.
        </p>
        </div>
      </section>

      <section className="w-full bg-[#222222] border-b border-[#2f2f2f]">
        <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="bg-[#222222] border border-[#2f2f2f] rounded-lg p-3 md:p-4 shadow-sm">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative md:w-52">
              <button
                onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                className="w-full border border-[#3a3a3a] rounded-lg px-3 py-2 text-sm bg-[#1b1b1b] hover:bg-[#111111] text-white text-left font-medium flex items-center justify-between"
              >
                All Products
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {megaMenuOpen && (
                <div className="absolute top-full left-0 mt-1 bg-[#111111] border border-[#2f2f2f] rounded-lg shadow-sm z-50 md:w-[36rem]">
                  <div className="flex">
                    <div className="w-52 border-r border-[#2f2f2f] py-2">
                      {productCategories.map((category) => (
                        <button
                          key={category.name}
                          onClick={() => handleSelectCategory(category)}
                          className={`w-full text-left px-4 py-3 text-sm font-medium transition ${
                            selectedCategory.name === category.name
                              ? 'bg-[#1a1a1a] text-white border-l-2 border-[#D62828]'
                              : 'text-gray-200 hover:bg-[#1a1a1a]'
                          }`}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>

                    <div className="flex-1 py-3 px-5">
                      <p className="text-xs font-semibold text-gray-300 uppercase mb-3">
                        {selectedCategory.name}
                      </p>
                      <div className="space-y-2">
                        {selectedCategory.items.map((item) => (
                          <button
                            key={item}
                            onClick={() => {
                              setMegaMenuOpen(false);
                              handleSelectItem(item);
                            }}
                            className="w-full text-left px-3 py-2 text-sm text-gray-100 hover:text-white hover:bg-[#1a1a1a] rounded transition"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && goToSearch()}
              placeholder="Search by keyword or part number"
              className="flex-1 border border-[#BDBDBD] rounded-lg px-3 py-2 text-sm text-[#333333] bg-white"
            />
            <button
              onClick={goToSearch}
              className="bg-[#222222] hover:bg-[#111111] text-white px-5 py-2 rounded-lg text-sm font-medium"
            >
              Search
            </button>
          </div>
        </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-14">
        <div className="flex items-end justify-between mb-5">
          <h3 className="text-2xl font-bold text-[#333333]">Featured Solutions</h3>
          <a href="/search" className="text-sm font-medium text-[#0C6CD4] hover:text-[#0a5bb2]">
            View all products
          </a>
        </div>
        <div className="h-0.5 w-10 bg-[#D62828] mb-5" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredSolutions.map((item) => (
            <div key={item.title} className="bg-white border border-[#E5E5E5] rounded-xl p-5 shadow-sm">
              <h4 className="text-lg font-semibold text-[#333333] mb-2">{item.title}</h4>
              <p className="text-sm text-[#555555] mb-4">{item.description}</p>
              <a
                href="/search"
                className="inline-block text-sm font-medium text-[#0C6CD4] hover:text-[#D62828]"
              >
                Browse
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h3 className="text-2xl font-bold text-[#333333] mb-5">Shop Popular Categories</h3>
        <div className="h-0.5 w-10 bg-[#D62828] mb-5" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {popularCategories.map((category) => (
            <a
              key={category}
              href={`/search?search=${encodeURIComponent(category)}`}
              className="bg-white border border-[#E5E5E5] rounded-xl px-4 py-5 text-center font-medium text-[#333333] hover:border-[#0C6CD4] hover:text-[#0C6CD4] transition"
            >
              {category}
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}