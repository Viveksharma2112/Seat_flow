import app from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import { startCronJobs } from './services/cronService.js';

const start = async () => {
  await connectDB();
  startCronJobs();

  app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });
};

start();
