const requiredEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}


export const env = {
  // app
  PORT: parseInt(requiredEnvVar('PORT')),
  ENDPOINT: requiredEnvVar('ENDPOINT'),
  NODE_ENV: requiredEnvVar('NODE_ENV'),

    // postgres
  PG_HOST: requiredEnvVar('PG_HOST'),
  PG_PORT: parseInt(requiredEnvVar('PG_PORT')),
  PG_DATABASE: requiredEnvVar('PG_DATABASE'),
  PG_USER: requiredEnvVar('PG_USER'),
  PG_PASSWORD: requiredEnvVar('PG_PASSWORD'),

  // logging
  LOG_LEVEL: requiredEnvVar('LOG_LEVEL'),
} as const;
