'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default function Dashboard() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', loans: [{ debtName: '', principalAmount: '', interestRate: '', minimumPayment: '' }] });
  const [processing, setProcessing] = useState(false);
  const [data, setData] = useState(null);

  const handleInputChange = (index, field, value) => {
    const updatedLoans = [...formData.loans];
    updatedLoans[index][field] = value;
    setFormData({ ...formData, loans: updatedLoans });
  };

  const addLoan = () => {
    setFormData({ ...formData, loans: [...formData.loans, { debtName: '', principalAmount: '', interestRate: '', minimumPayment: '' }] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      const response = await axios.post('/api/calculate', formData, { onDownloadProgress: (progressEvent) => {} });
      setData(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
    setProcessing(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Debt Repayment Dashboard</h1>

      {/* Form to collect data */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Enter User and Loan Details</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="User Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        {formData.loans.map((loan, index) => (
          <div key={index} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {['debtName', 'principalAmount', 'interestRate', 'minimumPayment'].map((field) => (
              <input
                key={field}
                type={field === 'debtName' ? 'text' : 'number'}
                placeholder={field.replace(/([A-Z])/g, ' $1').trim()}
                value={loan[field]}
                onChange={(e) => handleInputChange(index, field, e.target.value)}
                className="border p-2 rounded"
                required
              />
            ))}
          </div>
        ))}
        <button type="button" onClick={addLoan} className="bg-blue-500 text-white px-4 py-2 rounded">Add Loan</button>
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded ml-4" disabled={processing}>
          {processing ? 'Processing...' : 'Calculate'}
        </button>
      </form>

      {/* Loading Indicator */}
      {processing && <p className="text-center text-lg font-semibold">Calculating repayment schedule...</p>}

      {/* Chart Visualization */}
      {data && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Debt Payoff Progress</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data.avalanche.schedule}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              {data.avalanche.schedule[0]?.payments?.map((_, index) => (
                <Line
                  key={index}
                  type="monotone"
                  dataKey={`payments[${index}].remainingBalance`}
                  stroke={`hsl(${index * 137.5}, 70%, 50%)`}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
