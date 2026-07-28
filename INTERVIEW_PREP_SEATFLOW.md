# SeatFlow Interview Prep Guide

Last updated: 2026-07-08

Ye file SeatFlow project ke liye ek full interview cheat-sheet hai. Isme app kya karta hai, kaunsi tech kyu use hui, frontend-backend ka connection kaise hai, APIs kaise kaam karti hain, database schema kya hai, aur common interview questions ke short answers sab kuch Hinglish mein diya gaya hai.

## 1) Project In One Line

SeatFlow ek full-stack seat reservation aur crowd management platform hai jo libraries, study rooms, coworking spaces, labs, aur hostels jaise shared places ke liye bana hai. Students seats browse kar sakte hain, reserve kar sakte hain, check in/out kar sakte hain, aur admins poore seating system ko manage kar sakte hain.

## 2) Problem It Solves

SeatFlow se pehle shared spaces mein seat allocation mostly manual, unclear, aur hard to track hota hai.

Ye project in problems ko solve karta hai:

- Real-time seat visibility nahi hoti
- Double booking aur scheduling conflict hote hain
- Booking history aur proper audit trail nahi hota
- Floors, sections, seats, aur users manage karne ke liye admin dashboard nahi hota
- Seat busy ho to waiting queue nahi hoti
- Authentication aur role-based access control clean nahi hota

## 3) What The Product Actually Does

SeatFlow ke do main user types hain:

- Student
- Admin

Student flow:

- Register ya login karta hai
- Available seats dekhta hai
- Time window ke liye seat book karta hai
- Sahi time pe check in karta hai
- Use ke baad check out karta hai
- Current booking, queue status, aur reservation history dekh sakta hai

Admin flow:

- Floors create aur manage karta hai
- Floors ke under sections create aur manage karta hai
- Seats create, update, delete karta hai
- Users manage karta hai
- Reservation aur system analytics dekhta hai
- Utilization patterns monitor karta hai

## 4) Technology Stack And Why It Is Used

### Frontend

React

- React SeatFlow ka UI library hai jisse app component-based Single Page App ki tarah bana hai.
- Isse cards, tables, modals, dashboards, aur layouts reuse karna easy ho jata hai.
- SeatFlow mein React seat availability, booking state, aur dashboard pages ko user action ke according update karta hai.

Vite

- Fast development server aur build tool hai.
- Old bundlers ke comparison mein startup fast hai.

React Router

- React Router app ke andar page navigation ko bina full page reload ke handle karta hai.
- Ye public pages, student pages, admin pages, aur role-based protected routes manage karta hai.
- SeatFlow mein isse dashboard, seat browser, booking history, aur admin panels easily switch hote hain.

Axios

- Axios SeatFlow frontend ka HTTP client hai jo backend API se baat karta hai.
- Ye localStorage se JWT uthakar protected requests mein automatically attach karta hai.
- Error handling bhi standard banata hai, isliye login failure, validation error, ya auth issue clean message ke saath UI mein dikh sakta hai.
- Real use case: jab student seat page open karta hai ya seat book karta hai, Axios `/api/seats` ya `/api/reservations` pe request bhejta hai aur latest data laata hai.

Tailwind CSS

- Utility-first styling ke liye use hua hai.
- UI fast iterate hoti hai aur design consistent rehta hai.

react-hot-toast

- Success aur error messages dikhane ke liye lightweight feedback system.

lucide-react

- Dashboard aur navigation ke liye clean icon set.

recharts

- Analytics charts aur visualizations ke liye.

### Backend

Node.js

- Node.js SeatFlow backend ko run karta hai aur server-side JavaScript execute karta hai.
- Frontend bhi JavaScript mein hai, isliye stack consistent aur simple rehta hai.
- Is project mein Node.js API server, cron jobs, reservation logic, aur MongoDB connection startup handle karta hai.

Express

- Express SeatFlow ki REST APIs expose karne wala web framework hai.
- Ye routes, middleware, validation, aur controllers ko clean way mein organize karta hai.
- Real use case: `/api/auth/login`, `/api/reservations`, aur `/api/analytics/admin` jaisi APIs Express routes se handle hoti hain.

MongoDB

