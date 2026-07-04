import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import seatRoutes from './routes/seatRoutes.js';
import floorRoutes from './routes/floorRoutes.js';
import sectionRoutes from './routes/sectionRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';
import userRoutes from './routes/userRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

const app = express();

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);
app.use(express.json({ limit: '10kb' }));

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'SeatFlow API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/seats', seatRoutes);
app.use('/api/floors', floorRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
