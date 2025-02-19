'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Navbar from './Navbar';

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const cardsRef = useRef([]);
  const ctaRef = useRef(null);
  const orbRef = useRef(null);

  useEffect(() => {
    // Floating animation for background orb
    gsap.to(orbRef.current, {
      y: 30,
      x: 20,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    });

    // Initial animations with more natural timing
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

    tl.fromTo(titleRef.current,
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, delay: 0.2 }
    )
    .fromTo(descRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 },
      '-=0.8'
    );

    // Staggered card animations
    cardsRef.current.forEach((card, index) => {
      gsap.fromTo(card,
        { y: 100, opacity: 0, rotation: 5 },
        {
          y: 0,
          opacity: 1,
          rotation: 0,
          duration: 1,
          delay: 0.2 * index,
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
          }
        }
      );
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0118] overflow-hidden">
      <Navbar />
      
      {/* Background Elements */}
      <div className="fixed inset-0 opacity-30">
        <div ref={orbRef} className="absolute top-20 right-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-purple-600 to-blue-600 blur-[120px]" />
        <div className="absolute bottom-40 left-[5%] w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-pink-600 to-purple-600 blur-[100px]" />
      </div>

      <main className="container mx-auto px-4 pt-32 pb-16 relative">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="relative mb-24">
            <h1 
              ref={titleRef}
              className="text-7xl font-bold text-white mb-6 tracking-tight leading-none"
            >
              <span className="block transform -rotate-2 mb-2">Take Control</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                of Your Debts !
              </span>
            </h1>

            <div 
              ref={descRef}
              className="ml-12 max-w-2xl"
            >
              <p className="text-xl text-gray-300 leading-relaxed">
                Stop stressing about multiple payments. Let our smart calculator find your 
                fastest path to financial freedom, whether it's the Snowball or Avalanche method.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-24">
            {[
              {
                title: "Smart Calculator",
                description: "Input your debts and watch our algorithm craft your perfect repayment strategy",
                rotate: "-rotate-1"
              },
              {
                title: "Multiple Methods",
                description: "Compare Snowball vs Avalanche methods - choose what motivates you best",
                rotate: "rotate-1"
              },
              {
                title: "Visual Timeline",
                description: "See your debt-free date and track every milestone along the way",
                rotate: "-rotate-1"
              }
            ].map((feature, index) => (
              <div
                key={index}
                ref={el => cardsRef.current[index] = el}
                className={`p-8 bg-white/[0.03] backdrop-blur-xl rounded-2xl transform ${feature.rotate} hover:-translate-y-2 transition-all duration-300 border border-white/10 hover:border-purple-500/50`}
              >
                <h3 className="text-2xl font-bold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Link 
              href="/calculator" 
              ref={ctaRef}
              className="inline-block relative px-8 py-4 text-xl font-semibold overflow-hidden group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:scale-110"></span>
              <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-50 blur-xl transition-all duration-300 group-hover:scale-110"></span>
              <span className="relative text-white">Start Your Journey Now →</span>
            </Link>
          </div>
        </div>
      </main>

      <footer className="relative py-12 border-t border-white/10">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2025 UnDebt. Crafted with care for your financial freedom.</p>
        </div>
      </footer>
    </div>
  );
}