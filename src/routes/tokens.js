import { Router } from 'express';
import { PromptServices } from '../services/prompt.service.js';

export const tokenRouter = Router();

const service = new PromptServices()


tokenRouter.post('/login', async ( req, res) => {
  const token = await service.generarToken(req, res)
  return token;
})

tokenRouter.post('/refresh-token', async (res) => {
  const Hola = await service.Hola()
  return Hola;
})
