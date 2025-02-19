'use client';
import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import Navbar from '@/Components/Navbar';
import Image from 'next/image';

export default function CalculatorPage() {
  const [loans, setLoans] = useState([]);
  const [formData, setFormData] = useState({
    debtName: '',
    principalAmount: '',
    interestRate: '',
    loanDuration: '',
    minimumPayment: '',
    loanType: 'personal',
    aadharNumber: '',
    panNumber: ''
  });

  const titleRef = useRef(null);
  const formRef = useRef(null);
  const orbRef = useRef(null);
  const fileInputRef = useRef(null);

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
    
    // Add new loan to the loans array
    setLoans(prevLoans => [...prevLoans, { ...formData, id: Date.now() }]);
    
    // Reset form data in state
    setFormData({
      debtName: '',
      principalAmount: '',
      interestRate: '',
      loanDuration: '',
      minimumPayment: '',
      loanType: 'personal',
      aadharNumber: '',
      panNumber: ''
    });

    // Reset the entire form using the HTML form API
    e.target.reset();
  };

  const deleteLoan = (loanId) => {
    setLoans(prevLoans => prevLoans.filter(loan => loan.id !== loanId));
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
            className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-8 border border-white/10 mb-12"
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
              <div className="mb-6">
                <label className="block text-gray-300 mb-2">Loan Type</label>
                <select
                  name="loanType"
                  value={formData.loanType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.08] border border-white/20 text-white focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/30"
                >
                  <option value="personal" className="bg-[#1a1a2e]">Personal Loan</option>
                  <option value="home" className="bg-[#1a1a2e]">Home Loan</option>
                  <option value="car" className="bg-[#1a1a2e]">Car Loan</option>
                  <option value="education" className="bg-[#1a1a2e]">Education Loan</option>
                  <option value="credit-card" className="bg-[#1a1a2e]">Credit Card</option>
                  <option value="other" className="bg-[#1a1a2e]">Other</option>
                </select>
              </div>

              {/* Document Numbers Section */}
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Aadhar Number</label>
                  <input
                    type="text"
                    name="aadharNumber"
                    value={formData.aadharNumber}
                    onChange={handleInputChange}
                    placeholder="Enter 12-digit Aadhar number"
                    maxLength="12"
                    pattern="\d{12}"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/30"
                  />
                  <p className="text-xs text-gray-400 mt-1">Format: 123456789012</p>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">PAN Number</label>
                  <input
                    type="text"
                    name="panNumber"
                    value={formData.panNumber}
                    onChange={handleInputChange}
                    placeholder="Enter 10-digit PAN number"
                    maxLength="10"
                    pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white uppercase focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/30"
                  />
                  <p className="text-xs text-gray-400 mt-1">Format: ABCDE1234F</p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-500 hover:to-pink-500 transition-all duration-300 transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              >
                Add Loan
              </button>
            </div>
          </form>

          {/* Loans List */}
          {loans.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Your Loans</h2>
              <div className="grid gap-6">
                {loans.map(loan => (
                  <div 
                    key={loan.id}
                    className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {loan.debtName}
                        </h3>
                        <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 text-sm">
                          {loan.loanType.charAt(0).toUpperCase() + loan.loanType.slice(1)}
                        </span>
                      </div>
                      <button
                        onClick={() => deleteLoan(loan.id)}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Principal</p>
                        <p className="text-white">₹{loan.principalAmount}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Interest Rate</p>
                        <p className="text-white">{loan.interestRate}%</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Duration</p>
                        <p className="text-white">{loan.loanDuration} months</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Min. Payment</p>
                        <p className="text-white">₹{loan.minimumPayment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Section */}
              <div className="mt-8 bg-white/[0.05] backdrop-blur-xl rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400">Total Debt</p>
                    <p className="text-2xl font-bold text-white">
                      ₹{loans.reduce((sum, loan) => sum + Number(loan.principalAmount), 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Number of Loans</p>
                    <p className="text-2xl font-bold text-white">{loans.length}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}