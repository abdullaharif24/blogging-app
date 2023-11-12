const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: String,
  isBlocked: Boolean,
});

module.exports = mongoose.model('User', userSchema);
