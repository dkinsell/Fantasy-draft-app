// This file allows us to test with Postman if the upload route is working correctly BEFOR connecting our DB.
// Uncomment lines 109 - 112 in uploadController to test.

const mongoose = require('mongoose');
const Player = require('../models/players');
require('dotenv').config(); 

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

