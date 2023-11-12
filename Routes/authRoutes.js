const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authenticateUser } = require('../Middlewares/authMiddleware');
const userSchema = require('../Models/userSchema');

const authRouter = express.Router();

// User registration
authRouter.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userSchema({ username, email, password: hashedPassword, role: 'regular', isBlocked: false });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User login
authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userSchema.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role, isBlocked: user.isBlocked },
      'xyzh'
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User profile retrieval and update
authRouter.get('/profile', authenticateUser, (req, res) => {
  res.json({ user: req.user });
});

module.exports = authRouter;
