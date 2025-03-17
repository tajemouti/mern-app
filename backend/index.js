const mongoose = require('mongoose');
const express = require('express');

const mongoURI = 'mongodb://localhost:27017/mernDB';

mongoose
  .connect(mongoURI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

const app = express();

app.use(express.json());
