import 'dotenv/config';

export const DATABASE_URL = process.env.DATABASE_URL!;
export const REDIS_URL = process.env.REDIS_URL!;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is required');
}

if (!REDIS_URL) {
  throw new Error('REDIS_URL is required');
}
