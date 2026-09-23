import { Router } from 'express';
import { swaggerSpec } from '@/configs/index.js';
import { healthRouter } from './health/index.js';
import { exampleRouter } from './example/index.js';
import { consumerRouter } from './consumer/index.js';
import swaggerUi from 'swagger-ui-express';


export const createRouter = (): Router => {
  const router = Router();

  // modules
  router.use('/', exampleRouter());
  router.use('/consumer', consumerRouter());

  // administrative
  router.use('/health', healthRouter());
  router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  return router;
}
