const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

const session = require("express-session");
const sessionKey = process.env.SESSION_KEY;

app.use(
	session({
		secret: sessionKey,
		resave: false,
		saveUninitialized: true,
		cookie: { secure: false },
	})
);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

// Export the app instead of listening here
module.exports = app;