- MongoDB SeatFlow ka document database hai jahan users, floors, sections, seats, reservations, aur waiting queue store hoti hai.
- Ye project ke liye fit hai kyunki data naturally document-shaped hai aur references se relationships manage ho sakti hain.
- Real use case: jab seat book hoti hai ya reservation expire hoti hai, MongoDB seat status aur reservation document ko update karta hai.

Mongoose

- Mongoose MongoDB ke upar ODM layer hai jo SeatFlow data ko structure deti hai.
- Ye schemas, validation rules, relationships, indexes, aur hooks jaise password hashing define karti hai.
- Real use case: User schema password save hone se pehle hash karta hai, aur Reservation schema indexes use karke booking queries fast karta hai.

JWT

- JWT SeatFlow ka token-based authentication system hai.
- Login ya register ke baad backend token return karta hai aur frontend usko localStorage mein store karta hai.
- Real use case: `/api/seats` ya `/api/reservations/mine` jaisi protected requests mein Authorization header se token bheja jata hai.
- Isse server-side sessions ki need nahi padti aur auth stateless rehta hai.

bcryptjs

- Passwords ko securely hash karta hai.

express-validator

- Request body aur params ko validate karta hai.

cors

- Frontend aur backend ke beech safe communication allow karta hai.

dotenv

- Environment variables manage karta hai.

node-cron

- node-cron background tasks ko fixed interval pe run karta hai.
- SeatFlow mein ye active reservations ko scan karke unhe expire karta hai jinka end time cross ho chuka hai.
- Real use case: har 5 minute mein cron job seat free kar sakta hai, reservation expired mark kar sakta hai, aur queue ko next user ke liye aage badha sakta hai.

### Why These Technologies Fit This Project

- Seat booking mein fast UI updates chahiye, isliye React suitable hai.
- Seat availability, booking, aur admin operations API-driven hain, isliye Express fit baithta hai.
- Reservation aur user documents ka shape time ke saath change ho sakta hai, isliye MongoDB + Mongoose useful hai.
- Authentication simple, scalable, aur stateless chahiye, isliye JWT better hai.
- Reservation expiry time-based hai, isliye node-cron automation ke liye useful hai.

## 5) High-Level Architecture

SeatFlow ek standard 3-layer full-stack architecture follow karta hai:

1. Frontend presentation layer
2. Backend API aur business logic layer
3. Database persistence layer

### Data Flow

User browser mein action karta hai

-> React page ya component

-> Axios API call

-> Express route

-> Auth aur validation middleware

-> Controller

-> Service layer

-> Mongoose model

-> MongoDB

-> Response wapas frontend ko milta hai

### Why The Project Is Split Into Controller, Service, Model

- Route files sirf endpoint definitions ko clean rakhte hain.
- Controllers HTTP request aur response mapping handle karte hain.
- Services business rules aur transaction logic handle karte hain.
- Models database schema aur indexes define karte hain.
- Middleware auth aur validation jaise cross-cutting concerns handle karta hai.

Is separation se code maintain, test, aur extend karna easy ho jata hai.

## 6) Actual Backend Folder Structure

### `backend/config`

- `env.js` required environment variables load karta hai aur defaults deta hai.
- `db.js` app ko MongoDB se connect karta hai.

### `backend/controllers`

Controllers HTTP requests ko service calls mein convert karte hain aur final response shape karte hain.

- `authController.js`
- `seatController.js`
- `floorController.js`
- `sectionController.js`
- `reservationController.js`
- `userController.js`
- `analyticsController.js`

### `backend/services`

Services mein real business logic hoti hai.

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

- `auth.js` for authentication aur authorization
- `validate.js` for validation result handling
- `errorHandler.js` for centralized error formatting

### `backend/utils`

- `validators.js` for express-validator rules
- `jwt.js` for token helpers
- `queryBuilder.js` for pagination aur sorting helpers
- `seed.js` for demo data generation
- `ApiError.js` aur `asyncHandler.js` for error handling patterns

## 7) Actual Frontend Folder Structure

### `frontend/src/pages`

Important pages:

