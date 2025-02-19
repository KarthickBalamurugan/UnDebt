'use client';
import { useState, useEffect } from 'react';

export default function DBTest() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/dbtest');
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAddData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/dbtest', {
        method: 'POST',
      });
      const result = await response.json();
      if (result.success) {
        // Fetch updated data after posting
        await fetchData();
      }
    } catch (error) {
      console.error('Error adding data:', error);
    }
    setLoading(false);
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">MongoDB Test</h1>
      
      <button
        onClick={handleAddData}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        {loading ? 'Adding...' : 'Add Test Data'}
      </button>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Stored Data:</h2>
        {data.map((item) => (
          <div
            key={item._id}
            className="border p-4 rounded shadow"
          >
            <p>{item.message}</p>
            <p className="text-sm text-gray-500">
              {new Date(item.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
} 