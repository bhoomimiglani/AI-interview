import { Router } from 'express';
import {
  startInterview,
  submitAnswer,
  completeInterview,
  getInterviews,
  getInterviewById,
} from '../controllers/interview.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/start', startInterview);
router.post('/:interviewId/answer', submitAnswer);
router.post('/:interviewId/complete', completeInterview);
router.get('/', getInterviews);
router.get('/:interviewId', getInterviewById);

export default router;
