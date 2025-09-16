# Fixed Project (bugs resolved)
This is the fixed version of the small Express app.

How to run:
1. Create DB and table: `mysql -u root -p < schema.sql`
2. Copy `.env.example` to `.env` and set DB credentials
3. npm install
4. npm start

Endpoints:
- POST /api/users   -> create user (body: { name, email })
- GET  /api/users/:id  -> get user by id

Changes made:
- Use mysql2/promise pool in src/db.js so controllers can use async/await
- Registered express.json() before routes so req.body is parsed
- Controller functions now use try/catch and call next(err)
- Parameterized SQL queries and correct column name (id)
- Centralized error handler to return JSON error responses
