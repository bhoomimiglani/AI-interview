import mongoose, { Document, Schema } from 'mongoose';

export interface IAnswerFeedback {
  isCorrect: boolean;
  selectedOptionIndex: number;
  correctOptionIndex: number;
  explanation: string;
  score: number; // 100 if correct, 0 if wrong
}

export interface IAnswer {
  questionId: mongoose.Types.ObjectId;
  questionText: string;
  selectedOptionIndex: number;
  timeTaken: number;
  feedback?: IAnswerFeedback;
  submittedAt: Date;
}

export interface IInterview extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  type: 'behavioral' | 'dsa' | 'mixed' | 'system-design' | 'technical' | 'frontend' | 'backend' | 'devops' | 'database' | 'javascript' | 'python' | 'react' | 'nodejs' | 'challenge';
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'in-progress' | 'completed' | 'abandoned';
  isChallenge: boolean;
  answers: IAnswer[];
  overallScore?: number;
  overallFeedback?: string;
  duration: number;
  questionsCount: number;
  correctCount?: number;
  completedAt?: Date;
  createdAt: Date;
}

const AnswerFeedbackSchema = new Schema<IAnswerFeedback>({
  isCorrect: { type: Boolean },
  selectedOptionIndex: { type: Number },
  correctOptionIndex: { type: Number },
  explanation: { type: String },
  score: { type: Number, min: 0, max: 100 },
});

const AnswerSchema = new Schema<IAnswer>({
  questionId: { type: Schema.Types.ObjectId, ref: 'Question' },
  questionText: { type: String, required: true },
  selectedOptionIndex: { type: Number, required: true },
  timeTaken: { type: Number, default: 0 },
  feedback: { type: AnswerFeedbackSchema },
  submittedAt: { type: Date, default: Date.now },
});

const InterviewSchema = new Schema<IInterview>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ['behavioral', 'dsa', 'mixed', 'system-design', 'technical', 'frontend', 'backend', 'devops', 'database', 'javascript', 'python', 'react', 'nodejs', 'challenge'],
    },
    isChallenge: { type: Boolean, default: false },
    difficulty: {
      type: String,
      required: true,
      enum: ['easy', 'medium', 'hard'],
    },
    status: {
      type: String,
      default: 'in-progress',
      enum: ['in-progress', 'completed', 'abandoned'],
    },
    answers: [AnswerSchema],
    overallScore: { type: Number, min: 0, max: 100 },
    overallFeedback: { type: String },
    duration: { type: Number, default: 0 },
    questionsCount: { type: Number, required: true },
    correctCount: { type: Number, default: 0 },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<IInterview>('Interview', InterviewSchema);
