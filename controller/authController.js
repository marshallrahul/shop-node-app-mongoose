const bcrypt = require ('bcrypt');
const User = require ('../models/user');
const {validationResult} = require ('express-validator');

exports.getLogIn = (req, res, next) => {
  res.render ('auth/login', {
    pageTitle: 'Log In',
    path: '/login',
    isAuthenticated: false,
    errorMessage: req.flash ('error')[0],
    validationError: null,
    values: {
      email: '',
      password: '',
    },
  });
};

exports.postLogIn = (req, res, next) => {
  const {email, password} = req.body;
  const errors = validationResult (req);
  if (!errors.isEmpty ()) {
    return res.status (422).render ('auth/login', {
      pageTitle: 'Log In',
      path: '/login',
      isAuthenticated: false,
      errorMessage: errors.array ()[0].msg,
      validationError: errors.array ()[0].param,
      values: {
        email: email,
        password: password,
      },
    });
  }
  User.findOne ({email: email})
    .then (user => {
      if (!user) {
        req.flash ('error', 'Invalid E-mail or Password');
        res.redirect ('/login');
      }
      bcrypt
        .compare (password, user.password)
        .then (doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save (err => {
              console.log (err);
              res.redirect ('/');
            });
          }
          return res.status (422).render ('auth/login', {
            pageTitle: 'Log In',
            path: '/login',
            isAuthenticated: false,
            errorMessage: 'Invalid E-mail or Password',
            validationError: null,
            values: {
              email: email,
              password: password,
            },
          });
        })
        .catch (err => {
          console.log (err);
          res.redirect ('/login');
        });
    })
    .catch (err => {
      console.log (err);
    });
};

exports.getSignUp = (req, res, next) => {
  res.render ('auth/signup', {
    pageTitle: 'Sign Up',
    path: '/signup',
    isAuthenticated: false,
    errorMessage: req.flash ('error')[0],
    validationError: null,
    values: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
};

exports.postSignUp = (req, res, next) => {
  const {email, password, confirmPassword} = req.body;
  const errors = validationResult (req);
  if (!errors.isEmpty ()) {
    return res.status (422).render ('auth/signup', {
      pageTitle: 'Sign Up',
      path: '/signup',
      isAuthenticated: false,
      errorMessage: errors.array ()[0].msg,
      validationError: errors.array ()[0].param,
      values: {
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      },
    });
  }
  bcrypt
    .hash (password, 12)
    .then (hashedPassword => {
      const user = new User ({
        email: email,
        password: hashedPassword,
        cart: {items: []},
      });
      return user.save ();
    })
    .then (user => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save (err => {
        console.log (err);
        res.redirect ('/');
      });
    })
    .catch (err => {
      console.log (err);
    });
};

exports.postLogOut = (req, res, next) => {
  req.session.destroy (err => {
    console.log (err);
    res.redirect ('/');
  });
};
