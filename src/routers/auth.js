import { Router } from "express";

import { validateBody } from '../middlewares/validateBody.js';
import  ctrlWrapper  from '../utils/ctrlWrapper.js';
import { registerUserSchema, loginUserSchema } from '../validation/auth.js';
import * as authControllers from '../controllers/auth.js';



const authRouter = Router();

authRouter.post('/register', validateBody(registerUserSchema), ctrlWrapper(authControllers.registerUserController));
authRouter.post('/login', validateBody(loginUserSchema), ctrlWrapper(authControllers.loginUserController));
authRouter.post('/refresh', ctrlWrapper(authControllers.refreshSessionControllers));
authRouter.post('/logout', ctrlWrapper(authControllers.logoutControllers));

export default authRouter;