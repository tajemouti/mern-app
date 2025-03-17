const mongoose = require('mongoose');
const express = require('express');
const User = require('./models/User');

const mongoURI = 'mongodb://localhost:27017/mernDB';

mongoose
  .connect(mongoURI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

const app = express();

app.use(express.json());

// Get users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
