const mongoose = require ('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema ({
  title: {
    type: String,
    require: true,
  },
  imageUrl: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model ('Product', productSchema);

// const {ObjectID} = require ('mongodb');
// const getDb = require ('../utils/database').getDb;

// class Product {
//   constructor (id, title, imageUrl, price, description) {
//     this._id = id;
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.price = price;
//     this.description = description;
//   }

//   save () {
//     const db = getDb ();
//     let dbOp;
//     if (this._id) {
//       dbOp = db.collection ('products').updateOne (
//         {_id: ObjectID (this._id)},
//         {
//           $set: {
//             title: this.title,
//             imageUrl: this.imageUrl,
//             price: this.price,
//             description: this.description,
//           },
//         }
//       );
//     } else {
//       dbOp = db
//         .collection ('products')
//         .insertOne (this)
//         .then (result => {
//           console.log (result);
//         })
//         .catch (err => {
//           console.log (err);
//         });
//     }
//     return dbOp
//       .then (result => {
//         console.log (result);
//       })
//       .catch (err => {
//         console.log (err);
//       });
//   }

//   static fetchAll () {
//     const db = getDb ();
//     return db
//       .collection ('products')
//       .find ()
//       .toArray ()
//       .then (products => {
//         return products;
//       })
//       .catch (err => {
//         console.log (err);
//       });
//   }

//   static findById (prodId) {
//     const db = getDb ();
//     return db
//       .collection ('products')
//       .findOne ({
//         _id: ObjectID (prodId),
//       })
//       .then (product => {
//         return product;
//       })
//       .catch (err => {
//         console.log (err);
//       });
//   }

//   static deleteById (prodId) {
//     const db = getDb ();
//     return db.collection ('products').deleteOne ({
//       _id: ObjectID (prodId),
//     });
//   }
// }

// module.exports = Product;
