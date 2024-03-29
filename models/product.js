const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Product', productSchema);
// const mongodb = require('mongodb');

// const getDb = require('../util/database').getDb;

// module.exports = class Product {
//     constructor(title, imageUrl, description, price, id, userId) {
//         this.title = title;
//         this.imageUrl = imageUrl;
//         this.description = description;
//         this.price = price;
//         this._id = id ? new mongodb.ObjectID(id) : null;
//         this.userId = userId;
//     }

//     save() {
//         const db = getDb();
//         let dbOp;
//         if (this._id) {
//             dbOp = db.collection('products').updateOne({ _id: this._id }, { $set: this });
//         } else {
//             dbOp = db.collection('products').insertOne(this);
//         }

//         return dbOp.then(result => {
//             console.log(result);
//         })
//             .catch(err => {
//                 console.log(err);
//             })
//     }
//     static deleteById(productId) {
//         const db = getDb();
//         return db
//             .collection('products')
//             .deleteOne({ _id: new mongodb.ObjectID(productId) })
//             .then(result => { console.log('DELETED'); })
//             .catch(err => { console.log(err); });
//     }

//     static fetchAll() {
//         const db = getDb();
//         return db
//             .collection('products')
//             .find()
//             .toArray()
//             .then(products => {
//                 return products;
//             })
//             .catch(err => { console.log(err); });
//     }

//     static findById(id) {
//         const db = getDb();
//         return db.collection('products').findOne({ _id: new mongodb.ObjectID(id) }).then(product => {
//             return product;
//         })
//             .catch(err => { console.log(err); });
//     }
// }