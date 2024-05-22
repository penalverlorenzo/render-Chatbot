// import { UserService } from '../../services/user.service.js';
// import { isAdmin, verificationToken } from '../../middlewares/verificationToken.js';
import { Router } from 'express';
import { WtsppService } from '../../services/wtsppService.service.js';

export const whatsAppRoutes = Router();

const service = new WtsppService();

whatsAppRoutes.get('/', async (req, res) => {
  const user = await service.VerifyToken(req, res)
  return user;
})

whatsAppRoutes.post('/', async (req, res) => {
  const user = await service.createUser(req, res)
  return user;
})


