// import { UserService } from '../../services/user.service.js';
// import { isAdmin, verificationToken } from '../../middlewares/verificationToken.js';
import { Router } from 'express';
import { WtsppService } from '../../services/wtsppService.service.js';

export const whatsAppRoutes = Router();

const service = new WtsppService();

whatsAppRoutes.get('/', async (req, res) => {
  const tokenVerify =  service.VerifyToken(req, res)
  return tokenVerify;
})

whatsAppRoutes.post('/', async (req, res) => {
  const message = await service.ReceivedMessage(req, res)
  return message;
})


