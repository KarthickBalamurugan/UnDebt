import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

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
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    // Find only the current user's data
    const test = await Test.findOne({ userId: session.user.id });
    return Response.json({ success: true, data: test });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
} 