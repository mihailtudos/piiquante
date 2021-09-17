//package imports
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

//imports of default node packages
const path = require('path');

//route imports
const userRoutes = require('./routes/user');

//running express function to create an express app
const app = express();

mongoose.connect(process.env.DATABASE_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB Atlas', error);
  })

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));
// app.use('/api/stuff', stuffRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;