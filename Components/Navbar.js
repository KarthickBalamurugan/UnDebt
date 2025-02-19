'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Navbar() {
  const { data: session } = useSession();
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    // Initial animation
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 }
    )
    .fromTo(logoRef.current,
      { x: -20, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6 },
      '-=0.4'
    )
    .fromTo(profileRef.current,
      { x: 20, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6 },
      '-=0.6'
    );

    // Hover animation for logo
    logoRef.current.addEventListener('mouseenter', () => {
      gsap.to(logoRef.current, {
        scale: 1.05,
        duration: 0.3
      });
    });

    logoRef.current.addEventListener('mouseleave', () => {
      gsap.to(logoRef.current, {
        scale: 1,
        duration: 0.3
      });
    });
  }, []);

  return (
    <nav ref={navRef} className="bg-gradient-to-r from-indigo-900/95 via-purple-900/95 to-indigo-900/95 backdrop-blur-md shadow-lg fixed w-full top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo/Brand - Left */}
          <Link 
            href="/" 
            ref={logoRef}
            className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hover:from-blue-300 hover:to-purple-300 transition-all duration-300"
          >
            UnDebt
          </Link>

          {/* User Profile Section - Right */}
          <div ref={profileRef} className="flex items-center gap-6">
            {session ? (
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-300">
                  <span className="text-gray-200 font-medium">
                    {session.user?.name || 'User'}
                  </span>
                  
                  {session.user?.image ? (
                    <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-blue-100 hover:ring-blue-300 transition-all duration-300">
                      <Image
                        src={session.user.image}
                        alt="Profile"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center ring-2 ring-blue-100 hover:ring-blue-300 transition-all duration-300">
                      <span className="text-white font-semibold text-lg">
                        {session.user?.name?.[0] || 'U'}
                      </span>
                    </div>
                  )}
                  
                  <button
                    onClick={() => signOut()}
                    className="text-gray-600 hover:text-red-600 transition-colors duration-300 font-medium hover:scale-105 transform"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2.5 rounded-full font-medium hover:shadow-lg hover:scale-105 transform transition-all duration-300 hover:from-blue-400 hover:to-purple-400"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
