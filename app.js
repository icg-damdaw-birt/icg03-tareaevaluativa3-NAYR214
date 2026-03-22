require('dotenv').config();

const express = require('express');
const app = express();

app.use(express.json());

// Rutas
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);

module.exports = app;