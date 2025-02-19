import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    await connectDB();
    // Your database operations here
    return Response.json({ message: 'Connected to MongoDB!' });
  } catch (error) {
    return Response.json({ error: 'Failed to connect to MongoDB' }, { status: 500 });
  }
} 