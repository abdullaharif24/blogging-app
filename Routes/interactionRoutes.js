const express = require('express');
const { authenticateUser } = require('../Middlewares/authMiddleware');
const userSchema = require('../Models/userSchema');
const blogPostSchema = require('../Models/blogPostSchema');

const interactionRouter = express.Router();

// Dummy data to store notifications (in-memory storage, use a database in production)
const notifications = [];

// Follow a user
interactionRouter.post('/follow/:username', authenticateUser, async (req, res) => {
  try {
    const followedUser = await userSchema.findOne({ username: req.params.username, isBlocked: false });

    if (!followedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.user.username === req.params.username) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    // Check if already following
    if (
      follows.some((follow) => follow.follower === req.user.username && follow.followed === req.params.username)
    ) {
      return res.status(400).json({ message: 'Already following this user' });
    }

    follows.push({ follower: req.user.username, followed: req.params.username });

    // Notify the followed user (simplified, in a real system, you might use a messaging system)
    const notification = {
      type: 'follow',
      sender: req.user.username,
      recipient: req.params.username,
      timestamp: new Date(),
    };
    notifications.push(notification);

    res.json({ message: 'Followed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user feed with notifications
interactionRouter.get('/feed', authenticateUser, (req, res) => {
  const userFeed = blogPosts.filter((post) => follows.some((follow) => follow.followed === post.author));

  // Retrieve notifications for the user
  const userNotifications = notifications.filter((notification) => notification.recipient === req.user.username);

  res.json({ feed: userFeed, notifications: userNotifications });
});

// Implement notifications for new comments (simplified)
interactionRouter.post('/comment/:postId', authenticateUser, async (req, res) => {
  try {
    const post = await blogPostSchema.findById(req.params.postId);

    if (!post || post.isDisabled) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Add comment to the post
    const newComment = {
      username: req.user.username,
      content: req.body.content,
      timestamp: new Date(),
    };
    post.comments.push(newComment);
    await post.save();

    // Notify the post author (simplified, in a real system, you might use a messaging system)
    const notification = {
      type: 'comment',
      sender: req.user.username,
      recipient: post.author,
      postId: post._id,
      timestamp: new Date(),
    };
    notifications.push(notification);

    res.json({ message: 'Comment added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = interactionRouter;
