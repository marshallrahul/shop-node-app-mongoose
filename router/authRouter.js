const {check} = require ('express-validator');
const bcrypt = require ('bcrypt');

const express = require ('express');

const router = express.Router ();

const authController = require ('../controller/authController');

const User = require ('../models/user');

router.get ('/login', authController.getLogIn);

router.post (
  '/login',
  [
    check ('email')
      .isEmail ()
      .normalizeEmail ()
      .withMessage ('Please enter a valid E-mail')
      .custom (value => {
        return User.findOne ({email: value}).then (user => {
          if (!user) {
            return Promise.reject ("E-mail id doesn't exist in our database");
          }
        });
      }),
  ],
  authController.postLogIn
);

router.get ('/signup', authController.getSignUp);

router.post (
  '/signup',
  [
    check ('email')
      .isEmail ()
      .normalizeEmail ()
      .withMessage ('Please enter a valid E-mail')
      .custom (value => {
        return User.findOne ({email: value}).then (user => {
          if (user) {
            return Promise.reject (
              'E-mail exists already, please pick a different one.'
            );
          }
        });
      }),
    check (
      'password',
      'Please enter a password with only numbers and text and atleast 5 characters'
    ).isLength ({min: 5}),
    check ('confirmPassword').custom ((value, {req}) => {
      if (value !== req.body.password) {
        throw new Error ('Password confirmation is incorrect');
      }
      return true;
    }),
  ],
  authController.postSignUp
);

router.post ('/logout', authController.postLogOut);

module.exports = router;
