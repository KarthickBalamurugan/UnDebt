import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

// Create a simple schema for test data
const TestSchema = new mongoose.Schema({
  message: String,
  timestamp: { type: Date, default: Date.now }
});

// Get or create the model
const Test = mongoose.models.Test || mongoose.model('Test', TestSchema);

export async function POST() {
  try {
    await connectDB();
    const newTest = await Test.create({ message: "Test data " + new Date().toLocaleString() });
    return Response.json({ success: true, data: newTest });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const tests = await Test.find({}).sort({ timestamp: -1 });
    return Response.json({ success: true, data: tests });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
} 