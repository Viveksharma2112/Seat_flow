# SeatFlow Interview Prep Guide

Last updated: 2026-07-08

This file is a single interview-ready reference for the SeatFlow project. It explains what the app does, why each technology is used, how the frontend and backend are connected, how the APIs work, what the database schema looks like, and the most likely interview questions with short answers.

## 1) Project In One Line

SeatFlow is a full-stack seat reservation and crowd management platform for places like libraries, study rooms, coworking spaces, labs, and hostels, where students can browse availability, reserve seats, check in or out, and admins can manage the full seating system.

## 2) Problem It Solves

Before SeatFlow, seat allocation in shared spaces is usually manual, unclear, and hard to track.

The project solves these problems:

- No real-time seat visibility
- Double booking and scheduling conflicts
- No proper booking history or audit trail
- No admin dashboard for managing floors, sections, seats, and users
- No waiting queue when a seat is already occupied
- No clean authentication and role-based access control

## 3) What The Product Actually Does

SeatFlow supports two main user types:

- Student
- Admin

Student flow:

- Register or log in
- View available seats
- Book a seat for a time window
- Check in at the right time
- Check out after use
- See current booking, queue status, and reservation history

Admin flow:

- Create and manage floors
- Create and manage sections under floors
- Create, update, and delete seats
- Manage users
- View reservation and system analytics
- Monitor utilization patterns

## 4) Technology Stack And Why It Is Used

### Frontend

React

- React is the UI library used to build the SeatFlow frontend as a component-based single-page app.
- It lets the project reuse cards, tables, modals, dashboards, and route layouts without repeating code.
- In SeatFlow, React is what updates seat availability, booking state, and dashboard pages when the user interacts with the app.

Vite

- Fast development server and build tool.
- Smaller startup time compared with older bundlers.

React Router

- React Router handles page navigation inside the app without full page reloads.
- It is used for public pages, student pages, admin pages, and role-based protected routes.
- In SeatFlow, it helps switch between dashboard, seat browser, booking history, and admin panels smoothly.

Axios

- Axios is the HTTP client used to talk to the backend API from the React app.
- In SeatFlow, it automatically attaches the JWT from localStorage to every protected request through an interceptor.
- It is also used to standardize error handling, so login failures, validation errors, and auth errors show a clean message in the UI.
- Real use case: when the student opens the seat page or books a seat, Axios sends the request to `/api/seats` or `/api/reservations` and brings back the latest data.

Tailwind CSS

- Utility-first styling.
- Faster UI iteration and consistent design system.

react-hot-toast

- Lightweight feedback messages for success and error states.

lucide-react

- Clean icon set for dashboard and navigation UI.

recharts

- Used for analytics visualizations.

### Backend

Node.js

- Node.js runs the SeatFlow backend server and executes JavaScript on the server side.
- It keeps the stack consistent because the frontend also uses JavaScript.
- In this project, Node.js powers the API server, cron jobs, reservation logic, and MongoDB connection startup.

Express

- Express is the web framework used to expose SeatFlow REST APIs.
- It organizes routes, middleware, validation, and controllers in a clean way.
- Real use case: `/api/auth/login`, `/api/reservations`, and `/api/analytics/admin` are all handled through Express routes.

MongoDB

- MongoDB is the document database where SeatFlow stores users, floors, sections, seats, reservations, and waiting queue entries.
- It fits this project because the data is naturally document-shaped and relationships can be handled with references.
- Real use case: when a seat is booked or a reservation expires, MongoDB updates the seat status and reservation document together.

Mongoose

- Mongoose is the ODM layer that sits on top of MongoDB and gives structure to SeatFlow data.
- It defines schemas, validation rules, relationships, indexes, and hooks like password hashing.
- Real use case: the User schema hashes passwords before save, and the Reservation schema uses indexes to speed up booking queries.

JWT

- JWT is the token-based auth mechanism used in SeatFlow.
- After login or registration, the backend returns a token and the frontend stores it in localStorage.
- Real use case: every protected request like `/api/seats` or `/api/reservations/mine` uses the token in the Authorization header.
- This removes the need for server-side sessions and keeps auth stateless.

bcryptjs

- Hashes passwords securely before saving.

express-validator

- Validates request payloads and route parameters.

cors

- Allows frontend and backend to communicate safely across origins.

dotenv

- Manages environment variables.

node-cron

- node-cron schedules background tasks on a fixed interval.
- In SeatFlow, it is used to scan active reservations and expire the ones whose end time has passed.
- Real use case: every 5 minutes the cron job can free a seat, mark the reservation expired, and move the queue forward if needed.

