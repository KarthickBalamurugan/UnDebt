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

  useEffect(() => {
    // Initial animations
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(titleRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.5 }
    )
    .fromTo(descRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 },
      '-=0.5'
    );

    // Cards animation
    cardsRef.current.forEach((card, index) => {
      gsap.fromTo(card,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.2 * index,
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    // CTA button animation
    gsap.fromTo(ctaRef.current,
      { scale: 0.8, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1,
        scrollTrigger: {
          trigger: ctaRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Parallax effect for hero section
    gsap.to(heroRef.current, {
      yPercent: 50,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-900">
      <Navbar />
      
      {/* Hero Section */}
      <main className="container mx-auto px-4 pt-32 pb-16 relative">
        <div ref={heroRef} className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-6xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl rounded-full transform -translate-y-1/2"></div>
        </div>

        <div className="text-center max-w-4xl mx-auto relative">
          <h1 
            ref={titleRef}
            className="text-6xl font-bold text-white mb-6 tracking-tight"
          >
            UnDebt
            <span className="block text-2xl text-purple-200 mt-4 font-medium">
              Your Path to Financial Freedom
            </span>
          </h1>

          <div 
            ref={descRef}
            className="mt-8 mb-16 text-xl text-purple-100"
          >
            <p className="mb-4">
              Struggling with multiple debts? Let us help you find the fastest and most
              cost-effective way to become debt-free.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: "Smart Calculator",
                description: "Input your debts and let our algorithm find the optimal repayment strategy"
              },
              {
                title: "Multiple Methods",
                description: "Compare Snowball vs Avalanche methods to choose what works best for you"
              },
              {
                title: "Visual Timeline",
                description: "See exactly when you'll be debt-free with interactive payment schedules"
              }
            ].map((feature, index) => (
              <div
                key={index}
                ref={el => cardsRef.current[index] = el}
                className="p-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-120 border border-purple-500/20"
              >
                <h3 className="text-xl font-semibold text-purple-200 mb-4">
                  {feature.title}
                </h3>
                <p className="text-purple-100/80">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Link 
            href="/calculator" 
            ref={ctaRef}
            className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-full text-xl font-semibold hover:shadow-lg hover:scale-105 transform transition-all duration-300 hover:from-blue-400 hover:to-purple-400"
          >
            Start Your Debt-Free Journey
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-indigo-950/50 py-8 backdrop-blur-md">
        <div className="container mx-auto px-4 text-center text-purple-200/60">
          <p>© 2025 UnDebt. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}