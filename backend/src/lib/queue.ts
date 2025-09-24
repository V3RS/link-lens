import { Queue } from 'bullmq';
import { REDIS_URL } from '../env.js';

export const queue = new Queue('og-scan', {
  connection: {
    host: 'localhost',
    port: 6379,
  },
});
