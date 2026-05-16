# AI Interview Preparation Platform

A full-stack AI-powered mock interview platform with voice input, real-time AI feedback, behavioral + DSA questions, and performance analytics.

live link - ai-interview-opal-delta.vercel.app

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS |
| Backend | Node.js + Express + TypeScript |
| Database | MongoDB + Mongoose |
| AI | OpenAI GPT-4o-mini (feedback) + Whisper (voice) |
| Charts | Recharts |
| Auth | JWT |

## Features

- **Mock Interviews** — Behavioral, DSA, System Design, or Mixed
- **Voice Input** — Record answers via microphone, transcribed by Whisper AI
- **AI Feedback** — Instant scoring on communication, technical depth, and confidence
- **Performance Analytics** — Score trends, skill radar, type/difficulty breakdown
- **Interview History** — Review all past sessions with full feedback
- **User Profiles** — Track target role, experience level, and skills

## Setup

### 1. MongoDB Atlas

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a database user and get your connection string
3. Whitelist your IP (or use `0.0.0.0/0` for development)

### 2. OpenAI API Key

Get your key at [platform.openai.com](https://platform.openai.com)

### 3. Configure Environment

Edit `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/ai-interview
JWT_SECRET=your_long_random_secret
OPENAI_API_KEY=sk-your-key-here
CLIENT_URL=http://localhost:5173
```

### 4. Run the App

**Backend:**
```bash
cd server
npm run dev
```

**Frontend (new terminal):**
```bash
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Project Structure

```
├── client/                 # React frontend
│   └── src/
│       ├── pages/          # Route pages
│       ├── components/     # Shared components
│       ├── context/        # Auth context
│       ├── services/       # API calls
│       └── types/          # TypeScript types
│
└── server/                 # Express backend
    └── src/
        ├── models/         # MongoDB models
        ├── routes/         # API routes
        ├── controllers/    # Route handlers
        ├── services/       # AI + seed services
        ├── middleware/     # Auth + error
        └── config/         # DB connection
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/profile` | Get profile |
| POST | `/api/interviews/start` | Start interview |
| POST | `/api/interviews/:id/answer` | Submit answer + get AI feedback |
| POST | `/api/interviews/transcribe` | Transcribe voice to text |
| POST | `/api/interviews/:id/complete` | Complete interview |
| GET | `/api/analytics/dashboard` | Dashboard stats |
| GET | `/api/analytics/progress` | Progress report |
