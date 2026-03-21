const request = require('supertest');
const app = require('../app');
const prisma = require('../lib/prisma');

// 🔥 Mock de Prisma
jest.mock('../lib/prisma', () => ({
  movie: {
    findFirst: jest.fn(),
    update: jest.fn(),
  },
}));

// 🔥 Mock de authMiddleware (CORREGIDO)
jest.mock('../middleware/authMiddleware', () => {
  return (req, res, next) => {
    req.user = { id: 'user123' };
    next();
  };
});

describe('PATCH /api/movies/:id/rating', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update rating successfully', async () => {
    prisma.movie.findFirst.mockResolvedValue({
      id: 'movie123',
      ownerId: 'user123',
      rating: 0,
    });

    prisma.movie.update.mockResolvedValue({
      id: 'movie123',
      ownerId: 'user123',
      rating: 4,
    });

    const res = await request(app)
      .patch('/api/movies/movie123/rating')
      .send({ rating: 4 });

    expect(res.statusCode).toBe(200);
    expect(res.body.rating).toBe(4);
  });

  it('should return 400 if rating is invalid', async () => {
    const res = await request(app)
      .patch('/api/movies/movie123/rating')
      .send({ rating: 6 });

    expect(res.statusCode).toBe(400);
  });

  it('should return 400 if rating is missing', async () => {
    const res = await request(app)
      .patch('/api/movies/movie123/rating')
      .send({});

    expect(res.statusCode).toBe(400);
  });
});