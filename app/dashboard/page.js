'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/Components/Navbar';

export default function Dashboard() {
  const [calculationData, setCalculationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const calculationId = searchParams.get('id');

  useEffect(() => {
    const fetchCalculation = async () => {
      try {
        const response = await fetch(`/api/calculations/${calculationId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch calculation data');
        }
        const data = await response.json();
        setCalculationData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (calculationId) {
      fetchCalculation();
    }
  }, [calculationId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0118]">
        <Navbar />
        <div className="container mx-auto px-4 pt-32">
          <div className="text-white text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0118]">
        <Navbar />
        <div className="container mx-auto px-4 pt-32">
          <div className="text-red-500 text-center">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0118]">
      <Navbar />
      <div className="container mx-auto px-4 pt-32">
        {calculationData && (
          <div className="max-w-4xl mx-auto">
            {/* User Details Section */}
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-8 border border-white/10 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">Personal Details</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-400">Full Name</p>
                  <p className="text-white text-lg">{calculationData.userDetails.fullName}</p>
                </div>
                <div>
                  <p className="text-gray-400">Occupation</p>
                  <p className="text-white text-lg">{calculationData.userDetails.occupation}</p>
                </div>
                <div>
                  <p className="text-gray-400">Monthly Salary</p>
                  <p className="text-white text-lg">₹{calculationData.userDetails.monthlySalary}</p>
                </div>
                <div>
                  <p className="text-gray-400">Company</p>
                  <p className="text-white text-lg">{calculationData.userDetails.companyName}</p>
                </div>
              </div>
            </div>

            {/* Loans Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Loan Details</h2>
              {calculationData.loans.map((loan, index) => (
                <div 
                  key={index}
                  className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-6 border border-white/10"
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
          </div>
        )}
      </div>
    </div>
  );
}
