'use client';

import { useState } from 'react';

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

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Motion Industries</h1>
        <div className="flex gap-3 items-center text-sm">
          <a href="/search" className="hover:text-teal-400">Products</a>
          <a href="/signin" className="hover:text-teal-400">Sign In</a>
          <a href="/signup" className="bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded">
            Sign Up
          </a>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-6 pt-16 pb-10 text-center">
        <p className="text-sm font-semibold tracking-wide text-teal-700 uppercase mb-3">
          Motion Industries Capstone
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Discover Industrial Products Faster
        </h2>
        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
          Browse industrial products, find the right part quickly, and export product information as PDF or CSV for your team.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-14">
        <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-5 shadow-sm">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative md:w-52">
              <button
                onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white hover:bg-gray-50 text-left font-medium flex items-center justify-between"
              >
                All Products
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {megaMenuOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 md:w-[36rem]">
                  <div className="flex">
                    <div className="w-52 border-r border-gray-200 py-2">
                      {productCategories.map((category) => (
                        <button
                          key={category.name}
                          onClick={() => handleSelectCategory(category)}
                          className={`w-full text-left px-4 py-3 text-sm font-medium transition ${
                            selectedCategory.name === category.name
                              ? 'bg-teal-50 text-teal-700 border-l-2 border-teal-700'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>

                    <div className="flex-1 py-3 px-5">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
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
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:text-teal-700 hover:bg-gray-50 rounded transition"
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
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm"
            />
            <button
              onClick={goToSearch}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg text-sm font-medium"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-14">
        <div className="flex items-end justify-between mb-5">
          <h3 className="text-2xl font-bold text-gray-900">Featured Solutions</h3>
          <a href="/search" className="text-sm font-medium text-teal-700 hover:text-teal-800">
            View all products
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredSolutions.map((item) => (
            <div key={item.title} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h4>
              <p className="text-sm text-gray-600 mb-4">{item.description}</p>
              <a
                href="/search"
                className="inline-block text-sm font-medium text-teal-700 hover:text-teal-800"
              >
                Browse
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h3 className="text-2xl font-bold text-gray-900 mb-5">Shop Popular Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {popularCategories.map((category) => (
            <a
              key={category}
              href={`/search?search=${encodeURIComponent(category)}`}
              className="bg-white border border-gray-200 rounded-xl px-4 py-5 text-center font-medium text-gray-800 hover:border-teal-400 hover:text-teal-700 transition"
            >
              {category}
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}