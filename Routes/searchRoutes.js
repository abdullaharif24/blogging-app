const express = require('express');
const blogPostSchema = require('../Models/blogPostSchema');

const searchRouter = express.Router();

// Search for blog posts
searchRouter.get('/search', async (req, res) => {
  try {
    const { keyword, category, author } = req.query;

    const query = {};
    if (keyword) query.$text = { $search: keyword };
    if (category) query.category = category;
    if (author) query.author = author;

    const searchResults = await blogPostSchema.find(query);

    res.json(searchResults);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = searchRouter;
