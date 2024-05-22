import { Router } from 'express';
import { PromptServices } from '../services/prompt.service.js';

export const tokenRouter = Router();

const service = new PromptServices()


tokenRouter.post('/login', async ( req, res) => {
  const token = await service.generarToken(req, res)
  return token;
})


tokenRouter.post('/login/Private', async ( req, res) => {
  const {email , password} = req.body
  if (email || password) {
    const token = await service.generarToken(req, res)
    return token;
  }
  return res.status(401).json({ message: 'Do you need to authenticate to access this route?' });
})

tokenRouter.post('/refresh-token', async (req,res) => {
  const refreshToken = await service.refreshToken(req,res)
  return refreshToken;
})
