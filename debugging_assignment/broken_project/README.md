# Broken Project (intentional bugs)
This is the intentionally-broken project for the Debugging Assignment.

**Bugs included intentionally:**
1. `express.json()` middleware is registered *after* routes — so POST body parsing fails.
2. SQL query uses wrong column name `userid` (should be `id`) — causes getUser to not find records.
3. Controller uses string-interpolated SQL (not parameterized) and has no try/catch — poor error handling and SQL injection risk.
4. `src/db.js` uses non-promise mysql2 pool while controllers call `pool.execute()` assuming promise API (this may lead to usage issues).

**How to reproduce**
1. Create the database and users table: `mysql -u root -p < schema.sql`
2. Install dependencies: `npm install`
3. Start: `npm start`
4. Try to POST to `/api/users` with JSON body — it will fail because body is undefined.