- `HomePage.jsx` landing page ke liye
- `LoginPage.jsx` aur `RegisterPage.jsx` auth ke liye
- `StudentDashboard.jsx` student overview ke liye
- `SeatAvailabilityPage.jsx` seat browsing ke liye
- `BookingHistoryPage.jsx` reservation history ke liye
- `AdminDashboard.jsx` admin overview ke liye
- `ManageSeatsPage.jsx`
- `ManageFloorsPage.jsx`
- `ManageUsersPage.jsx`
- `AdminReservationsPage.jsx`
- `AnalyticsPage.jsx`
- `ProfilePage.jsx`
- `SettingsPage.jsx`
- `Error403.jsx` aur `Error404.jsx`

### `frontend/src/components`

Reusable UI building blocks:

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

- `AuthContext.jsx` logged-in user state, token handling, login, register, logout, aur session expiry logic store karta hai.

### `frontend/src/services`

- `api.js` Axios client hai.
- `index.js` auth, seats, floors, sections, reservations, users, aur analytics ke API wrappers export karta hai.

### `frontend/src/layouts`

- `PublicLayout.jsx` public pages ke liye
- `DashboardLayout.jsx` student aur admin dashboard views ke liye

## 8) How Frontend And Backend Are Connected

Frontend direct MongoDB se baat nahi karta. Wo sirf backend API se communicate karta hai.

### Connection Chain

React page

-> `frontend/src/services/index.js` ki service function

-> `frontend/src/services/api.js` ka Axios client

-> Express backend route

-> controller

-> service

-> model

-> MongoDB

### How Token Is Attached

`frontend/src/services/api.js` mein Axios request interceptor use hua hai.

Ye kya karta hai:

- `seatflow_token` localStorage se read karta hai
- `Authorization: Bearer <token>` header add karta hai
- authenticated requests automatically bhej deta hai

Iska matlab login ke baad har request mein token manually add karne ki zarurat nahi hoti.

### How Session Is Restored

`AuthContext.jsx` app start pe localStorage check karta hai.

Token ho to:

- `authService.getMe()` call hota hai
- current user data load hota hai
- session restore hoti hai

Token invalid ya expired ho to:

- token remove hota hai
- user locally logout ho jata hai
- session expiry state set hoti hai

## 9) Route And API Map

### Auth APIs

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

Signup, login, aur session restore ke liye use hoti hain.

### Seat APIs

- `GET /api/seats`
- `GET /api/seats/:id`
- `POST /api/seats`
- `PATCH /api/seats/:id`
- `DELETE /api/seats/:id`

Sirf Admin seat create, update, delete kar sakta hai.

### Floor APIs

- `GET /api/floors`
- `GET /api/floors/:id`
- `POST /api/floors`
- `PATCH /api/floors/:id`
- `DELETE /api/floors/:id`

Floor management bhi sirf Admin ke paas hai.

### Section APIs

- `GET /api/sections`
- `GET /api/sections/:id`
- `POST /api/sections`
- `PATCH /api/sections/:id`
- `DELETE /api/sections/:id`

Sections ko bhi Admin manage karta hai.

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

Ye booking lifecycle ko power karti hain.

### User APIs

- `GET /api/users`
- `PATCH /api/users/:id`
- `DELETE /api/users/:id`

Ye Admin only endpoints hain.

### Analytics APIs

- `GET /api/analytics/admin`
- `GET /api/analytics/student`

Dashboards aur metrics ke liye use hoti hain.

### Health Check

- `GET /api/health`

Server alive hai ya nahi, ye verify karne ke liye.

## 10) Request Lifecycle In This Project

Example: student reservation create karta hai.

1. Frontend `reservationService.create(data)` call karta hai.
2. Axios bearer token attach karta hai.
3. Express route `POST /api/reservations` request receive karta hai.
4. `authenticate` middleware JWT verify karta hai.
5. `authorize('Student')` ensure karta hai ki sirf student booking kare.
6. `reservationRules` `seatId`, `startTime`, aur `endTime` validate karti hain.
7. Controller request ko `reservationService.createReservation` ko pass karta hai.
8. Service time range, seat availability, aur active booking rules check karti hai.
9. Agar seat free ho to MongoDB transaction mein reservation create hoti hai aur seat reserved mark hoti hai.
10. Agar seat busy ho to user waiting queue mein add ho jata hai.
11. Response UI ko reservation ya queue data ke saath milta hai.

Ye interview mein kaafi strong answer hota hai because isse full request flow clear hota hai.

## 11) Authentication And Authorization Flow