### Why These Technologies Fit This Project

- Seat booking needs fast UI updates, so React is a natural choice.
- Seat availability, booking, and admin operations need API driven architecture, so Express fits well.
- Reservation and user documents have changing shapes and nested references, so MongoDB plus Mongoose works well.
- Authentication must be simple, scalable, and stateless, so JWT is better than server sessions for this use case.
- Reservation expiry is time-based, so node-cron is useful for automation.

## 5) High-Level Architecture

SeatFlow uses a standard 3-layer full-stack architecture:

1. Frontend presentation layer
2. Backend API and business logic layer
3. Database persistence layer

### Data Flow

User action in browser

-> React page or component

-> Axios API call

-> Express route

-> Middleware for auth and validation

-> Controller

-> Service layer

-> Mongoose model

-> MongoDB

-> Response returned back to frontend

### Why The Project Is Split Into Controller, Service, Model

- Route files keep endpoint definitions clean.
- Controllers handle HTTP request and response mapping.
- Services contain business rules and transaction logic.
- Models define database schema and indexes.
- Middleware handles cross-cutting concerns like auth and validation.

This separation makes the code easier to maintain, test, and extend.

## 6) Actual Backend Folder Structure

### `backend/config`

- `env.js` loads required environment variables and provides default values.
- `db.js` connects the app to MongoDB.

### `backend/controllers`

Controllers convert HTTP requests into service calls and shape the final response.

- `authController.js`
- `seatController.js`
- `floorController.js`
- `sectionController.js`
- `reservationController.js`
- `userController.js`
- `analyticsController.js`

### `backend/services`

Services contain the real business logic.

- `authService.js`
- `seatService.js`
- `floorService.js`
- `sectionService.js`
- `reservationService.js`
- `queueService.js`
- `userService.js`
- `analyticsService.js`
- `cronService.js`

### `backend/models`

- `User.js`
- `Floor.js`
- `Section.js`
- `Seat.js`
- `Reservation.js`
- `WaitQueue.js`

### `backend/routes`

- `authRoutes.js`
- `seatRoutes.js`
- `floorRoutes.js`
- `sectionRoutes.js`
- `reservationRoutes.js`
- `userRoutes.js`
- `analyticsRoutes.js`

### `backend/middleware`

- `auth.js` for authentication and authorization
- `validate.js` for input validation result handling
- `errorHandler.js` for centralized error formatting

### `backend/utils`

- `validators.js` for express-validator rules
- `jwt.js` for token-related helpers
- `queryBuilder.js` for pagination and sorting helpers
- `seed.js` for demo data generation
- `ApiError.js` and `asyncHandler.js` for error handling patterns

## 7) Actual Frontend Folder Structure

### `frontend/src/pages`

Important pages:

- `HomePage.jsx` for landing page
- `LoginPage.jsx` and `RegisterPage.jsx` for auth
- `StudentDashboard.jsx` for student overview
- `SeatAvailabilityPage.jsx` for browsing seats
- `BookingHistoryPage.jsx` for reservation history
- `AdminDashboard.jsx` for admin overview
- `ManageSeatsPage.jsx`
- `ManageFloorsPage.jsx`
- `ManageUsersPage.jsx`
- `AdminReservationsPage.jsx`
- `AnalyticsPage.jsx`
- `ProfilePage.jsx`
- `SettingsPage.jsx`
- `Error403.jsx` and `Error404.jsx`

### `frontend/src/components`

Reusable UI building blocks such as:

- Alert
- ConfirmModal
- DataTable
- LoadingSpinner
- ProtectedRoute
- SeatGrid
- SkeletonLoader
- StatCard
- StatusBadge

### `frontend/src/context`

- `AuthContext.jsx` stores logged-in user state, token handling, login, register, logout, and session expiry logic.

### `frontend/src/services`

- `api.js` is the Axios client.
- `index.js` exports API wrappers for auth, seats, floors, sections, reservations, users, and analytics.

### `frontend/src/layouts`

- `PublicLayout.jsx` for public pages
- `DashboardLayout.jsx` for student and admin dashboard views

## 8) How Frontend And Backend Are Connected

The frontend does not talk to MongoDB directly. It only talks to the backend API.

### Connection Chain

React page

-> service function in `frontend/src/services/index.js`

-> Axios client in `frontend/src/services/api.js`

-> backend route in Express

-> controller

-> service

-> model

-> MongoDB

### How Token Is Attached

`frontend/src/services/api.js` uses an Axios request interceptor.

