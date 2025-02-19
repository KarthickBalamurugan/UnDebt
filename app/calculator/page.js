'use client';
import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import Navbar from '@/Components/Navbar';
import Image from 'next/image';

export default function CalculatorPage() {
  // User Details State
  const [userDetails, setUserDetails] = useState({
    fullName: '',
    occupation: '',
    monthlySalary: '',
    companyName: '',
    workExperience: '',
    numberOfLoans: '1', // Default to 1 loan
  });

  // Loans State with Dynamic Number of Loans
  const [loans, setLoans] = useState([]);
  const [loanForms, setLoanForms] = useState([{
    debtName: '',
    principalAmount: '',
    interestRate: '',
    loanDuration: '',
    minimumPayment: '',
    loanType: 'personal',
    aadharNumber: '',
    panNumber: ''
  }]);

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

  // Add this validation function at the top of your component
  const validateForm = (userDetails, loanForms) => {
    // Validate user details
    if (userDetails.monthlySalary <= 0) {
      alert('Monthly salary must be greater than 0');
      return false;
    }

    if (userDetails.workExperience < 0) {
      alert('Work experience cannot be negative');
      return false;
    }

    if (parseInt(userDetails.numberOfLoans) < 1 || parseInt(userDetails.numberOfLoans) > 10) {
      alert('Number of loans must be between 1 and 10');
      return false;
    }

    // Validate each loan form
    for (let i = 0; i < loanForms.length; i++) {
      const loan = loanForms[i];

      if (!loan.debtName.trim()) {
        alert(`Loan ${i + 1}: Debt name is required`);
        return false;
      }

      if (loan.principalAmount <= 0) {
        alert(`Loan ${i + 1}: Principal amount must be greater than 0`);
        return false;
      }

      if (loan.interestRate <= 0 || loan.interestRate > 100) {
        alert(`Loan ${i + 1}: Interest rate must be between 0 and 100`);
        return false;
      }

      if (loan.loanDuration <= 0) {
        alert(`Loan ${i + 1}: Loan duration must be greater than 0`);
        return false;
      }

      if (loan.minimumPayment <= 0) {
        alert(`Loan ${i + 1}: Minimum payment must be greater than 0`);
        return false;
      }

      // Validate Aadhar Number (12 digits)
      if (!/^\d{12}$/.test(loan.aadharNumber)) {
        alert(`Loan ${i + 1}: Please enter a valid 12-digit Aadhar number`);
        return false;
      }

      // Validate PAN Number (ABCDE1234F format)
      if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(loan.panNumber)) {
        alert(`Loan ${i + 1}: Please enter a valid PAN number in format ABCDE1234F`);
        return false;
      }
    }

    return true;
  };

  // Handle User Details Change
  const handleUserDetailsChange = (e) => {
    const { name, value } = e.target;
    
    // Validate number of loans
    if (name === 'numberOfLoans') {
      if (value < 1) {
        alert('Number of loans must be at least 1');
        return;
      }
      if (value > 10) {
        alert('Maximum 10 loans allowed');
        return;
      }
    }

    // Validate monthly salary
    if (name === 'monthlySalary' && value < 0) {
      alert('Salary cannot be negative');
      return;
    }

    // Validate work experience
    if (name === 'workExperience' && value < 0) {
      alert('Work experience cannot be negative');
      return;
    }

    setUserDetails(prev => ({
      ...prev,
      [name]: value
    }));

    // If number of loans changes, update loan forms
    if (name === 'numberOfLoans') {
      const newCount = parseInt(value) || 0;
      setLoanForms(prev => {
        const newForms = [...prev];
        if (newCount > prev.length) {
          // Add more forms
          for (let i = prev.length; i < newCount; i++) {
            newForms.push({
              debtName: '',
              principalAmount: '',
              interestRate: '',
              loanDuration: '',
              minimumPayment: '',
              loanType: 'personal',
              aadharNumber: '',
              panNumber: ''
            });
          }
        } else {
          // Remove excess forms
          return newForms.slice(0, newCount);
        }
        return newForms;
      });
    }
  };

  // Handle Loan Form Changes
  const handleLoanFormChange = (index, e) => {
    const { name, value } = e.target;

    // Validate numeric fields
    if (['principalAmount', 'minimumPayment'].includes(name) && value < 0) {
      alert('Amount cannot be negative');
      return;
    }

    if (name === 'interestRate' && (value < 0 || value > 100)) {
      alert('Interest rate must be between 0 and 100');
      return;
    }

    if (name === 'loanDuration' && value < 1) {
      alert('Loan duration must be at least 1 month');
      return;
    }

    // Validate Aadhar number format
    if (name === 'aadharNumber' && value.length === 12 && !/^\d+$/.test(value)) {
      alert('Aadhar number must contain only digits');
      return;
    }

    // Validate PAN number format
    if (name === 'panNumber' && value.length === 10 && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value)) {
      alert('Invalid PAN number format');
      return;
    }

    setLoanForms(prev => {
      const newForms = [...prev];
      newForms[index] = {
        ...newForms[index],
        [name]: value
      };
      return newForms;
    });
  };

  // Handle Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm(userDetails, loanForms)) {
      return;
    }

    setLoans(loanForms);
    console.log('User Details:', userDetails);
    console.log('Loans:', loanForms);
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
              Let's start with your details
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* User Details Section */}
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-8 border border-white/10 mb-8">
              <h2 className="text-xl font-semibold text-white mb-6">Personal Details</h2>
              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-gray-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={userDetails.fullName}
                    onChange={handleUserDetailsChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/30"
                    required
                  />
                </div>

                {/* Occupation & Salary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 mb-2">Occupation</label>
                    <input
                      type="text"
                      name="occupation"
                      value={userDetails.occupation}
                      onChange={handleUserDetailsChange}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/30"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Monthly Salary</label>
                    <input
                      type="number"
                      name="monthlySalary"
                      value={userDetails.monthlySalary}
                      onChange={handleUserDetailsChange}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/30"
                      placeholder="₹"
                      required
                    />
                  </div>
                </div>

                {/* Company & Experience */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 mb-2">Company Name</label>
                    <input
                      type="text"
                      name="companyName"
                      value={userDetails.companyName}
                      onChange={handleUserDetailsChange}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/30"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Work Experience (years)</label>
                    <input
                      type="number"
                      name="workExperience"
                      value={userDetails.workExperience}
                      onChange={handleUserDetailsChange}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/30"
                      required
                    />
                  </div>
                </div>

                {/* Number of Loans */}
                <div>
                  <label className="block text-gray-300 mb-2">Number of Loans</label>
                  <input
                    type="number"
                    name="numberOfLoans"
                    value={userDetails.numberOfLoans}
                    onChange={handleUserDetailsChange}
                    min="1"
                    max="10"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/30"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Dynamic Loan Forms */}
            {loanForms.map((loan, index) => (
              <div key={index} className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-8 border border-white/10 mb-8">
                <h2 className="text-xl font-semibold text-white mb-6">Loan {index + 1}</h2>
                <div className="space-y-6">
                  {/* Debt Name */}
                  <div>
                    <label className="block text-gray-300 mb-2">Debt Name</label>
                    <input
                      type="text"
                      name="debtName"
                      value={loan.debtName}
                      onChange={(e) => handleLoanFormChange(index, e)}
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
                        value={loan.principalAmount}
                        onChange={(e) => handleLoanFormChange(index, e)}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/30"
                        placeholder="₹"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Interest Rate (%)</label>
                      <input
                        type="number"
                        name="interestRate"
                        value={loan.interestRate}
                        onChange={(e) => handleLoanFormChange(index, e)}
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
                        value={loan.loanDuration}
                        onChange={(e) => handleLoanFormChange(index, e)}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/30"
                        placeholder="Months"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Minimum Payment</label>
                      <input
                        type="number"
                        name="minimumPayment"
                        value={loan.minimumPayment}
                        onChange={(e) => handleLoanFormChange(index, e)}
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
                      value={loan.loanType}
                      onChange={(e) => handleLoanFormChange(index, e)}
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
                        value={loan.aadharNumber}
                        onChange={(e) => handleLoanFormChange(index, e)}
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
                        value={loan.panNumber}
                        onChange={(e) => handleLoanFormChange(index, e)}
                        placeholder="Enter 10-digit PAN number"
                        maxLength="10"
                        pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white uppercase focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/30"
                      />
                      <p className="text-xs text-gray-400 mt-1">Format: ABCDE1234F</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-500 hover:to-pink-500 transition-all duration-300 transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              Calculate Repayment Plan
            </button>
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