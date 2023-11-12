const express = require('express');
const { authenticateUser } = require('../Middlewares/authMiddleware');
const blogPostSchema = require('../Models/blogPostSchema');

const postRouter = express.Router();

// Create a blog post
postRouter.post('/posts', authenticateUser, async (req, res) => {
  try {
    const { title, content } = req.body;
    const newPost = new blogPostSchema({
      title,
      content,
      author: req.user.username,
      ratings: [],
      comments: [],
      isDisabled: false,
    });
    await newPost.save();
    res.status(201).json({ message: 'Post created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Retrieve all blog posts
postRouter.get('/posts', async (req, res) => {
  try {
    const posts = await blogPostSchema.find({ isDisabled: false });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Retrieve a specific blog post
postRouter.get('/posts/:postId', async (req, res) => {
  try {
    const post = await blogPostSchema.findById(req.params.postId);
    if (!post || post.isDisabled) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a blog post
postRouter.put('/posts/:postId', authenticateUser, async (req, res) => {
  try {
    const post = await blogPostSchema.findById(req.params.postId);

    if (!post || post.isDisabled || post.author !== req.user.username) {
      return res.status(404).json({ message: 'Post not found or unauthorized' });
    }

    // Update logic here
    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;

    await post.save();

    res.json({ message: 'Post updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a blog post
postRouter.delete('/posts/:postId', authenticateUser, async (req, res) => {
  try {
    const post = await blogPostSchema.findById(req.params.postId);

    if (!post || post.isDisabled || post.author !== req.user.username) {
      return res.status(404).json({ message: 'Post not found or unauthorized' });
    }

    // Delete logic here
    post.isDisabled = true;
    await post.save();

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = postRouter;
