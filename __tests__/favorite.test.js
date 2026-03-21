// ✅ MOCK AUTH (IMPORTANTE)
jest.mock('../middleware/authMiddleware', () => {
  return jest.fn((req, res, next) => {
    req.user = { id: 1 };
    next();
  });
});

// ✅ MOCK PRISMA
jest.mock('../lib/prisma', () => ({
  movie: {
    findMany: jest.fn()
  }
}));

// ✅ IMPORTS
const request = require('supertest');
const app = require('../app.js');
const prisma = require('../lib/prisma');

describe('GET /api/movies/favorites', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devuelve películas favoritas', async () => {
    prisma.movie.findMany.mockResolvedValue([
      {
        id: '1',
        title: 'Inception',
        isFavorite: true,
        ownerId: 1
      }
    ]);

    const res = await request(app)
      .get('/api/movies/favorites');

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].isFavorite).toBe(true);
  });

  it('devuelve array vacío si no hay favoritos', async () => {
    prisma.movie.findMany.mockResolvedValue([]);

    const res = await request(app)
      .get('/api/movies/favorites');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('maneja error interno', async () => {
    prisma.movie.findMany.mockRejectedValue(new Error('DB error'));

    const res = await request(app)
      .get('/api/movies/favorites');

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBeDefined();
  });

});