What it does:

- Reads `seatflow_token` from localStorage
- Adds `Authorization: Bearer <token>` header
- Sends authenticated requests automatically

This means once the user logs in, every future request can carry the token without manual setup in every component.

### How Session Is Restored

`AuthContext.jsx` checks localStorage on app start.

If token exists:

- It calls `authService.getMe()`
- Loads current user data
- Restores the session

If token is invalid or expired:

- Token is removed
- User is logged out locally
- Session expiry state is set

## 9) Route And API Map

### Auth APIs

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

Used for signup, login, and session restoration.

### Seat APIs

- `GET /api/seats`
- `GET /api/seats/:id`
- `POST /api/seats`
- `PATCH /api/seats/:id`
- `DELETE /api/seats/:id`

Only Admin can create, update, or delete seats.

### Floor APIs

- `GET /api/floors`
- `GET /api/floors/:id`
- `POST /api/floors`
- `PATCH /api/floors/:id`
- `DELETE /api/floors/:id`

Only Admin can manage floors.

### Section APIs

- `GET /api/sections`
- `GET /api/sections/:id`
- `POST /api/sections`
- `PATCH /api/sections/:id`
- `DELETE /api/sections/:id`

Only Admin can manage sections.

### Reservation APIs

- `GET /api/reservations/current`
- `GET /api/reservations/mine`
- `GET /api/reservations/queue`
- `GET /api/reservations`
- `POST /api/reservations`
- `POST /api/reservations/:id/check-in`
- `POST /api/reservations/:id/check-out`
- `PATCH /api/reservations/:id/cancel`
- `DELETE /api/reservations/queue/:id`

These power the booking lifecycle.

### User APIs

- `GET /api/users`
- `PATCH /api/users/:id`
- `DELETE /api/users/:id`

Admin only.

### Analytics APIs

- `GET /api/analytics/admin`
- `GET /api/analytics/student`

Used for dashboards and metrics.

### Health Check

- `GET /api/health`

Used to verify the server is alive.

## 10) Request Lifecycle In This Project

Example: student creates a reservation.

1. Frontend calls `reservationService.create(data)`.
2. Axios attaches the bearer token.
3. Express route `POST /api/reservations` receives the request.
4. `authenticate` middleware verifies JWT.
5. `authorize('Student')` ensures only student role can book.
6. `reservationRules` validate `seatId`, `startTime`, and `endTime`.
7. Controller forwards the request to `reservationService.createReservation`.
8. Service checks time range, seat availability, and active booking rules.
9. If seat is free, a transaction creates the reservation and marks the seat reserved.
10. If seat is busy, the user is added to the waiting queue.
11. Response goes back to UI with either reservation data or queue data.

This is a good interview answer because it shows you understand the full request flow.

## 11) Authentication And Authorization Flow

### Authentication

Authentication means verifying who the user is.

In SeatFlow:

- User logs in with email and password.
- Backend verifies the password.
- Backend returns a JWT.
- Frontend stores the token in localStorage.
- Every protected request sends the token back in the Authorization header.

### Authorization

Authorization means checking what the user is allowed to do.

In SeatFlow:

- Student can browse seats and create bookings.
- Admin can manage seats, floors, sections, users, and analytics.
- Middleware `authorize('Admin')` or `authorize('Student')` enforces this.

### Why JWT Is Used

- Stateless
- Easy to scale
- Works well for SPA frontend apps
- No need to keep server sessions in memory

## 12) Database Schema And Why It Is Designed This Way

### User Schema

Fields:

- `name`
- `email`
- `password`
- `role`
- `status`

Why:

- `role` enables access control
- `status` helps disable accounts without deleting them
- password is hashed before save

### Floor Schema

Fields:

- `name`
- `description`
- `isActive`

Why:

- A floor is a top-level grouping for seat allocation.
- `isActive` allows soft disable behavior.

### Section Schema

Fields:

- `name`
- `floor`
- `description`
- `isActive`

Why:

- Each section belongs to one floor.
- Unique index on `floor + name` prevents duplicate section names inside the same floor.

### Seat Schema

Fields:

- `seatNumber`
- `floor`
- `section`
- `status`

Why:

- Each seat belongs to one floor and one section.
- Unique index on `floor + section + seatNumber` prevents duplicates.
- `status` is used for availability tracking.

### Reservation Schema

Fields:

- `userId`
- `seatId`
- `startTime`
- `endTime`
- `status`
- `checkedInAt`
- `checkedOutAt`

Why:

