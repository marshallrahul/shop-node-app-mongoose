const path = require ('path');

const express = require ('express');
const mongoose = require ('mongoose');
const session = require ('express-session');
const MongoDBStore = require ('connect-mongodb-session') (session);
const flash = require ('connect-flash');
const csrf = require ('csurf');
const cookieParser = require ('cookie-parser');
const multer = require ('multer');

const app = express ();
const csrfProtection = csrf ();

const PORT = 8080;
const MONGODB_URI =
  'mongodb+srv://marshall:SEIBuTEBNqrSFeE3@cluster0.xz9dy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

const store = new MongoDBStore ({
  uri: MONGODB_URI,
  collection: 'session',
});

const fileStorage = multer.diskStorage ({
  destination: (req, file, cb) => {
    cb (null, 'images');
  },
  filename: (req, file, cb) => {
    cb (null, file.fieldname + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb (null, true);
  } else {
    cb (null, false);
  }
};

const adminRouter = require ('./router/adminRouter');
const shopRouter = require ('./router/shopRouter');
const authRouter = require ('./router/authRouter');
const errorController = require ('./controller/errorController');

// Model
const User = require ('./models/user');

// EJS
app.set ('view engine', 'ejs');
app.set ('views', 'views');

// Static folder
app.use (express.urlencoded ({extended: false}));
app.use (
  multer ({storage: fileStorage, fileFilter: fileFilter}).single ('image')
);
app.use (express.static (path.join (__dirname, 'public')));
app.use ('/images', express.static (path.join (__dirname, 'images')));

// sessions
app.use (
  session ({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// Store user in req
app.use ((req, res, next) => {
  if (!req.session.user) {
    return next ();
  }
  User.findById (req.session.user._id)
    .then (user => {
      req.user = user;
      next ();
    })
    .catch (err => {
      console.log (err);
    });
});

// middlewares
app.use (flash ());
app.use (cookieParser ());
app.use (csrfProtection);

// csurf
app.use ((req, res, next) => {
  res.locals.csrfToken = req.csrfToken ();
  next ();
});

// Routers
app.use ('/admin', adminRouter);
app.use (shopRouter);
app.use (authRouter);
app.use (errorController.get404page);

mongoose
  .connect (MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then (() => {
    app.listen (PORT, error => {
      if (error) {
        console.log (error);
      } else {
        console.log ('Server is listening on PORT', PORT);
      }
    });
  })
  .catch (err => {
    console.log (err);
  });
