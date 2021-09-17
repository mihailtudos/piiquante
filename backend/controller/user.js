const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../model/user');

exports.signup = ((req, res, next) => {
  // hashing the password
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash
      });

      user.save()
        .then((user) => {
          res.status(201).json({
            message: 'User created successfully'
          });
        })
        .catch((error) => {
          res.status(400).json({
            message: 'Something went wrong while trying to log you in, please try again later'
          })
        })
    })
    .catch((error) => {
      res.status(500).json({
        error
      });
    });
});

exports.login = ((req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if(!user) {
        return res.status(401).json({
          error: new Error('Account details don\'t match!')
        })
      }
      bcrypt.compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            res.status(401).json({
              error: new Error('Account details don\'t match')
            })
          }

          const token = jwt.sign(
            { userId: user._id },
            process.env.SECRET_KEY,
            { expiresIn: '24h' }
          );
          res.status(200).json({
            userId: user._id,
            token: token
          });
        })
    })
    .catch((error) => {
      res.status(500).json({
        error
      })
    })
});