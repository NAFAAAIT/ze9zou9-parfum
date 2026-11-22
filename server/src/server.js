import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';

const port = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ze9zou9_parfum')
  .then(() => app.listen(port, () => console.log(`API listening on ${port}`)))
  .catch((error) => { console.error('MongoDB connection failed:', error.message); process.exit(1); });
