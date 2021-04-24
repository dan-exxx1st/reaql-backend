export default {
  jwtSecret: process.env.JWT_SECRET || 'SUPER_SECRET_TOKEN',
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: process.env.DB_PORT || 5432,
  POSTGRES_USER: process.env.POSTGRES_USER || 'postgres',
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORDS || '123',
  POSTGRES_DB: process.env.POSTGRES_DB || 'reaql-dev',
  IS_SSL: process.env.IS_SSL,
  REDIS_URL: process.env.REDIS_URL || `redis://localhost:6379`,
};
