const express = require ('express');
const {check} = require ('express-validator');

const router = express.Router ();

const adminRoute = require ('../controller/adminController');

router.get ('/add-product', adminRoute.getAddProduct);

router.post (
  '/add-product',
  [
    check ('title')
      .isString ()
      .withMessage ('Must be only alphabetical chars')
      .not ()
      .isEmpty ()
      .withMessage ('Please enter a title')
      .trim (),
    // check ('imageUrl')
    //   .not ()
    //   .isEmpty ()
    //   .withMessage ('Please upload a image url'),
    check ('price')
      .not ()
      .isEmpty ()
      .withMessage ('Must be only numeric chars')
      .trim (),
    check ('description')
      .isString ()
      .withMessage ('Must be only alphabetical chars')
      .not ()
      .isEmpty ()
      .withMessage ('Please provide description')
      .trim (),
  ],
  adminRoute.postAddProduct
);

router.get ('/admin-product', adminRoute.getAdminProduct);

router.get ('/edit-product/:productId', adminRoute.getEditProduct);

router.post (
  '/edit-product',
  [
    check ('title')
      .isString ()
      .withMessage ('Must be only alphabetical chars')
      .not ()
      .isEmpty ()
      .withMessage ('Please enter a title')
      .trim (),
    // check ('image').not ().isEmpty ().withMessage ('Please upload a image'),
    check ('price')
      .not ()
      .isEmpty ()
      .withMessage ('Must be only numeric chars')
      .trim (),
    check ('description')
      .isString ()
      .withMessage ('Must be only alphabetical chars')
      .not ()
      .isEmpty ()
      .withMessage ('Please provide description')
      .trim (),
  ],
  adminRoute.postEditProduct
);

router.post ('/delete', adminRoute.postDeleteProduct);

module.exports = router;
