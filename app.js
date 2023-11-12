const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./Routes/authRoutes');
const postRoutes = require('./Routes/postRoutes');
const interactionRoutes = require('./Routes/interactionRoutes');
const searchRoutes = require('./Routes/searchRoutes');
const adminRoutes = require('./Routes/adminRoutes');

const app = express();

app.use(bodyParser.json());


app.use('/auth', authRoutes);
app.use('/posts', postRoutes);
app.use('/interaction', interactionRoutes);
app.use('/search', searchRoutes);
app.use('/admin', adminRoutes);


mongoose
  .connect("mongodb://127.0.0.1:27017/blog_platform", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected!");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// Start the server
app.listen(3000, () => {
  console.log(`Server is running on http://localhost: 3000`);
});


