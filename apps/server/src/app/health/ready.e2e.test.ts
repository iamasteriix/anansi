import { test, expect } from '@playwright/test';
import { env } from '@/configs/index.js';


test.describe(
  'GET /health/ready',
  () => {
    test(
      'responds with 200 ok and valid body',
      async ({ request }) => {
        const res = await request.get(`${env.ENDPOINT}:${env.PORT}/health/ready`);
        expect(res.status()).toBe(200);
        expect(await res.json()).toMatchObject({
          status: 'ok',
          time: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
        });
    });
});
