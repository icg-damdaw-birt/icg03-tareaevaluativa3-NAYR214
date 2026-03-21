const prisma = require('../lib/prisma');

// Helper
const getUserId = (req) => req.user.id || req.user.userId;

// GET /api/movies
exports.getAllMovies = async (req, res) => {
  const userId = getUserId(req);

  try {
    const movies = await prisma.movie.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: 'desc' },
    });

    return res.json(movies);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener las películas' });
  }
};

// GET /api/movies/:id
exports.getMovieById = async (req, res) => {
  const { id } = req.params;
  const userId = getUserId(req);

  try {
    const movie = await prisma.movie.findFirst({
      where: { id, ownerId: userId },
    });

    if (!movie) {
      return res.status(404).json({ error: 'Película no encontrada' });
    }

    return res.json(movie);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener la película' });
  }
};

// POST /api/movies
exports.createMovie = async (req, res) => {
  const { title, director, year, posterUrl } = req.body;
  const userId = getUserId(req);

  if (!title) {
    return res.status(400).json({ error: 'El título es obligatorio' });
  }

  try {
    const movie = await prisma.movie.create({
      data: { title, director, year, posterUrl, ownerId: userId },
    });

    return res.status(201).json(movie);
  } catch (error) {
    return res.status(400).json({ error: 'Datos inválidos' });
  }
};

// PUT /api/movies/:id
exports.updateMovie = async (req, res) => {
  const { id } = req.params;
  const userId = getUserId(req);
  const { title, director, year, posterUrl } = req.body;

  try {
    const result = await prisma.movie.updateMany({
      where: { id, ownerId: userId },
      data: { title, director, year, posterUrl },
    });

    if (result.count === 0) {
      return res.status(404).json({ error: 'Película no encontrada' });
    }

    const updatedMovie = await prisma.movie.findUnique({
      where: { id },
    });

    return res.json(updatedMovie);
  } catch (error) {
    return res.status(400).json({ error: 'No se pudo actualizar la película' });
  }
};

// DELETE /api/movies/:id
exports.deleteMovie = async (req, res) => {
  const { id } = req.params;
  const userId = getUserId(req);

  try {
    const result = await prisma.movie.deleteMany({
      where: { id, ownerId: userId },
    });

    if (result.count === 0) {
      return res.status(404).json({ error: 'Película no encontrada' });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: 'No se pudo eliminar la película' });
  }
};

// PATCH /api/movies/:id/favorite
exports.toggleFavorite = async (req, res) => {
  const { id } = req.params;
  const userId = getUserId(req);

  try {
    const movie = await prisma.movie.findFirst({
      where: { id, ownerId: userId },
    });

    if (!movie) {
      return res.status(404).json({ error: 'Película no encontrada' });
    }

    const updatedMovie = await prisma.movie.update({
      where: { id },
      data: {
        isFavorite: !movie.isFavorite,
      },
    });

    return res.status(200).json(updatedMovie);
  } catch (error) {
    return res.status(500).json({ error: 'Error al cambiar favorito' });
  }
};


exports.updateRating = async (req, res) => {
  const { id } = req.params;
  const { rating } = req.body;
  const userId = getUserId(req);

  //  VALIDACIÓN
  if (
    rating === undefined ||
    typeof rating !== 'number' ||
    rating < 0 ||
    rating > 5
  ) {
    return res.status(400).json({ error: 'Rating debe estar entre 0 y 5' });
  }

  try {
    const movie = await prisma.movie.findFirst({
      where: { id, ownerId: userId },
    });

    if (!movie) {
      return res.status(404).json({ error: 'Película no encontrada' });
    }

    const updatedMovie = await prisma.movie.update({
      where: { id },
      data: { rating },
    });

    return res.status(200).json(updatedMovie);
  } catch (error) {
    return res.status(500).json({ error: 'Error al actualizar rating' });
  }
};

// GET /api/movies/favorites
exports.getFavoriteMovies = async (req, res) => {
  const userId = getUserId(req);

  try {
    const favorites = await prisma.movie.findMany({
      where: {
        ownerId: userId,
        isFavorite: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json(favorites);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener favoritos' });
  }
};