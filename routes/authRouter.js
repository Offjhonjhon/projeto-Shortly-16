import { Router } from 'express';
import { signIn, signUp } from '../controllers/authController.js';
import { validateSignUp } from '../middlewares/signUpValidation.js';
import { validateSignIn } from '../middlewares/signInValidation.js';

const authRouter = Router();

authRouter.post("/signup", validateSignUp, signUp);
authRouter.post("/signin", validateSignIn, signIn);

export default authRouter;