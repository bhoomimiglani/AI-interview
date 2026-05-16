import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import { seedAllQuestions } from './services/seed.service';
import authRoutes from './routes/auth.routes';
import interviewRoutes from './routes/interview.routes';
import questionRoutes from './routes/question.routes';
import analyticsRoutes from './routes/analytics.routes';
import leaderboardRoutes from './routes/leaderboard.routes';
import { errorHandler } from './middleware/error.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    // Allow all vercel.app domains, localhost, and the configured CLIENT_URL
    const allowed = [
      process.env.CLIENT_URL,
      'http://localhost:5173',
      'http://localhost:3000',
    ].filter(Boolean);
    if (
      allowed.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin.endsWith('.onrender.com')
    ) {
      return callback(null, true);
    }
    return callback(null, true); // Allow all for now
  },
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', message: 'AI Interview Platform API is running' });
});

// Error handler
app.use(errorHandler);

// Start server
const startServer = async () => {
  await connectDB();
  await seedAllQuestions();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer();
