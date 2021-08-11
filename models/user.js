const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [{ productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true }, quantity: { type: Number, required: true } }]
    }
});

userSchema.methods.addToCart = function (product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.productId.toString() == product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
    if (cartProductIndex >= 0) {
        updatedCartItems[cartProductIndex].quantity++;
    } else {
        updatedCartItems.push({ productId: product._id, quantity: newQuantity });
    }
    const updatedCart = { items: updatedCartItems };
    this.cart = updatedCart;
    return this.save();
}

userSchema.methods.removeFromCart = function (prodId, reduce) {
    if (reduce) {
        let updatedCartItems = this.cart.items;
        for (let i = 0; i < updatedCartItems.length; i++) {
            console.log(prodId.toString());
            if (updatedCartItems[i].productId.toString() === prodId.toString() && updatedCartItems[i].quantity > 1) {
                updatedCartItems[i].quantity -= 1;
                this.cart.items = updatedCartItems;
                console.log('reduced');
                return this.save();
            }
        }
    }
    const updatedCartItems = this.cart.items.filter(item => {
        return prodId.toString() !== item.productId.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save();
}

userSchema.methods.clearCart = function () {
    this.cart = { items: [] };
    this.save();
}

module.exports = mongoose.model('User', userSchema);

// const { use, get } = require("../routes/shop");

// const mongodb = require('mongodb');

// const getDb = require('../util/database').getDb;

// module.exports = class User {
//     constructor(username, email, cart, id) {
//         this.username = username;
//         this.email = email;
//         this.cart = cart;
//         this._id = id;
//     }

//     save() {
//         const db = getDb();
//         return db.collection('users').insertOne(this).then(result => {
//             console.log('user saved');
//         }).catch(err => { console.log(err); });
//     }

//     addToCart(product) {
//         const cartProductIndex = this.cart.items.findIndex(cp => {
//             return cp.productId.toString() == product._id.toString();
//         });
//         let newQuantity = 1;
//         const updatedCartItems = [...this.cart.items];
//         if (cartProductIndex >= 0) {
//             updatedCartItems[cartProductIndex].quantity++;
//         } else {
//             updatedCartItems.push({ productId: new mongodb.ObjectID(product._id), quantity: newQuantity });
//         }
//         const updatedCart = { items: updatedCartItems };
//         const db = getDb();
//         return db.collection('users').updateOne(
//             { _id: new mongodb.ObjectID(this._id) },
//             { $set: { cart: updatedCart } }
//         );
//     }

//     getCart() {
//         const db = getDb();
//         const productIds = this.cart.items.map(i => {
//             return i.productId;
//         });
//         return db.collection('products').find({ _id: { $in: productIds } }).toArray()
//             .then(products => {
//                 return products.map(p => {
//                     return { ...p, quantity: this.cart.items.find(i => i.productId.toString() == p._id.toString()).quantity };
//                 });
//             });
//     }

//     deleteProduct(productId, reduceQuantity) {
//         const db = getDb();
//         return db.collection('users').findOne({ _id: new mongodb.ObjectID(this._id) })
//             .then(result => {
//                 const productIndex = result.cart.items.findIndex(p => p.productId.toString() == productId.toString());
//                 let updatedCartItems = result.cart.items;
//                 if (updatedCartItems[productIndex].quantity > 1 && reduceQuantity) {
//                     updatedCartItems[productIndex].quantity--;
//                 } else {
//                     updatedCartItems.splice(productIndex, 1);
//                 }
//                 return db.collection('users').updateOne({ _id: new mongodb.ObjectID(this._id) }, {
//                     $set: { cart: { items: updatedCartItems } }
//                 })
//                     .then(result => {
//                         console.log(result);
//                     }).catch(err => { console.log(err); });
//             });
//     }

//     addOrder() {
//         const db = getDb();
//         return this.getCart().then(products => {
//             const order = {
//                 items: products,
//                 user: {
//                     _id: new mongodb.ObjectID(this._id),
//                     name: this.name
//                 }
//             };
//             return db.collection('orders').insertOne(order);
//         })
//             .then(result => {
//                 this.cart = { items: [] };
//                 return db.collection('users').updateOne({ _id: new mongodb.ObjectID(this._id) }, {
//                     $set: { cart: { items: [] } }
//                 })
//                     .then().catch(err => { console.log(err); });
//             });
//     }

//     static findById(userId) {
//         const db = getDb();
//         return db.collection('users').findOne({ _id: new mongodb.ObjectID(userId) })
//             .then(result => { return result; })
//             .catch(err => {
//                 console.log(err);
//             });
//     }

//     getOrders() {
//         const db = getDb();
//         return db.collection('orders').find({ 'user._id': new mongodb.ObjectID(this._id) }).toArray();
//     }
// }