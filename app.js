const express = require('express');
const app = express();

const movieRoutes = require('./routes/movieRoutes');
const authRoutes = require('./routes/authRoutes');

app.use(express.json());

app.use('/api/movies', movieRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;