### Authentication

Authentication ka matlab hota hai user kaun hai ye verify karna.

SeatFlow mein:

- User email aur password se login karta hai.
- Backend password verify karta hai.
- Backend JWT return karta hai.
- Frontend token localStorage mein store karta hai.
- Har protected request Authorization header mein token bhejti hai.

### Authorization

Authorization ka matlab hota hai user kya kar sakta hai ye check karna.

SeatFlow mein:

- Student seats browse aur bookings create kar sakta hai.
- Admin seats, floors, sections, users, aur analytics manage kar sakta hai.
- `authorize('Admin')` ya `authorize('Student')` middleware ye enforce karta hai.

### Why JWT Is Used

- Stateless hai
- Scale karna easy hai
- SPA frontend apps ke liye suitable hai
- Server sessions memory mein store karne ki need nahi hoti

## 12) Database Schema And Why It Is Designed This Way

### User Schema

Fields:

- `name`
- `email`
- `password`
- `role`
- `status`

Why:

- `role` access control ke liye hai
- `status` account disable karne ke kaam aata hai without delete
- password save hone se pehle hash hota hai

### Floor Schema

Fields:

- `name`
- `description`
- `isActive`

Why:

- Floor seat allocation ka top-level grouping hai.
- `isActive` se soft disable possible hota hai.

### Section Schema

Fields:

- `name`
- `floor`
- `description`
- `isActive`

Why:

- Har section ek floor se linked hota hai.
- `floor + name` unique index same floor mein duplicate section name rokta hai.

### Seat Schema

Fields:

- `seatNumber`
- `floor`
- `section`
- `status`

Why:

- Har seat ek floor aur ek section se linked hoti hai.
- `floor + section + seatNumber` unique index duplicates prevent karta hai.
- `status` availability tracking ke kaam aata hai.

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

- User ko seat aur time range ke saath link karta hai.
- Full reservation lifecycle support karta hai.
- `userId`, `seatId`, aur `endTime` pe indexes queries fast karte hain.

### WaitQueue Schema

Fields:

- `userId`
- `seatId`
- `startTime`
- `endTime`
- `position`
- `status`

Why:

- Jab seat immediately available na ho tab overflow handle karta hai.
- Queue position order maintain karne mein help karti hai.

## 13) Why Mongoose Schema Is Important

Mongoose sirf data store karne ke liye nahi hai. Is project mein ye multiple problems solve karta hai:

- Field validation enforce karta hai
- Defaults add karta hai
- Performance ke liye indexes add karta hai
- Collections ke beech references support karta hai
- Password hashing jaise hooks support karta hai
- Complex queries ko cleaner banata hai

### Interview Definition

Schema database document ka structured blueprint hota hai. Isme fields, types, constraints, defaults, validations, aur relationships define hote hain.

## 14) Reservation Workflow In Detail

Ye SeatFlow ka sabse important business flow hai.

### Booking Steps

1. User seat, start time, aur end time submit karta hai.
2. Backend time window validate karta hai.
3. Backend check karta hai ki user ke paas already active reservation to nahi hai.
4. Backend seat existence verify karta hai.
5. Agar seat available ho to MongoDB transaction mein reservation create hoti hai.
6. Agar seat available na ho to user waiting queue mein chala jata hai.
7. Cancellation, check-out, ya expiry pe seat fir se available mark hoti hai.
8. Queue ka next user automatically process ho sakta hai.

### Why Transactions Are Used

Transactions data consistency protect karti hain jab multiple updates ek saath hone chahiye.

SeatFlow mein ye issues prevent hoti hain:

- reservation create ho gayi but seat status update nahi hua
- seat release ho gayi but reservation update nahi hua
- cancellation ya expiry ke baad queue galat move ho gayi

### Why This Is Important In Interviews

Isse dikhata hai ki aap consistency, concurrency, aur race conditions samajhte ho.

## 15) Queue System

SeatFlow mein wait queue isliye hai kyunki user kabhi aisi seat book kar sakta hai jo already occupied ho.

Queue flow:

- User seat request karta hai.
- Agar seat unavailable ho to request fail nahi hoti.
- Us user ke liye queue entry ban jati hai.
- Jab seat free hoti hai to `queueService` next user ko process kar sakta hai.

Why this is useful:

