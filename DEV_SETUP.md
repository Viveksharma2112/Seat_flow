# SeatFlow Dev Setup

Updated: 2026-07-04

## Local Start

- Backend: `cd backend` then `npm start` or `npm run dev`
- Frontend: `cd frontend` then `npm run dev`
- Seed data: `cd backend` then `npm run seed`

## Required Environment

- `MONGODB_URI` for the backend database connection
- `JWT_SECRET` for token signing and validation
- `CLIENT_URL` or equivalent frontend origin for CORS
- `VITE_API_URL` for the frontend API base URL

## Seeded Credentials

- Admin: `admin@seatflow.com`
- Password: `Admin@123`

## Notes

- JWTs are stored in `localStorage` under `seatflow_token`.
- The frontend validates the stored token against `GET /api/auth/me` on startup.
- Session expiry is surfaced as a toast and the token is cleared automatically.