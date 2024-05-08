import { Router } from 'express';
import { RedisServices } from '../services/redis.service.js';

export const redisRouter = Router();

const service = new RedisServices()

redisRouter.get('/items/:id', async ( req, res) => {
  const id = req.params.id
  const item = await service.getItem(id, res)
  return item;
})

redisRouter.post('/items', async (req,res) => {
  const item = await service.createItem(req,res)
  return item;
})
