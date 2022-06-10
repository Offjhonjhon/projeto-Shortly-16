import { Router } from 'express';
import authRouter from './authRouter.js';
import urlRouter from './urlRouter.js';
import userRouter from './userRouter.js';
import rankingRouter from './rankingRouter.js';

const router = Router();
router.use(authRouter);
router.use(urlRouter);
router.use(userRouter);
router.use(rankingRouter);

export default router;