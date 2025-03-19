const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  role: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    watch: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
