const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const movieController = require('../controllers/movieController');

// TODAS protegidas
router.use(authMiddleware);

// CRUD
router.get('/', movieController.getAllMovies);
router.get('/favorites', movieController.getFavoriteMovies);
router.get('/:id', movieController.getMovieById);
router.post('/', movieController.createMovie);
router.put('/:id', movieController.updateMovie);
router.delete('/:id', movieController.deleteMovie);

// Extras
router.patch('/:id/favorite', movieController.toggleFavorite);
router.patch('/:id/rating', movieController.updateRating);

module.exports = router;