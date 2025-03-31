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

const { JWT_SECRET, mongoURI, PORT } = process.env;

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
      name, age, email, password,
    } = req.body;
    const role = 'user';

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

    return res.json({ token, user: { name: user.name, role: user.role, email: user.email } });
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
    if (req.user.userId !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { email, role, ...updateData } = req.body;

    if (role && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized to change role' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== req.params.id) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { ...updateData, ...(email && { email }), ...(role && { role }) },
      { new: true },
    );

    return res.json(updatedUser);
  } catch (err) {
    return res.status(400).json({ error: 'Bad request' });
  }
});

// Delete user
app.delete('/users/:id', auth, async (req, res) => {
  try {
    if (req.user.userId !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    return res.status(400).json({ error: 'Bad request' });
  }
});

app.listen(PORT);
