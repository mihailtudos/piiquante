//package imports
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

//imports of default node packages
const path = require('path');

//route imports
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

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

app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));
// app.use('/api/stuff', stuffRoutes);
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;