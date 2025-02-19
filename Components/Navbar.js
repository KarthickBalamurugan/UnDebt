'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link href="/" className="text-2xl font-bold text-blue-900">
            UnDebt
          </Link>

          {/* User Info and Navigation */}
          <div className="flex items-center gap-8">
            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              <Link 
                href="/dashboard" 
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Dashboard
              </Link>
              <Link 
                href="/calculator" 
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Calculator
              </Link>
            </div>

            {/* User Profile Section */}
            {session ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  {session.user?.image ? (
                    <div className="relative w-8 h-8 rounded-full overflow-hidden">
                      <Image
                        src={session.user.image}
                        alt="Profile"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">
                        {session.user?.name?.[0] || 'U'}
                      </span>
                    </div>
                  )}
                  <span className="text-gray-700 font-medium hidden md:block">
                    {session.user?.name || 'User'}
                  </span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={() => signOut()}
                  className="text-gray-600 hover:text-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button className="md:hidden text-gray-600 hover:text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
