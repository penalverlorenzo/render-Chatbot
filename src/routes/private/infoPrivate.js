import { Router } from 'express';
import { PromptServices } from '../../services/prompt.service.js';
import { isAdmin, verificationToken } from '../../middlewares/verificationToken.js';

export const infoPrivateRouter = Router();

const service = new PromptServices()

infoPrivateRouter.use([verificationToken, isAdmin]);

infoPrivateRouter.post('/info', async (req, res) => {
  try {
    const created = await service.postResponse(res, req, "private")
    return created
  } catch (error) {
    console.log(error);
  }
})


infoPrivateRouter.get('/info', async (req, res) => {
  try {
    const created = await service.getAllPrivate()
    console.log({created});
    const dataPrev = created.map(item => {
      const {_id, ...Data } = item; 
      return Data._doc.Data;
    })
    res.send(dataPrev);
  } catch (error) {
    console.log(error);
  }
})

