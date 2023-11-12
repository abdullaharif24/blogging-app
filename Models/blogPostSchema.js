const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,
  ratings: [Number],
  comments: [{ user: String, comment: String }],
  isDisabled: Boolean,
});

module.exports = mongoose.model('BlogPost', blogPostSchema);
