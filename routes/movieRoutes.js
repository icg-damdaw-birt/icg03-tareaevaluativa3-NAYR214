const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const movieController = require('../controllers/movieController');

router.get('/', authMiddleware, movieController.getAllMovies);
router.get('/favorites', authMiddleware, movieController.getFavoriteMovies);
router.get('/:id', authMiddleware, movieController.getMovieById);

router.post('/', authMiddleware, movieController.createMovie);
router.put('/:id', authMiddleware, movieController.updateMovie);
router.delete('/:id', authMiddleware, movieController.deleteMovie);


router.patch('/:id/rating', authMiddleware, movieController.updateRating);

router.patch('/:id/favorite', authMiddleware, movieController.toggleFavorite);

module.exports = router;