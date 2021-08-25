const express = require ('express');

const router = express.Router ();

const isAuth = require ('../middlewares/is-auth');
const shopController = require ('../controller/shopController');

router.get ('/', shopController.getIndex);

router.get ('/products', shopController.getProducts);

router.get ('/products/:productId', shopController.getProductDetails);

router.get ('/cart', isAuth, shopController.getCarts);

router.post ('/cart', shopController.postCartItem);

router.post ('/delete', shopController.deleteCartItem);

router.get ('/checkout', isAuth, shopController.getCheckoutItem);

router.post ('/checkout/success', shopController.checkoutVerification);

// router.get ('/order', shopController.getOrderItem);

// router.post ('/order', shopController.postOrderItem);

module.exports = router;
