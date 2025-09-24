import express from 'express';
import submissionsRoutes from './routes/submissions.js';

export function createApp() {
  const app = express();
  
  app.use(express.json());
  app.use('/api/submissions', submissionsRoutes);
  
  return app;
}

if (import.meta.url === new URL(process.argv[1], 'file://').href) {
  const app = createApp();
  const PORT = process.env.PORT || 3000;
  
  app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
  });
}
