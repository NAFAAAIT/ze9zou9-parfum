import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`API listening on ${port}`));

async function connectDatabase() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ze9zou9_parfum';
  while (mongoose.connection.readyState !== 1) {
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
      console.log('MongoDB connected');
      return;
    } catch (error) {
      console.error('MongoDB connection failed:', {
        name: error.name,
        message: error.message,
        code: error.code,
        causeCode: error.cause?.code,
        causeMessage: error.cause?.message,
        reasonType: error.reason?.type,
        reasonMessage: error.reason?.message,
        reasonServers: error.reason?.servers
          ? Object.fromEntries(error.reason.servers.entries())
          : undefined
      });
      await new Promise((resolve) => setTimeout(resolve, 10000));
    }
  }
}

connectDatabase();
