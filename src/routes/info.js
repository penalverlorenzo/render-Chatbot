import { Router } from 'express';
import { PromptServices } from '../services/prompt.service.js';
import { verificationToken } from '../middlewares/verificationToken.js';

export const infoRouter = Router();

const service = new PromptServices()

infoRouter.use(verificationToken);

infoRouter.post('/info', async (req, res) => {
  try {
    const created = await service.postResponse(res, req)
    return created
  } catch (error) {
    console.log(error);
  }
})

infoRouter.get('/info', async (req, res) => {
  try {
    const created = await service.getAll()
    const dataPrev = created.map(item => {
      const {_id, ...Data } = item; 
      return Data._doc.Data;
    })
    console.log({created});
    res.send(dataPrev);
  } catch (error) {
    console.log(error);
  }
})

