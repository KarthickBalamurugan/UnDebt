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
    <nav ref={navRef} className="fixed w-full top-0 z-50">
      <div className="absolute inset-0 bg-[#0A0118]/80 backdrop-blur-md"></div>
      <div className="container mx-auto px-6 relative">
        <div className="flex justify-between items-center h-20">
          {/* Logo/Brand - Left */}
          <Link 
            href="/" 
            ref={logoRef}
            className="text-2xl font-bold text-white hover:text-purple-400 transition-colors duration-300"
          >
            UnDebt
          </Link>

          {/* User Profile Section - Right */}
          <div ref={profileRef} className="flex items-center gap-6">
            {session ? (
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-4 bg-white/[0.03] px-5 py-2.5 rounded-full border border-white/10 hover:border-purple-500/50 transition-all duration-300">
                  <span className="text-gray-300 font-medium">
                    {session.user?.name || 'User'}
                  </span>
                  
                  {session.user?.image ? (
                    <div className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-purple-500/30 hover:ring-purple-500 transition-all duration-300">
                      <Image
                        src={session.user.image}
                        alt="Profile"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <span className="text-white font-medium">
                        {session.user?.name?.[0] || 'U'}
                      </span>
                    </div>
                  )}
                  
                  <button
                    onClick={() => signOut()}
                    className="text-gray-400 hover:text-red-400 transition-colors duration-300"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="relative px-6 py-2.5 text-white overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-50 group-hover:opacity-70 transition-opacity duration-300"></span>
                <span className="relative">Connect Wallet</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
