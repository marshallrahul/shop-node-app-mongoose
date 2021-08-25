const Product = require ('../models/product');
const Order = require ('../models/order');
const shortid = require ('shortid');
const Razorpay = require ('razorpay');

const ITEM_PER_PAGE = 1;

const rzp = new Razorpay ({
  key_id: 'rzp_test_79rZVwxkbhYe9W',
  key_secret: 'SrJYbJ6EFarYpuWiQl3vpJrm',
});

exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;
  Product.find ()
    .countDocuments ()
    .then (numProducts => {
      totalItems = numProducts;
      return Product.find ()
        .skip ((page - 1) * ITEM_PER_PAGE)
        .limit (ITEM_PER_PAGE);
    })
    .then (products => {
      res.render ('shop/index', {
        pageTitle: 'Shop',
        path: '/',
        prods: products,
        isAuthenticated: req.session.isLoggedIn,
        currentPage: page,
        hasNextPage: ITEM_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil (totalItems / ITEM_PER_PAGE),
      });
    })
    .catch (err => console.log (err));
};

exports.getProducts = (req, res, next) => {
  Product.find ()
    .then (products => {
      res.render ('shop/products', {
        pageTitle: 'Products',
        path: '/products',
        prods: products,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch (err => {
      console.log (err);
    });
};

exports.getProductDetails = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById (prodId)
    .then (product => {
      res.render ('shop/product-detail', {
        pageTitle: product.title,
        path: '/products',
        product: product,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch (err => console.log (err));
};

exports.getCarts = (req, res, next) => {
  req.user
    .populate ('cart.items.productData')
    .execPopulate ()
    .then (product => {
      res.render ('shop/cart', {
        pageTitle: 'Cart',
        path: '/cart',
        prods: product.cart.items,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch (err => {
      console.log (err);
    });
};

exports.postCartItem = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById (prodId)
    .then (product => {
      return req.user.addToCart (product);
    })
    .then (result => {
      res.redirect ('/cart');
    })
    .catch (err => {
      console.log (err);
    });
};

exports.deleteCartItem = (req, res, next) => {
  const prodId = req.body.cartId;
  req.user
    .removeFromCart (prodId)
    .then (result => {
      console.log (result);
      res.redirect ('/cart');
    })
    .catch (err => console.log (err));
};

// exports.getOrderItem = (req, res, next) => {
//   Order.find ({userId: req.user._id}).then (order => {
//     console.log (order);
//     res.render ('shop/order', {
//       pageTitle: 'Order',
//       path: '/order',
//       order: order,
//       isAuthenticated: req.session.isLoggedIn,
//     });
//   });
// };

// exports.postOrderItem = (req, res, next) => {
//   const prodId = req.body.orderId;
//   req.user
//     .populate ('cart.items.productData')
//     .execPopulate ()
//     .then (user => {
//       const products = user.cart.items.map (i => {
//         return {productData: {...i.productData}, quantity: i.quantity};
//       });
//       const order = new Order ({
//         products: products,
//         user: {
//           name: req.user.name,
//           userId: req.user._id,
//         },
//       });
//       order.save ();
//     })
//     .then (result => {
//       res.redirect ('/orders');
//     })
//     .then (() => {
//       return req.user.clearFromCart ();
//     })
//     .catch (err => {
//       console.log (err);
//     });
// };

exports.getCheckoutItem = (req, res, next) => {
  req.user
    .populate ('cart.items.productData')
    .execPopulate ()
    .then (product => {
      products = product.cart.items;
      total = 0;
      products.forEach (p => {
        total += p.quantity * p.productData.price;
      });
      const options = {
        amount: parseInt (total * 100),
        currency: 'INR',
        receipt: shortid.generate (),
      };
      rzp.orders
        .create (options)
        .then (order => {
          return res.render ('shop/checkout', {
            pageTitle: 'Checkout',
            path: null,
            prods: product.cart.items,
            isAuthenticated: req.session.isLoggedIn,
            order: order,
          });
        })
        .catch (err => {
          console.log (err);
        });
    })
    .catch (err => {
      console.log (err);
    });
};

exports.checkoutVerification = (req, res, next) => {
  res.write ('SUCCESS');
};
