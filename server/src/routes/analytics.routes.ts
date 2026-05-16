import { Router } from 'express';
import { getDashboardStats, getProgressReport } from '../controllers/analytics.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/dashboard', getDashboardStats);
router.get('/progress', getProgressReport);

export default router;