- Links a user to a seat for a time range.
- Supports full reservation lifecycle.
- Indexed by `userId`, `seatId`, and `endTime` for faster queries.

### WaitQueue Schema

Fields:

- `userId`
- `seatId`
- `startTime`
- `endTime`
- `position`
- `status`

Why:

- Handles overflow when a seat is not immediately available.
- Queue position helps maintain order.

## 13) Why Mongoose Schema Is Important

Mongoose is not just about storing data. In this project it solves multiple problems:

- Enforces field validation
- Adds defaults
- Adds indexes for performance
- Supports references between collections
- Supports hooks like password hashing
- Makes complex queries easier to manage

### Interview Definition

A schema is a structured definition of how a document should look in the database. It defines fields, types, constraints, defaults, validations, and relationships.

## 14) Reservation Workflow In Detail

This is the most important business flow in SeatFlow.

### Booking Steps

1. User submits seat, start time, and end time.
2. Backend validates the time window.
3. Backend checks if the user already has an active reservation.
4. Backend checks if the seat exists.
5. If seat is available, it is reserved inside a MongoDB transaction.
6. If seat is not available, the user is placed in the waiting queue.
7. On cancellation, check-out, or expiry, seat is marked available again.
8. The next user in queue can be processed automatically.

### Why Transactions Are Used

Transactions protect data consistency when multiple updates must happen together.

In SeatFlow they prevent issues like:

- reservation created but seat status not updated
- seat released but reservation not updated
- queue moved incorrectly after cancellation or expiry

### Why This Is Important In Interviews

This shows that you understand consistency, concurrency, and race conditions.

## 15) Queue System

SeatFlow has a wait queue because users may try to book a seat that is already occupied.

Queue flow:

- User requests a seat.
- If the seat is unavailable, the request does not fail immediately.
- Instead, a queue entry is created.
- When a seat becomes free, `queueService` can process the next user.

Why this is useful:

- Better user experience
- No dead-end failure when seat is busy
- Fair ordering of requests

## 16) Cron Job And Auto Expiry

`backend/services/cronService.js` schedules a job every 5 minutes.

Purpose:

- Find reservations that are past end time
- Mark them as expired or completed
- Free seats
- Process waiting queue if needed

Why use cron:

- Keeps seat availability accurate
- Reduces manual cleanup
- Automates system maintenance

## 17) Validation And Error Handling

### Validation Layer

Request validation is handled using `express-validator` rules in `backend/utils/validators.js`.

Examples:

- email must be valid
- password must meet minimum length
- seatId must be a MongoDB ID
- time fields must be ISO 8601 format

### Error Handling Layer

All errors go through a centralized error handler.

It handles:

- duplicate key errors
- invalid ObjectId cast errors
- validation errors
- auth errors
- not found errors

Benefits:

- Consistent API error responses
- Easier debugging
- Better frontend error mapping

## 18) Frontend State And UI Flow

### Auth Context

`AuthContext.jsx` is the source of truth for:

- current user
- loading state
- session expired state
- login
- register
- logout

### Protected Routes

The app protects pages by role:

- Student pages are hidden from unauthenticated users
- Admin pages are hidden from students
- Public pages are hidden after login where needed

### Layouts

`PublicLayout.jsx`

- Used for landing, login, and register pages.

`DashboardLayout.jsx`

- Used for authenticated pages.
- Shows sidebar, breadcrumbs, quick access, user menu, and role-based navigation.

### UI Feedback

- Toasts for success and error messages
- Spinners and skeleton loaders for async loading states
- Status badges for reservation state display

## 19) API Response Pattern

Most APIs return a consistent JSON shape.

Common pattern:

```json
{
  "success": true,
  "data": {}
}
```

Or for paginated data:

```json
{
  "success": true,
  "data": [],
  "page": 1,
  "limit": 10,
  "total": 100,
  "totalPages": 10
}
```

Error response pattern:

```json
{
  "success": false,
  "message": "Something went wrong"
}
```

This is useful because frontend can handle data and errors in a predictable way.

## 20) How APIs Are Generated In This Project

If interviewer asks, "How are APIs generated?" the answer is:

SeatFlow APIs are not auto-generated by a low-code tool. They are manually designed using Express route definitions, controller functions, service methods, validation rules, and Mongoose models.

The process is:

1. Decide the business action.
2. Define the route path and HTTP method.
3. Add authentication and authorization middleware.
4. Add request validation rules.
5. Write controller handler.
6. Move business logic into service.
7. Read or write data through Mongoose model.
8. Return normalized JSON response.

