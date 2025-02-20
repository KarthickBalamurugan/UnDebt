'use client';
import Navbar from '@/Components/Navbar';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis, YAxis
} from 'recharts';

// Colors for pie chart
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c'];

// Create a wrapper component for the search params functionality
function DashboardContent() {
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

  // Calculate repayment strategies
  const calculateRepaymentStrategies = (loans, monthlyBudget) => {
    // Helper function to calculate monthly interest
    const calculateMonthlyInterest = (principal, rate) => {
      return principal * (rate / 100 / 12);
    };

    // Deep clone loans array for each strategy
    const getLoansClone = () => loans.map(loan => ({
      ...loan,
      currentBalance: parseFloat(loan.principalAmount),
      rate: parseFloat(loan.interestRate),
      minimumPayment: parseFloat(loan.minimumPayment)
    }));

    const totalMinPayment = loans.reduce((sum, loan) => sum + parseFloat(loan.minimumPayment), 0);
    const extraPayment = monthlyBudget - totalMinPayment;

    // Calculate strategies
    const strategies = {
      avalanche: { data: [], totalInterest: 0 },
      snowball: { data: [], totalInterest: 0 },
      hybrid: { data: [], totalInterest: 0 }
    };

    // Simulate each strategy
    Object.keys(strategies).forEach(strategy => {
      const loansClone = getLoansClone();
      let month = 0;
      let totalBalance = loansClone.reduce((sum, loan) => sum + loan.currentBalance, 0);
      
      while (totalBalance > 0 && month < 360) { // 30 years max
        let monthlyData = {
          month,
          totalBalance
        };

        // Apply minimum payments and calculate interest
        loansClone.forEach(loan => {
          if (loan.currentBalance > 0) {
            const interest = calculateMonthlyInterest(loan.currentBalance, loan.rate);
            strategies[strategy].totalInterest += interest;
            loan.currentBalance += interest;
            
            const payment = Math.min(loan.minimumPayment, loan.currentBalance);
            loan.currentBalance -= payment;
          }
        });

        // Apply extra payment according to strategy
        if (extraPayment > 0) {
          let remainingExtra = extraPayment;
          const activeLoansSorted = loansClone
            .filter(loan => loan.currentBalance > 0)
            .sort((a, b) => {
              switch(strategy) {
                case 'avalanche':
                  return b.rate - a.rate;
                case 'snowball':
                  return a.currentBalance - b.currentBalance;
                case 'hybrid':
                  return (b.rate * b.currentBalance) - (a.rate * a.currentBalance);
                default:
                  return 0;
              }
            });

          if (activeLoansSorted.length > 0) {
            const targetLoan = activeLoansSorted[0];
            const extraPaymentApplied = Math.min(remainingExtra, targetLoan.currentBalance);
            targetLoan.currentBalance -= extraPaymentApplied;
          }
        }

        totalBalance = loansClone.reduce((sum, loan) => sum + loan.currentBalance, 0);
        monthlyData.totalBalance = totalBalance;
        strategies[strategy].data.push(monthlyData);
        month++;
      }
    });

    return strategies;
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

  // Calculate monthly budget
  const monthlyBudget = calculationData ? 
    parseFloat(calculationData.userDetails.monthlySalary) * 0.5 : // Assuming 50% of salary for debt repayment
    0;

  // Calculate repayment strategies
  const strategies = calculationData ?
    calculateRepaymentStrategies(calculationData.loans, monthlyBudget) :
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

            {/* Debt Repayment Strategies Comparison */}
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-8 border border-white/10 mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Debt Repayment Strategy Comparison</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart>
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
                  <Tooltip 
                    formatter={(value) => `₹${value.toLocaleString()}`}
                    contentStyle={{ background: '#1a1a2e' }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    data={strategies?.avalanche.data}
                    dataKey="totalBalance"
                    stroke="#ff4d4d"
                    name="Avalanche Method"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    data={strategies?.snowball.data}
                    dataKey="totalBalance"
                    stroke="#4caf50"
                    name="Snowball Method"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    data={strategies?.hybrid.data}
                    dataKey="totalBalance"
                    stroke="#ffd700"
                    name="Hybrid Method"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
              
              {/* Strategy Comparison Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                {Object.entries(strategies || {}).map(([strategy, data]) => (
                  <div key={strategy} className="text-center">
                    <h4 className="text-white capitalize mb-2">{strategy} Method</h4>
                    <p className="text-gray-400">Total Interest</p>
                    <p className="text-white font-bold">
                      ₹{data.totalInterest.toLocaleString(undefined, {
                        maximumFractionDigits: 0
                      })}
                    </p>
                    <p className="text-gray-400 mt-2">Time to Debt-Free</p>
                    <p className="text-white font-bold">
                      {data.data.length} months
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Loans Section */}
            <div className="space-y-6 pb-28">
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

// Main Dashboard component with Suspense
export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#0A0118]">
      <Navbar />
      <Suspense fallback={
        <div className="container mx-auto px-4 pt-32">
          <div className="text-white text-center">Loading...</div>
        </div>
      }>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
