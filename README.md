## SeatFlow

SeatFlow is a full-stack seat reservation and crowd management platform for libraries, study rooms, coworking spaces, labs, and hostels. Students can browse availability, reserve seats, check in/out, and view booking history. Admins can manage seats, floors, sections, users, and view analytics.

### Key Features
- JWT authentication (login/registration)
- Browse and filter seats
- Real-time seat availability
- Reservation lifecycle (reserve, check-in, check-out)
- Booking history and reservation status
- Admin: manage seats, floors, sections, users, and analytics

## Tech Stack
- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express, JWT, bcrypt, node-cron
- Database: MongoDB Atlas + Mongoose

## Project Structure

```
seatflow/
├── backend/        # API, controllers, services, models
├── frontend/       # React app (Vite + Tailwind)
└── README.md
```

## Installation

Prerequisites: Node.js 18+, MongoDB Atlas (or local MongoDB)

1. Clone repository

```bash
git clone https://github.com/Viveksharma2112/Seat_flow.git
cd seatflow
```

2. Backend

```bash
cd backend
npm install
cp .env.example .env
# edit backend/.env with your Mongo URI and JWT secret
npm run dev
```

3. Frontend

```bash
cd frontend
npm install
cp .env.example .env
# edit frontend/.env if needed (VITE_API_URL)
npm run dev
```

## Environment Variables

Create `backend/.env` with at least:

```
PORT=5000
MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

Create `frontend/.env` with `VITE_API_URL` pointing to backend API.

## Seed Data (optional)

From the `backend` folder:

```bash
npm run seed
```

This generates demo users and seats for development/testing.

## API Endpoints (high-level)

- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me
- GET /api/seats
- POST /api/seats
- PUT /api/seats/:id
- POST /api/reservations
- GET /api/reservations/me

## Resolving the merge
This commit resolves an unmerged state for `README.md` by combining and cleaning both incoming versions into a single unified README. If you'd prefer to keep a different README variant, tell me and I can update it.

## License
MIT
