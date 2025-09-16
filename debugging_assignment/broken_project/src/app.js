const express = require('express');
const app = express();
const usersRouter = require('./routes/users');

// BROKEN: express.json() is registered AFTER routes, so req.body will be undefined in handlers
app.use('/api/users', usersRouter);

app.use(express.json());

module.exports = app;
