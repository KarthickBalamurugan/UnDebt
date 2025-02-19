'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function DBTest() {
  const { data: session, status } = useSession();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');

  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    redirect('/login');
  }

  const fetchData = async () => {
    try {
      const response = await fetch('/api/dbtest');
      const result = await response.json();
      if (result.success) {
        setData(result.data);
        setText(result.data?.text || ''); // Set text input if data exists
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/dbtest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      const result = await response.json();
      if (result.success) {
        await fetchData();
      }
    } catch (error) {
      console.error('Error updating data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Your Data</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="text" className="block text-sm font-medium text-gray-700">
            Your Text
          </label>
          <input
            type="text"
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter your text"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {loading ? 'Saving...' : 'Save Data'}
        </button>
      </form>

      {data && (
        <div className="mt-8 border p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Stored Data:</h2>
          <p className="mt-2">{data.text}</p>
          <p className="text-sm text-gray-500">
            Last updated: {new Date(data.timestamp).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
} 