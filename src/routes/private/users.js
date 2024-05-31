import { Router } from 'express';
import { UserService } from '../../services/user.service.js';
import { isAdmin, verificationToken } from '../../middlewares/verificationToken.js';

export const userRouter = Router();

const service = new UserService();

userRouter.use([verificationToken, isAdmin]);

userRouter.get('/users', async (req, res) => {
  const user = await service.getAll(res)
  return user;
})

userRouter.post('/users', async (req, res) => {
  const user = await service.createUser(req, res)
  return user;
})


