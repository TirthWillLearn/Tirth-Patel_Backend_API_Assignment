# Course Platform API

A simple REST API built with **Node.js**, **Express**, and **MySQL** that supports user registration/login, admin course creation, student enrollment, and paginated course listing.

---

## Table of contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Environment variables](#environment-variables)
- [Setup & run](#setup--run)
- [Database schema](#database-schema)
- [Available scripts](#available-scripts)
- [API Endpoints & examples](#api-endpoints--examples)
- [Authentication](#authentication)
- [Pagination](#pagination)
- [Error handling](#error-handling)
- [Notes & recommendations](#notes--recommendations)

---

## Features

- User registration and login (passwords hashed with `bcrypt`, JWT auth)
- Role-based access: `admin` and `student`
- Admins can create courses
- Students can enroll in courses (unique constraint prevents duplicates)
- Paginated course listing (`?page=&limit=`)
- Secure, parameterized SQL queries using `mysql2/promise` pool

---

## Prerequisites

- Node.js v16+ (recommended v18+)
- MySQL server
- `npm` or `yarn`

---

## Environment variables

Copy `.env` and set values:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=course_platform
JWT_SECRET=supersecretkey
JWT_EXPIRES_IN=1d
```

## Setup & run

1. Clone the repo and `cd` into it:

```bash
git clone <your-repo-url>
cd course-api
```

2. Install dependencies:

```bash
npm install
```

3. Create the database and tables:

- Open MySQL and run `schema.sql`, or:

```bash
mysql -u root -p < schema.sql
```

4. Copy `.env` to your `.env` and edit values:

```bash
cp .env .env
```

5. Start the server (development):

```bash
npm run dev
```

or production:

```
npm start
```

6. Health check:

```bash
GET http://localhost:3000/health
```

## Database schema (summary)

Primary tables in `schema.sql`:

- `users` — `id, name, email (unique), password_hash, role('student'|'admin'), created_at`

- `courses` — `id, title, description, price, created_by (fk users.id), created_at`

- `enrollments` — `id, user_id, course_id, enrolled_at, status, UNIQUE(user_id, course_id)`

Indexes:

- `idx_courses_created_at` on courses(created_at)

- `idx_enrollments_course_id`, `idx_enrollments_user_id`

## Available scripts

- `npm run dev` — start with `nodemon` (development)
- `npm start` — run production server

## API Endpoints & examples

- Register:
  `POST /api/auth/register`

Body:

```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "s3cret",
  "role": "student"
}
```

Response:

```json
{
  "user": {
    "id": 1,
    "name": "Alice",
    "email": "alice@example.com",
    "role": "student"
  },
  "token": "<jwt>"
}
```

- Login:
  `POST /api/auth/login`

Body:

```json
{ "email": "alice@example.com", "password": "s3cret" }
```

Response:

```json
{
  "user": {
    "id": 1,
    "name": "Alice",
    "email": "alice@example.com",
    "role": "student"
  },
  "token": "<jwt>"
}
```

- Create course (admin only):
  `POST /api/courses`

Headers: `Authorization: Bearer <token>` (token from an admin user)

Body:

```json
{ "title": "Node.js Basics", "description": "Intro to Node", "price": 9.99 }
```

- List courses (with pagination):
  `GET /api/courses?page=1&limit=10`

Response:

```json
{
  "data": [
    /* array of courses */
  ],
  "meta": { "page": 1, "limit": 10, "total": 45, "totalPages": 5 }
}
```

- Course details:`GET /api/courses/:id`

- Enroll in a course (student only):
  `POST /api/courses/:id/enroll`

Headers: `Authorization: Bearer <STUDENT_TOKEN>`

Response:

- `201` → `{ "message": "Enrolled successfully" }`

- `409` → `{ "message": "Already enrolled" }`

## Authentication

- JWT is issued at login/registration and must be sent as:

```makefile
Authorization: Bearer <token>
```

- Token payload includes `id` and `role`.

## Pagination

Use query parameters:

- `page` (default 1)

- `limit` (default 10, max 100)

## Error handling

- Centralized error middleware returns JSON errors.

- Common responses:

  - 400 — Bad Request

  - 401 — Unauthorized

  - 403 — Forbidden

  - 404 — Not Found

  - 409 — Conflict

  - 500 — Internal Server Error

## Notes & recommendations

- Add request validation (Joi / Zod)

- Configure CORS, rate limiting, HTTPS for production

- Use migrations instead of raw SQL

- Add tests (unit + integration)
