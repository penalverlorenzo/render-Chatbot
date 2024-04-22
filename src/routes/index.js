import { Router } from 'express';

// Routes
export const routerApi = (app) => {
  const router = Router();
  app.use('/api/v1', router);
  router.use('/info')
};
