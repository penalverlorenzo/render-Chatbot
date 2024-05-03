import { Router } from 'express';
import { PromptServices } from '../services/prompt.service.js';
import { verificationToken } from '../middlewares/verificationToken.js';

export const infoRouter = Router();

const service = new PromptServices()

infoRouter.use(verificationToken);

infoRouter.post('/info', async (req, res) => {
  try {
    console.log({req: req.body});
    const created = await service.postResponse(res, req.body)
    return created
  } catch (error) {
    console.log(error);
  }
})



