import { Router, Request, Response } from 'express';
import Question from '../models/Question.model';
import { authenticate } from '../middleware/auth.middleware';
import { seedQuestions } from '../services/seed.service';

const router = Router();

router.use(authenticate);

router.get('/', async (req: Request, res: Response) => {
  try {
    await seedQuestions();
    const { type, difficulty, category } = req.query;
    const query: any = {};
    if (type) query.type = type;
    if (difficulty) query.difficulty = difficulty;
    if (category) query.category = category;

    const questions = await Question.find(query).sort({ createdAt: -1 });
    res.json({ questions });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching questions', error });
  }
});

router.get('/categories', async (_req: Request, res: Response) => {
  try {
    const categories = await Question.distinct('category');
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error });
  }
});

export default router;
