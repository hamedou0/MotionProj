export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
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

      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Industrial Solutions, Simplified
        </h2>
        <p className="text-gray-600 text-lg mb-8">
          Find the parts and products your business needs. Export product info instantly as PDF or CSV.
        </p>
        <a
          href="/search"
          className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg text-lg font-medium"
        >
          Search Products
        </a>
      </section>
    </main>
  );
}
