import cron from 'node-cron';
import { expireStaleReservations } from './reservationService.js';

export const startCronJobs = () => {
  cron.schedule('*/5 * * * *', async () => {
    try {
      const result = await expireStaleReservations();
      if (result.expired > 0) {
        console.log(`Expired ${result.expired} reservations`);
      }
    } catch (error) {
      console.error('Cron job failed:', error.message);
    }
  });
};
