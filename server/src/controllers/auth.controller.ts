import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.model';
import { resetDailyGoalIfNeeded } from '../services/badge.service';

const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '7d',
  });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, targetRole, experience, skills } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'Email already registered' });
      return;
    }

    const user = await User.create({
      name,
      email,
      password,
      targetRole: targetRole || 'Software Engineer',
      experience: experience || 'Entry Level',
      skills: skills || [],
    });

    const token = generateToken(user._id.toString());
    res.status(201).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration', error });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    // Reset daily goal if needed on login
    resetDailyGoalIfNeeded(user);
    await user.save();

    const token = generateToken(user._id.toString());
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login', error });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById((req as any).userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Reset daily goal if needed
    resetDailyGoalIfNeeded(user);
    await user.save();

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, targetRole, experience, skills, dailyGoal } = req.body;

    const updateData: Record<string, unknown> = { name, targetRole, experience, skills };
    if (dailyGoal && [5, 10, 15, 20].includes(Number(dailyGoal))) {
      updateData.dailyGoal = Number(dailyGoal);
    }

    const user = await User.findByIdAndUpdate(
      (req as any).userId,
      updateData,
      { new: true, runValidators: true }
    );
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