- Better user experience
- Seat busy hone pe dead-end failure nahi hota
- Requests ka fair ordering maintain hota hai

## 16) Cron Job And Auto Expiry

`backend/services/cronService.js` har 5 minute mein job schedule karta hai.

Purpose:

- End time cross kar chuki reservations dhoondhna
- Unhe expired ya completed mark karna
- Seats free karna
- Agar needed ho to waiting queue process karna

Why use cron:

- Seat availability accurate rehti hai
- Manual cleanup kam hoti hai
- System maintenance automate hoti hai

## 17) Validation And Error Handling

### Validation Layer

Request validation `backend/utils/validators.js` mein `express-validator` rules se hoti hai.

Examples:

- email valid hona chahiye
- password minimum length ka hona chahiye
- seatId valid MongoDB ID hona chahiye
- time fields ISO 8601 format mein hone chahiye

### Error Handling Layer

Sab errors centralized error handler se pass hote hain.

Ye handle karta hai:

- duplicate key errors
- invalid ObjectId cast errors
- validation errors
- auth errors
- not found errors

Benefits:

- Consistent API error responses
- Debugging easy
- Frontend error mapping clean

## 18) Frontend State And UI Flow

### Auth Context

`AuthContext.jsx` source of truth hai:

- current user
- loading state
- session expired state
- login
- register
- logout

### Protected Routes

App pages ko role ke basis pe protect karta hai:

- Student pages unauthenticated users se hidden hain
- Admin pages students se hidden hain
- Public pages login ke baad hide ho sakti hain where needed

### Layouts

`PublicLayout.jsx`

- Landing, login, aur register pages ke liye use hota hai.

`DashboardLayout.jsx`

- Authenticated pages ke liye use hota hai.
- Sidebar, breadcrumbs, quick access, user menu, aur role-based navigation dikhata hai.

### UI Feedback

- Toasts success aur error messages ke liye
- Spinners aur skeleton loaders async loading ke liye
- Status badges reservation state dikhane ke liye

## 19) API Response Pattern

Mostly APIs ek consistent JSON shape return karti hain.

Common pattern:

```json
{
  "success": true,
  "data": {}
}
```

Paginated data ke liye:

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

Isse frontend ko data aur errors handle karna predictable ho jata hai.

## 20) How APIs Are Generated In This Project

Agar interviewer pooche, "APIs kaise generated hain?" to answer ye hai:

SeatFlow APIs kisi low-code tool se auto-generate nahi hui hain. Ye manually Express route definitions, controller functions, service methods, validation rules, aur Mongoose models ke through design aur implement ki gayi hain.

Process:

1. Business action decide hota hai.
2. Route path aur HTTP method define hota hai.
3. Auth aur authorization middleware add hota hai.
4. Request validation rules add hoti hain.
5. Controller handler likha jata hai.
6. Business logic service mein shift hoti hai.
7. Data Mongoose model ke through read/write hota hai.
8. Normalized JSON response return hota hai.

Matlab API project requirements se logically banti hai aur clean layered structure mein implement hoti hai.

## 21) Why This Architecture Is Good

- Samajhna easy hai
- Scale karna easy hai
- Debug karna easy hai
- Layer-wise test karna easy hai
- Role-based logic clean hai
- Reservation concurrency controlled hai
- UI aur API properly separated hain

## 22) Important Design Decisions

### Why No SQL Database Here

MongoDB project ke liye fit hai because:

- Data shape flexible hai
- Nested references manageable hain
- Development mein fast iteration milti hai
- Seat, queue, aur reservation documents evolve kar sakte hain

### Why Not Store Sessions In Server Memory

JWT ko server sessions ke bajay use kiya gaya hai because:

- Stateless auth better scale karta hai
- Frontend-backend separation easy hoti hai
- Deployment simpler hota hai

### Why Use Service Layer

Booking, cancelling, queue processing, aur expiry jaise business logic ko route files mein nahi rakhna chahiye.

Isse code maintainable aur reusable rehta hai.

## 23) Seed Data Purpose

`backend/utils/seed.js` demo data generate karta hai:

- 1 admin user
- Bahut saare student users
- Floors
- Sections
- Seats
- Reservations
- Queue-related sample data

Seed data ki importance:

