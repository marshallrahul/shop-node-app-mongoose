const fs = require ('fs');
const {validationResult} = require ('express-validator');
const Product = require ('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render ('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/add-product',
    editingMode: '',
    prod: '',
    isAuthenticated: req.session.isLoggedIn,
    errorMessage: null,
    validationErrors: null,
    oldInputs: {
      title: null,
      imageUrl: null,
      price: null,
      description: null,
    },
  });
};

exports.postAddProduct = (req, res, next) => {
  const {title, price, description} = req.body;
  const image = req.file;
  const errors = validationResult (req);
  // console.log (errors);
  if (!errors.isEmpty ()) {
    return res.render ('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/add-product',
      editingMode: false,
      prod: '',
      isAuthenticated: req.session.isLoggedIn,
      errorMessage: errors.array ()[0].msg,
      validationErrors: errors.array ()[0].param,
      oldInputs: {
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description,
      },
    });
  }
  const imageUrl = image.path;
  const product = new Product ({
    title: title,
    imageUrl: imageUrl,
    price: price,
    description: description,
  });
  product
    .save ()
    .then (result => {
      res.redirect ('/admin/admin-product');
    })
    .catch (err => {
      console.log (err);
    });
};

exports.getAdminProduct = (req, res, next) => {
  Product.find ()
    .then (products => {
      res.render ('admin/admin-products', {
        pageTitle: 'Admin Product',
        path: '/admin-product',
        prods: products,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch (err => {
      console.log (err);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndRemove (prodId)
    .then (product => {
      fs.unlink (product.imageUrl, err => {
        console.log (err);
      });
      res.redirect ('/admin/admin-product');
    })
    .catch (err => {
      console.log (err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const params = req.params.productId;
  const query = req.query.edit;
  Product.findById (params)
    .then (product => {
      res.render ('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        prod: product,
        editingMode: query,
        isAuthenticated: req.session.isLoggedIn,
        errorMessage: null,
        validationErrors: null,
        oldInputs: null,
      });
    })
    .catch (err => {
      console.log (err);
    });
};

exports.postEditProduct = (req, res, next) => {
  const {productId, title, price, description} = req.body;
  const image = req.file;
  const imageUrl = image.path;
  const errors = validationResult (req);
  // console.log (errors);
  if (!errors.isEmpty ()) {
    return res.render ('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/edit-product',
      editingMode: true,
      prod: {
        _id: productId,
      },
      isAuthenticated: req.session.isLoggedIn,
      errorMessage: errors.array ()[0].msg,
      validationErrors: errors.array ()[0].param,
      oldInputs: {
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description,
      },
    });
  }
  Product.findById (productId)
    .then (product => {
      product.title = title;
      product.imageUrl = imageUrl;
      product.price = price;
      product.description = description;
      return product.save ();
    })
    .then (result => {
      res.redirect ('/admin/admin-product');
    })
    .catch (err => {
      console.log (err);
    });
};
