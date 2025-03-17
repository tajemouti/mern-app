const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { String, required: true },
  age: { Number, required: true },
  role: { String, required: true },
  email: {
    String,
    required: true,
    unique: true,
    watch: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
