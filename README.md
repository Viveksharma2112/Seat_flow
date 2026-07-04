# SeatFlow

SeatFlow is a full-stack seat reservation and crowd management platform for libraries, study rooms, labs, and hostels. Students browse availability, reserve seats, and manage bookings. Administrators monitor usage, manage infrastructure, and view analytics.

## Architecture

```
┌─────────────┐     REST/JSON      ┌─────────────┐     Mongoose     ┌──────────────┐
│   React     │ ◄───────────────► │   Express   │ ◄──────────────► │ MongoDB Atlas│
│  (Vercel)   │      JWT Auth      │   (Render)  │                  │              │
└─────────────┘                    └─────────────┘                  └──────────────┘
```

- **Frontend:** React, React Router, Axios, Context API, Tailwind CSS
- **Backend:** Node.js, Express.js, JWT, bcrypt, node-cron
- **Database:** MongoDB Atlas with Mongoose

Business logic lives in backend services. Controllers stay thin. Atomic reservation updates prevent double booking. A waiting queue assigns seats when they become available. Cron runs every 5 minutes to expire stale reservations.

## Folder structure

```
seatflow/
├── backend/
│   ├── config/          # DB and env configuration
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Auth, validation, errors
│   ├── models/          # Mongoose schemas
│   ├── routes/          # REST route definitions
│   ├── services/        # Business logic
│   ├── utils/           # Helpers, validators, seed
│   ├── app.js
│   └── server.js
├── frontend/
│   └── src/
│       ├── components/  # Reusable UI
│       ├── context/     # Auth state
│       ├── hooks/       # Custom hooks
│       ├── layouts/     # Page shells
│       ├── pages/       # Route views
│       └── services/    # API client
└── README.md
```

## Environment variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | API port (default `5000`) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret for signing tokens (32+ chars) |
| `JWT_EXPIRES_IN` | Token lifetime (e.g. `7d`) |
| `CLIENT_URL` | Frontend origin for CORS |
| `NODE_ENV` | `development` or `production` |

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL (e.g. `http://localhost:5000/api`) |

Copy example files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

## Installation

### Prerequisites

- Node.js 18+
- MongoDB Atlas cluster

### Backend

```bash
cd backend
npm install
npm run seed    # optional: demo data
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

### Seed credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@seatflow.com | admin123 |
| Student | student@seatflow.com | student123 |

## API overview

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/seats` | Auth |
| POST | `/api/reservations` | Student |
| GET | `/api/analytics/admin` | Admin |
| GET | `/api/analytics/student` | Student |

List endpoints support `page`, `limit`, `search`, `sortBy`, and `order` query params.

## Deployment

### MongoDB Atlas

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Create a database user with read/write access.
3. Allow network access (for Render, use `0.0.0.0/0` or Render outbound IPs).
4. Copy the connection string and replace `<password>` with your user password.
5. Set the database name to `seatflow` in the URI.

### Render (backend)

1. Push the repo to GitHub.
2. In Render, create a **Web Service** linked to the repo.
3. Settings:
   - **Root directory:** `backend`
   - **Build command:** `npm install`
   - **Start command:** `npm start`
   - **Environment:** Node
4. Add environment variables from `backend/.env.example`.
5. Set `CLIENT_URL` to your Vercel frontend URL.
6. Deploy and note the service URL (e.g. `https://seatflow-api.onrender.com`).

### Vercel (frontend)

1. Import the GitHub repo in Vercel.
2. Settings:
   - **Root directory:** `frontend`
   - **Framework preset:** Vite
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
3. Add environment variable:
   - `VITE_API_URL` = `https://your-render-service.onrender.com/api`
4. Deploy.
5. Update Render `CLIENT_URL` to match the Vercel URL if needed.

## Development notes

- Reservations use MongoDB transactions (requires Atlas replica set).
- Expired reservations are released every 5 minutes via node-cron.
- When a seat opens, the next user in the wait queue is auto-assigned.
- Public registration always creates Student accounts; use seed or manual DB update for admins.

## License

MIT
