/**
 * Migration script: adds new fields to existing User documents
 * Run with: npx ts-node scripts/migrate-users.ts
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function migrate() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/interview-platform';
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  const result = await mongoose.connection.collection('users').updateMany(
    {},
    {
      $set: {
        currentStreak: 0,
        longestStreak: 0,
        badges: [],
        topicStats: {},
        dailyGoal: 10,
        questionsAnsweredToday: 0,
      },
    },
    { upsert: false }
  );

  console.log(`Migrated ${result.modifiedCount} users`);
  await mongoose.disconnect();
  console.log('Done');
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
