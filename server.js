const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const uploadRoutes = require('./routes/upload');
const playerRoutes = require('./routes/player')
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//MongoDB connection
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Routes
app.use('/upload', uploadRoutes);
app.use('/player', playerRoutes)

// Unknown route handler
app.use((req, res) => res.sendStatus(404));

app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.error(errorObj.log, errorObj); // Log the full error
  return res.status(errorObj.status).json({
    message: errorObj.message.err,
    error: err.message,
    stack: err.stack, // Include the stack trace for debugging
  });
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});