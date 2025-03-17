const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  age: Number,
  role: String,
  email: String,
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
