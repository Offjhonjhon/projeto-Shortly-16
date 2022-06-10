import { Router } from 'express';

import { getUsersId } from '../controllers/usersController.js';

const userRouter = Router();
userRouter.get('/users/:id', getUsersId);

export default userRouter;