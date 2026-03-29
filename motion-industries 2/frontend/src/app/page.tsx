'use client';

import { useState } from 'react';

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

  const goToSearch = () => {
    window.location.href = `/search?search=${encodeURIComponent(query)}`;
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
        <p className="text-sm font-semibold tracking-wide text-teal-700 uppercase mb-3">Motion Industries Capstone</p>
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
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white md:w-52"
              defaultValue="all"
            >
              <option value="all">All Products</option>
            </select>
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
