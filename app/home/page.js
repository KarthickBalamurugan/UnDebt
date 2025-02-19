import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <main className="container mx-auto px-4 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-blue-900 mb-6">
            UnDebt
            <span className="block text-2xl text-gray-600 mt-2">
              Your Path to Financial Freedom
            </span>
          </h1>

          <div className="mt-8 mb-12 text-lg text-gray-700">
            <p className="mb-4">
              Struggling with multiple debts? Let us help you find the fastest and most
              cost-effective way to become debt-free.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-blue-800 mb-3">
                Smart Calculator
              </h3>
              <p className="text-gray-600">
                Input your debts and let our algorithm find the optimal repayment strategy
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-blue-800 mb-3">
                Multiple Methods
              </h3>
              <p className="text-gray-600">
                Compare Snowball vs Avalanche methods to choose what works best for you
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-blue-800 mb-3">
                Visual Timeline
              </h3>
              <p className="text-gray-600">
                See exactly when you'll be debt-free with interactive payment schedules
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <Link 
            href="/calculator" 
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Start Your Debt-Free Journey
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2024 UnDebt. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}