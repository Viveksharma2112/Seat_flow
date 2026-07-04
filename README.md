# Seat_flow
# SeatFlow

SeatFlow is a full-stack seat reservation platform designed for libraries, study rooms, coworking spaces, and educational institutions. It enables students to discover, reserve, check-in, and manage seats efficiently while providing administrators with occupancy insights and management capabilities.

## Features

### Student Features
- JWT Authentication
- Secure Login & Registration
- Browse Available Seats
- Real-Time Seat Availability
- Seat Reservation System
- Check-In / Check-Out Workflow
- Booking History
- Reservation Status Tracking
- Search & Filter Seats
- Profile Management

### Admin Features(Adding Soon)
- Manage Seats
- Manage Floors & Sections
- Monitor Reservations
- User Management
- Occupancy Analytics
- Reservation Statistics
- Dashboard Insights

## Seat Lifecycle

```text
Available
   ↓
Reserved
   ↓
Checked-In
   ↓
Occupied
   ↓
Checked-Out
   ↓
Available
```

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios
- React Router
- Lucide React

### Backend
- Node.js
- Express.js
- JWT Authentication
- REST APIs

### Database
- MongoDB Atlas
- Mongoose

### Deployment
- Vercel (Frontend)
- Render (Backend)
- MongoDB Atlas (Database)

## Project Structure

```text
SeatFlow
│
├── frontend
│   ├── src
│   ├── pages
│   ├── components
│   ├── layouts
│   └── services
│
├── backend
│   ├── controllers
│   ├── routes
│   ├── models
│   ├── middleware
│   ├── services
│   └── utils
│
└── README.md
```

## Installation

### Clone Repository

```bash
git clone https://github.com/Viveksharma2112/Seat_flow.git
cd Seat_flow
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Create a `.env` file inside backend:

```env
PORT=5000
MONGO_URI=YOUR_MONGODB_URI
JWT_SECRET=YOUR_SECRET_KEY
CLIENT_URL=http://localhost:5173
```

## Seed Database

Populate demo data:

```bash
npm run seed
```

Generated Demo Data:

- 1 Admin Account
- 500 Students
- 200 Seats
- Multiple Floors
- Multiple Sections
- Reservation History
- Analytics Data

### Admin Credentials

```text
Email: admin@seatflow.com
Password: Admin@123
```

## API Highlights

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
```

### Seats

```http
GET /api/seats
POST /api/seats
PUT /api/seats/:id
DELETE /api/seats/:id
```

### Reservations

```http
POST /api/reservations
GET /api/reservations/me
PUT /api/reservations/:id
```

## Future Enhancements

- Admin Analytics Dashboard
- Occupancy Heatmaps
- Email Notifications
- QR Based Check-In
- Multi-Campus Support
- Real-Time Seat Updates using Socket.IO

## Screenshots

_Add project screenshots here after deployment._

## Author

**Vivek Sharma**

GitHub:
https://github.com/Viveksharma2112

Project Repository:
https://github.com/Viveksharma2112/Seat_flow

---

Built using the MERN Stack.
