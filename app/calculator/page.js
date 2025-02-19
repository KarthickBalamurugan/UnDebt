'use client';
import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import Navbar from '@/Components/Navbar';
import Image from 'next/image';

export default function CalculatorPage() {
  const [formData, setFormData] = useState({
    debtName: '',
    principalAmount: '',
    interestRate: '',
    loanDuration: '',
    minimumPayment: '',
    loanType: 'personal',
    aadharCard: null,
    panCard: null
  });

  const titleRef = useRef(null);
  const formRef = useRef(null);
  const orbRef = useRef(null);

  useEffect(() => {
    // Animations
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

    tl.fromTo(titleRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2 }
    )
    .fromTo(formRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 },
      '-=0.8'
    );

    // Background orb animation
    gsap.to(orbRef.current, {
      y: 30,
      x: 20,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files[0]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log(formData);
  };

  return (
    <div className="min-h-screen bg-[#0A0118] overflow-hidden">
      <Navbar />
      
      {/* Background Elements */}
      <div className="fixed inset-0 opacity-30">
        <div ref={orbRef} className="absolute top-20 right-[10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full bg-gradient-to-br from-purple-600 to-blue-600 blur-[80px] md:blur-[120px]" />
        <div className="absolute bottom-40 left-[5%] w-[250px] md:w-[400px] h-[250px] md:h-[400px] rounded-full bg-gradient-to-tr from-pink-600 to-purple-600 blur-[60px] md:blur-[100px]" />
      </div>

      <main className="container mx-auto px-4 pt-32 pb-16 relative">
        <div className="max-w-2xl mx-auto">
          {/* Title Section */}
          <div ref={titleRef} className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Debt Calculator
              </span>
            </h1>
            <p className="text-gray-400 text-lg">
              Calculate your debt repayment plan
            </p>
          </div>

          {/* Calculator Form */}
          <form 
            ref={formRef}
            onSubmit={handleSubmit}
            className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-8 border border-white/10"
          >
            <div className="space-y-6">
              {/* Debt Name */}
              <div>
                <label className="block text-gray-300 mb-2">Debt Name</label>
                <input
                  type="text"
                  name="debtName"
                  value={formData.debtName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/30"
                  placeholder="e.g., Home Loan"
                />
              </div>

              {/* Principal Amount & Interest Rate */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 mb-2">Principal Amount</label>
                  <input
                    type="number"
                    name="principalAmount"
                    value={formData.principalAmount}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/30"
                    placeholder="₹"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Interest Rate (%)</label>
                  <input
                    type="number"
                    name="interestRate"
                    value={formData.interestRate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/30"
                    placeholder="%"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Loan Duration & Minimum Payment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 mb-2">Loan Duration (months)</label>
                  <input
                    type="number"
                    name="loanDuration"
                    value={formData.loanDuration}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/30"
                    placeholder="Months"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Minimum Payment</label>
                  <input
                    type="number"
                    name="minimumPayment"
                    value={formData.minimumPayment}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/30"
                    placeholder="₹"
                  />
                </div>
              </div>

              {/* Loan Type */}
              <div>
                <label className="block text-gray-300 mb-2">Loan Type</label>
                <select
                  name="loanType"
                  value={formData.loanType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/30"
                >
                  <option value="personal">Personal Loan</option>
                  <option value="home">Home Loan</option>
                  <option value="car">Car Loan</option>
                  <option value="education">Education Loan</option>
                  <option value="credit-card">Credit Card</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Document Upload */}
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Aadhar Card</label>
                  <input
                    type="file"
                    name="aadharCard"
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/30 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500/20 file:text-purple-200 hover:file:bg-purple-500/30"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">PAN Card</label>
                  <input
                    type="file"
                    name="panCard"
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/30 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500/20 file:text-purple-200 hover:file:bg-purple-500/30"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-500 hover:to-pink-500 transition-all duration-300 transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              >
                Calculate Repayment Plan
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}