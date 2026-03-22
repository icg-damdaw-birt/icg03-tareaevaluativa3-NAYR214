const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Fix para tests
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'testsecret';
}

// REGISTER
const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email y contraseña son obligatorios',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    return res.status(201).json({
      message: 'Usuario registrado correctamente',
    });

  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({
        error: 'El email ya existe',
      });
    }

    return res.status(500).json({
      error: 'Error interno del servidor',
    });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email y contraseña son obligatorios',
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        error: 'Credenciales inválidas',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        error: 'Credenciales inválidas',
      });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({ token });

  } catch (error) {
    return res.status(500).json({
      error: 'Error interno del servidor',
    });
  }
};

module.exports = { register, login };