So the API is effectively generated from the project requirements and implemented in a clean layered structure.

## 21) Why This Architecture Is Good

- Easy to understand
- Easy to scale
- Easy to debug
- Easy to test in layers
- Role-based logic is clean
- Reservation concurrency is controlled
- UI and API are separated properly

## 22) Important Design Decisions

### Why No SQL Database Here

MongoDB fits the project because:

- data shape is flexible
- nested references are manageable
- fast iteration during development is easier
- seat, queue, and reservation documents can evolve over time

### Why Not Store Sessions In Server Memory

JWT is used instead of server sessions because:

- stateless auth scales better
- easier frontend-backend separation
- simpler deployment across environments

### Why Use Service Layer

Business logic like booking, cancelling, queue processing, and expiry should not live inside route files.

That keeps the code maintainable and reusable.

## 23) Seed Data Purpose

`backend/utils/seed.js` generates demo data:

- 1 admin user
- many student users
- floors
- sections
- seats
- reservations
- queue-related example data

Why seed data matters:

- useful for local development
- helps demo the dashboard quickly
- provides realistic data for analytics

## 24) Best Interview Answers In Short Form

### What is SeatFlow?

SeatFlow is a seat reservation and crowd management platform with student and admin workflows.

### What is your backend architecture?

It uses Express with route, controller, service, model separation and MongoDB with Mongoose.

### Why did you use MongoDB?

Because the data is document-oriented, flexible, and easier to evolve for seat, booking, and queue structures.

### Why did you use JWT?

Because it gives stateless authentication and works well for SPA apps.

### How do you prevent double booking?

Through seat status checks, overlapping reservation checks, MongoDB transactions, and queue fallback.

### What happens when a seat is unavailable?

The user is added to the waiting queue instead of being rejected outright.

### How do you handle expired reservations?

Cron jobs mark stale reservations expired and free up the seat.

### How do you control access?

With role-based authorization middleware.

### How do you validate requests?

With express-validator rules before the controller runs.

## 25) Top Interview Questions And Ready Answers

### 1. Why did you choose a layered architecture?

Because it separates HTTP handling, business logic, and data access, which makes the app easier to maintain and debug.

### 2. What is the role of the service layer?

It holds business logic such as reservation creation, cancellation, queue handling, and expiry processing.

### 3. Why do you need Mongoose if you already have MongoDB?

Mongoose adds schema validation, relationships, middleware hooks, indexes, defaults, and cleaner code structure.

### 4. How does authentication work?

User logs in, backend issues JWT, frontend stores it, and every protected API request includes the token in the Authorization header.

### 5. What is the difference between authentication and authorization?

Authentication checks who the user is. Authorization checks what the user can do.

### 6. How do you avoid booking conflicts?

By checking seat status, checking overlapping reservations, and using database transactions.

### 7. Why is a waiting queue useful?

It allows fair handling of seat demand when no seat is immediately available.

### 8. What is the purpose of cron jobs here?

They automatically expire stale reservations and keep seat availability correct.

### 9. How does frontend know the user is logged in?

The auth context checks localStorage and verifies the token with the backend using `getMe()`.

### 10. What are the major collections in MongoDB?

User, Floor, Section, Seat, Reservation, and WaitQueue.

### 11. Why are indexes used?

To speed up searches and enforce uniqueness, especially for seat and section combinations.

### 12. How do you handle errors consistently?

With a centralized error handler that converts errors into predictable JSON responses.

### 13. What is the main benefit of separating routes and controllers?

Routes stay simple while controllers focus on request-response logic and services handle core business rules.

### 14. How does the reservation lifecycle work?

Create reservation -> check in -> check out or cancel -> expire if time passes.

### 15. Why is React suitable for this project?

Because the UI is interactive, dashboard-heavy, and stateful.

## 26) If You Need A 30-Second Explanation In Interview

SeatFlow is a MERN-style reservation system where students can reserve seats, check in and out, and view history while admins manage the seat map, users, and analytics. The architecture uses React on the frontend, Express and Node.js on the backend, MongoDB and Mongoose for data storage, JWT for auth, and a service-based backend design for clean reservation and queue logic.

## 27) Final Revision Checklist

Before the interview, make sure you can explain:

- What problem the app solves
- Why React, Express, MongoDB, and JWT were chosen
- How auth works end to end
- How reservation flow works
- How queue and cron expiry work
- What each schema contains
- Why transactions are needed
- Why role-based access control is important
- How frontend and backend are connected

If you can explain these clearly, you can answer most project questions confidently.