- Local development mein help karti hai
- Dashboard demo quickly ho jata hai
- Analytics ke liye realistic data milta hai

## 24) Best Interview Answers In Short Form

### What is SeatFlow?

SeatFlow ek seat reservation aur crowd management platform hai jisme student aur admin workflows hain.

### What is your backend architecture?

Express ke saath route, controller, service, model separation use hui hai aur database ke liye MongoDB with Mongoose hai.

### Why did you use MongoDB?

Kyuki data document-oriented hai, flexible hai, aur booking plus queue structures ke liye easy to evolve hai.

### Why did you use JWT?

Kyuki ye stateless authentication deta hai aur SPA apps ke liye achha fit hai.

### How do you prevent double booking?

Seat status checks, overlapping reservation checks, MongoDB transactions, aur queue fallback se.

### What happens when a seat is unavailable?

User ko reject karne ke bajay waiting queue mein add kiya jata hai.

### How do you handle expired reservations?

Cron jobs stale reservations expire karti hain aur seat free karti hain.

### How do you control access?

Role-based authorization middleware se.

### How do you validate requests?

Controller se pehle `express-validator` rules se.

## 25) Top Interview Questions And Ready Answers

### 1. Why did you choose a layered architecture?

Kyuki ye HTTP handling, business logic, aur data access ko separate karti hai, jisse app maintain aur debug karna easy hota hai.

### 2. What is the role of the service layer?

Ye reservation creation, cancellation, queue handling, aur expiry processing jaise business logic ko hold karti hai.

### 3. Why do you need Mongoose if you already have MongoDB?

Mongoose schema validation, relationships, middleware hooks, indexes, defaults, aur cleaner structure add karta hai.

### 4. How does authentication work?

User login karta hai, backend JWT issue karta hai, frontend token store karta hai, aur har protected API request Authorization header mein token bhejti hai.

### 5. What is the difference between authentication and authorization?

Authentication ka matlab hai user kaun hai. Authorization ka matlab hai user kya kar sakta hai.

### 6. How do you avoid booking conflicts?

Seat status check, overlapping reservation check, aur database transactions se.

### 7. Why is a waiting queue useful?

Jab seat instantly available na ho to demand ko fairly handle karne ke liye.

### 8. What is the purpose of cron jobs here?

Ye stale reservations automatically expire karti hain aur seat availability correct rakhti hain.

### 9. How does frontend know the user is logged in?

Auth context localStorage check karta hai aur backend ke `getMe()` call se token verify karta hai.

### 10. What are the major collections in MongoDB?

User, Floor, Section, Seat, Reservation, aur WaitQueue.

### 11. Why are indexes used?

Search fast karne aur uniqueness enforce karne ke liye, especially seat aur section combinations mein.

### 12. How do you handle errors consistently?

Centralized error handler se jo errors ko predictable JSON responses mein convert karta hai.

### 13. What is the main benefit of separating routes and controllers?

Routes simple rehte hain while controllers request-response logic handle karte hain aur services core business rules handle karti hain.

### 14. How does the reservation lifecycle work?

Reservation create hoti hai -> check in -> check out ya cancel -> time pass hone pe expire.

### 15. Why is React suitable for this project?

Kyuki UI interactive hai, dashboard-heavy hai, aur stateful hai.

## 26) If You Need A 30-Second Explanation In Interview

SeatFlow ek MERN-style reservation system hai jahan students seats reserve kar sakte hain, check in/out kar sakte hain, aur history dekh sakte hain, while admins seat map, users, aur analytics manage karte hain. Architecture mein React frontend pe, Express aur Node.js backend pe, MongoDB aur Mongoose data storage ke liye, JWT auth ke liye, aur service-based backend design clean reservation aur queue logic ke liye use hua hai.

## 27) Final Revision Checklist

Interview se pehle ye explain kar pao:

- App ka problem kya hai
- React, Express, MongoDB, aur JWT kyu choose kiye
- Auth end to end kaise kaam karti hai
- Reservation flow kaise kaam karta hai
- Queue aur cron expiry kaise work karte hain
- Har schema mein kya fields hain
- Transactions kyu needed hain
- Role-based access control kyu important hai
- Frontend aur backend ka connection kaise hai

Agar ye clearly explain kar loge, to project questions confidently answer ho jayenge.