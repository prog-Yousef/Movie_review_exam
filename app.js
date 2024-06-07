
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();

const PORT = process.env.PORT || 8000;

const connectDB = require ('./config/dbConn');

const movieRoutes = require('./routes/movieRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const userRoutes = require('./routes/userRoutes');
// Middleware
app.use(express.json());

// Routes
app.use('/reviews', reviewRoutes);
app.use('/users', userRoutes);
app.use('/movies', movieRoutes);


// Connect to MongoDB
connectDB();

//If connected to database run server.
mongoose.connection.once("open", () => {
  console.log("Connected to mongoDB.");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});


