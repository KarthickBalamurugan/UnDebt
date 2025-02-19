import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { NextResponse } from 'next/server';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

// Configure mongoose options
mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s
    };

    return await mongoose.connect(uri, opts);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Updated schema to include userId and text input
const TestSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true  // This ensures one document per user
  },
  text: {
    type: String,
    required: true
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});

const Test = mongoose.models.Test || mongoose.model('Test', TestSchema);

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const data = await request.json();
    
    // Update if exists, create if doesn't (upsert)
    const updatedTest = await Test.findOneAndUpdate(
      { userId: session.user.id },  // find by userId
      { 
        text: data.text,
        timestamp: new Date()
      },
      { 
        upsert: true,    // create if doesn't exist
        new: true        // return updated document
      }
    );

    return Response.json({ success: true, data: updatedTest });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    
    // Simple ping to test connection
    const adminDb = mongoose.connection.db.admin();
    await adminDb.ping();
    
    return NextResponse.json({ status: 'Connected successfully to MongoDB' });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to connect to database',
        details: error.message 
      },
      { status: 500 }
    );
  }
}