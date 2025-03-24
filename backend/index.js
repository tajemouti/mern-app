const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const auth = require('./middleware/auth');
const isAdmin = require('./middleware/isAdmin');

dotenv.config();

const { JWT_SECRET, mongoURI } = process.env;

const app = express();

app.use(express.json());
app.use(cors());

mongoose
  .connect(mongoURI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// User Signup
app.post('/signup', async (req, res) => {
  try {
    const {
      name, age, role, email, password,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const newUser = new User({
      name, age, role, email, password,
    });
    await newUser.save();

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// User Signin
app.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

    return res.json({ token });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get users
app.get('/users', auth, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new user
app.post('/users', auth, isAdmin, async (req, res) => {
  try {
    const {
      name, age, role, email, password,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const newUser = new User({
      name, age, role, email, password,
    });

    await newUser.save();
    return res.status(201).json(newUser);
  } catch (err) {
    return res.status(400).json({ error: 'Bad request' });
  }
});

// Update user
app.put('/users/:id', auth, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: 'Bad request' });
  }
});

// Delete user
app.delete('/users/:id', auth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: 'Bad request' });
  }
});

app.listen(3000);
