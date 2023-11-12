const express = require('express');
const { authenticateUser } = require('../Middlewares/authMiddleware');
const userSchema = require('../Models/userSchema');
const blogPostSchema = require('../Models/blogPostSchema');

const adminRouter = express.Router();

// View all users (only for admin)
adminRouter.get('/admin/users', authenticateUser, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  res.json(users);
});

// Block/Disable a user (only for admin)
adminRouter.put('/admin/block/:username', authenticateUser, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const user = users.find((u) => u.username === req.params.username);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  user.isBlocked = true;
  res.json({ message: 'User blocked successfully' });
});

// List all blog posts for admin
adminRouter.get('/admin/posts', authenticateUser, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const postList = blogPosts.map((post) => ({
    title: post.title,
    author: post.author,
    creationDate: post.createdAt, // Add createdAt field to the blogPostSchema
    averageRating: post.ratings.length
      ? post.ratings.reduce((acc, curr) => acc + curr, 0) / post.ratings.length
      : 0,
  }));

  res.json(postList);
});

// View a particular blog post for admin
adminRouter.get('/admin/posts/:postId', authenticateUser, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const post = blogPosts.find((p) => p._id === req.params.postId);

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  res.json(post);
});

// Disable a blog (only for admin)
adminRouter.put('/admin/disable/:postId', authenticateUser, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const post = blogPosts.find((p) => p._id === req.params.postId);

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  post.isDisabled = true;
  res.json({ message: 'Post disabled successfully' });
});

module.exports = adminRouter;
