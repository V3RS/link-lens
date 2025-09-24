import express from 'express';
import cors from 'cors';
import submissionsRoutes from './routes/submissions.js';
import { PORT } from './env.js';

export function createApp() {
  const app = express();
  
  app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }));
  
  app.use(express.json());
  app.use('/api/submissions', submissionsRoutes);
  
  return app;
}

if (import.meta.url === new URL(process.argv[1], 'file://').href) {
  const app = createApp();
  
  app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
  });
}
