import { Router } from 'express';

// import { validatorSchemaHandler } from '../middlewares/validatorSchemaHandler.js';
// import { promptSchema } from '../dto/promtDTO.js';
import { PromptServices } from '../services/prompt.service.js';

export const router = Router();

const service = new PromptServices()


router.post('/info', async (req, res) => {
  try {
    console.log({req: req.body});
    const created = await service.postResponse(res, req.body)
    return created
  } catch (error) {
    console.log(error);
  }
})


router.post('/login', async ( req, res) => {
  const token = await service.generarToken(req, res)
  return token;
})

router.post('/refresh-token', async (res) => {
  const Hola = await service.Hola()
  return Hola;
})

