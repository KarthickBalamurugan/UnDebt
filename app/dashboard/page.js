'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/Components/Navbar';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, RadialBarChart, RadialBar
} from 'recharts';

export default function Dashboard() {
  const [calculationData, setCalculationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const calculationId = searchParams.get('id');

  // Colors for pie chart
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c'];

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

  // Calculate monthly payments data for line chart
  const calculateMonthlyPayments = (loans) => {
    const monthlyData = [];
    const maxDuration = Math.max(...loans.map(loan => parseInt(loan.loanDuration)));

    for (let month = 0; month <= maxDuration; month++) {
      const dataPoint = {
        month,
        totalBalance: 0,
      };

      loans.forEach((loan, index) => {
        const principal = parseFloat(loan.principalAmount);
        const rate = parseFloat(loan.interestRate) / 100 / 12;
        const duration = parseInt(loan.loanDuration);
        
        if (month <= duration) {
          const monthlyPayment = parseFloat(loan.minimumPayment);
          const remainingBalance = principal * Math.pow(1 + rate, duration) * 
            (1 - Math.pow(1 + rate, month)) / (1 - Math.pow(1 + rate, duration));
          
          dataPoint[`loan${index + 1}`] = remainingBalance;
          dataPoint.totalBalance += remainingBalance;
        }
      });

      monthlyData.push(dataPoint);
    }

    return monthlyData;
  };

  // Calculate additional metrics
  const calculateMetrics = (loans, monthlySalary) => {
    const salary = parseFloat(monthlySalary);
    const totalMonthlyPayment = loans.reduce((sum, loan) => 
      sum + parseFloat(loan.minimumPayment), 0);
    
    const debtToIncomeRatio = (totalMonthlyPayment / salary) * 100;
    
    const loanMetrics = loans.map(loan => {
      const principal = parseFloat(loan.principalAmount);
      const rate = parseFloat(loan.interestRate) / 100 / 12;
      const duration = parseInt(loan.loanDuration);
      const monthlyPayment = parseFloat(loan.minimumPayment);
      
      const totalPayment = monthlyPayment * duration;
      const totalInterest = totalPayment - principal;
      
      return {
        name: loan.debtName,
        principal,
        totalInterest,
        monthlyPayment,
        paymentPercentage: (monthlyPayment / salary) * 100
      };
    });

    return {
      debtToIncomeRatio,
      loanMetrics,
      totalMonthlyPayment
    };
  };

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

  // Prepare data for pie chart
  const pieData = calculationData?.loans.map(loan => ({
    name: loan.debtName,
    value: parseFloat(loan.principalAmount)
  })) || [];

  // Calculate monthly payments data
  const monthlyPaymentsData = calculationData ? calculateMonthlyPayments(calculationData.loans) : [];

  const metrics = calculationData ? 
    calculateMetrics(calculationData.loans, calculationData.userDetails.monthlySalary) : 
    null;

  return (
    <div className="min-h-screen bg-[#0A0118]">
      <Navbar />
      <div className="container mx-auto px-4 pt-32">
        {calculationData && (
          <div className="max-w-6xl mx-auto">
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

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Loan Distribution Pie Chart */}
              <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-8 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">Loan Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Loan Balance Progress Chart */}
              <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-8 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">Balance Progress</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyPaymentsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#ffffff80"
                      label={{ value: 'Months', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                      stroke="#ffffff80"
                      label={{ value: 'Balance (₹)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip />
                    <Legend />
                    {calculationData.loans.map((loan, index) => (
                      <Line
                        key={index}
                        type="monotone"
                        dataKey={`loan${index + 1}`}
                        stroke={COLORS[index % COLORS.length]}
                        name={loan.debtName}
                      />
                    ))}
                    <Line
                      type="monotone"
                      dataKey="totalBalance"
                      stroke="#fff"
                      name="Total Balance"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* New Visualizations Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Monthly Payment Breakdown */}
              <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-8 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">Monthly Payment Breakdown</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={metrics.loanMetrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis dataKey="name" stroke="#ffffff80" />
                    <YAxis stroke="#ffffff80" />
                    <Tooltip 
                      formatter={(value) => `₹${value.toLocaleString()}`}
                      contentStyle={{ background: '#1a1a2e' }}
                    />
                    <Legend />
                    <Bar dataKey="monthlyPayment" fill="#8884d8" name="Monthly Payment" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 text-center text-white">
                  <p className="text-gray-400">Total Monthly Payment</p>
                  <p className="text-2xl font-bold">₹{metrics.totalMonthlyPayment.toLocaleString()}</p>
                </div>
              </div>

              {/* Debt-to-Income Ratio Gauge */}
              <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-8 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">Debt-to-Income Ratio</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadialBarChart 
                    innerRadius="60%" 
                    outerRadius="100%"
                    data={[{
                      name: 'DTI Ratio',
                      value: Math.min(metrics.debtToIncomeRatio, 100),
                      fill: metrics.debtToIncomeRatio > 40 ? '#ff4d4d' : 
                             metrics.debtToIncomeRatio > 30 ? '#ffd700' : '#4caf50'
                    }]}
                    startAngle={180}
                    endAngle={0}
                  >
                    <RadialBar
                      background
                      dataKey="value"
                      cornerRadius={30}
                    />
                    <Legend 
                      iconSize={0}
                      content={() => (
                        <div className="text-center text-white mt-4">
                          <p className="text-3xl font-bold">
                            {metrics.debtToIncomeRatio.toFixed(1)}%
                          </p>
                          <p className="text-gray-400 mt-2">
                            {metrics.debtToIncomeRatio > 40 ? 'High Risk' :
                             metrics.debtToIncomeRatio > 30 ? 'Moderate Risk' : 'Healthy'}
                          </p>
                        </div>
                      )}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>

              {/* Interest vs Principal Comparison */}
              <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-8 border border-white/10 md:col-span-2">
                <h3 className="text-xl font-semibold text-white mb-4">Interest vs Principal</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={metrics.loanMetrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis dataKey="name" stroke="#ffffff80" />
                    <YAxis stroke="#ffffff80" />
                    <Tooltip 
                      formatter={(value) => `₹${value.toLocaleString()}`}
                      contentStyle={{ background: '#1a1a2e' }}
                    />
                    <Legend />
                    <Bar dataKey="principal" stackId="a" fill="#82ca9d" name="Principal" />
                    <Bar dataKey="totalInterest" stackId="a" fill="#ff8042" name="Total Interest" />
                  </BarChart>
                </ResponsiveContainer>
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
