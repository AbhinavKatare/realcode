const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { SECRET } = require('../middleware/auth');

const router = express.Router();

router.post('/register',
  body('username').isLength({ min: 3 }),
  body('password').isLength({ min: 5 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { username, password } = req.body;
    let userExists = await User.findOne({ username });
    if (userExists) return res.status(400).json({ error: 'Username already taken' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({ username, passwordHash });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  }
);

router.post('/login',
  body('username').exists(),
  body('password').exists(),
  async (req, res) => {
    let { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const payload = { id: user._id, username: user.username, role: user.role };
    const token = jwt.sign(payload, SECRET, { expiresIn: '1d' });

    res.json({ token, user: payload });
  }
);

module.exports = router;
