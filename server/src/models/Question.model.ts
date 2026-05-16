import mongoose, { Document, Schema } from 'mongoose';

export type QuestionType = 'behavioral' | 'dsa' | 'system-design' | 'technical' | 'frontend' | 'backend' | 'devops' | 'database' | 'javascript' | 'python' | 'react' | 'nodejs';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface IOption {
  text: string;
  isCorrect: boolean;
}

export interface IQuestion extends Document {
  text: string;
  type: QuestionType;
  difficulty: Difficulty;
  category: string;
  tags: string[];
  options: IOption[];
  explanation: string;
  timeLimit: number;
  createdAt: Date;
}

const OptionSchema = new Schema<IOption>({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
});

const QuestionSchema = new Schema<IQuestion>(
  {
    text: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ['behavioral', 'dsa', 'system-design', 'technical', 'frontend', 'backend', 'devops', 'database', 'javascript', 'python', 'react', 'nodejs'],
    },
    difficulty: {
      type: String,
      required: true,
      enum: ['easy', 'medium', 'hard'],
    },
    category: { type: String, required: true },
    tags: [{ type: String }],
    options: { type: [OptionSchema], required: true },
    explanation: { type: String, required: true },
    timeLimit: { type: Number, default: 30 },
  },
  { timestamps: true }
);

export default mongoose.model<IQuestion>('Question', QuestionSchema);
