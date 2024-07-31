const mongoose = require('mongoose');
const Player = require('../models/players');
require('dotenv').config(); // Load environment variables from .env file

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    return Player.find({});
  })
  .then(players => {
    console.log('Players in the database:', players);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  })
  .finally(() => {
    mongoose.connection.close();
  });

