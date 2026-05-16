import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export type BadgeId =
  | 'first_steps'
  | 'perfect_score'
  | 'on_fire'
  | 'week_warrior'
  | 'dsa_master'
  | 'speed_demon'
  | 'consistent'
  | 'high_achiever';

export interface IBadge {
  id: BadgeId;
  earnedAt: Date;
}

export interface ITopicStat {
  attempted: number;
  correct: number;
  total: number;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  targetRole: string;
  experience: string;
  skills: string[];
  // Streak
  currentStreak: number;
  longestStreak: number;
  lastPracticeDate?: Date;
  // Badges
  badges: IBadge[];
  // Topic mastery
  topicStats: Map<string, ITopicStat>;
  // Daily goal
  dailyGoal: number;
  questionsAnsweredToday: number;
  lastGoalResetDate?: Date;
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const BadgeSchema = new Schema<IBadge>(
  {
    id: { type: String, required: true },
    earnedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const TopicStatSchema = new Schema<ITopicStat>(
  {
    attempted: { type: Number, default: 0 },
    correct: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    avatar: { type: String },
    targetRole: { type: String, default: 'Software Engineer' },
    experience: {
      type: String,
      default: 'Entry Level',
      enum: ['Entry Level', 'Mid Level', 'Senior', 'Lead', 'Manager'],
    },
    skills: [{ type: String }],
    // Streak tracking
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastPracticeDate: { type: Date },
    // Badges
    badges: { type: [BadgeSchema], default: [] },
    // Topic mastery
    topicStats: { type: Map, of: TopicStatSchema, default: {} },
    // Daily goal
    dailyGoal: { type: Number, default: 10, enum: [5, 10, 15, 20] },
    questionsAnsweredToday: { type: Number, default: 0 },
    lastGoalResetDate: { type: Date },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model<IUser>('User', UserSchema);
