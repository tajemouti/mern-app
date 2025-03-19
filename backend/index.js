const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const User = require('./models/User');

const mongoURI = 'mongodb://localhost:27017/mernDB';

const app = express();

app.use(express.json());
app.use(cors());

mongoose
  .connect(mongoURI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Get users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new user
app.post('/users', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: 'Bad request' });
  }
});

// Update user
app.put('users/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: 'Bad request' });
  }
});

app.listen(3000);
