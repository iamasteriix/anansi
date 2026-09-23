import { Router } from 'express';
import { readyController } from './ready.controller.js';


export const healthRouter = (): Router => {
  const router = Router();

  router.route('/ready').get(readyController);

  return router;
} 
