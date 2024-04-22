import { Router } from 'express';

// import { validatorSchemaHandler } from '../middlewares/validatorSchemaHandler.js';
// import { promptSchema } from '../dto/promtDTO.js';
import { PromptServices } from '../services/prompt.service.js';

export const router = Router();

const service = new PromptServices()


router.get('/info',
  async (req, res) => {
    try {
      const found = await service.getAll(res);
      return found

    } catch (error) {
      console.log(error);
    }
  });

router.post('/info', (req, res) => {
  try {
    const created = service.createInfo(res, req.body)
    return created
  } catch (error) {
    console.log(error);
  }
})

