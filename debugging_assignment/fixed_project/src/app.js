const express = require('express');
const app = express();
const usersRouter = require('./routes/users');
const errorHandler = require('./middleware/errorHandler');

// FIXED: register body parser before routes
app.use(express.json());

app.use('/api/users', usersRouter);

// centralized error handler
app.use(errorHandler);

module.exports = app;
