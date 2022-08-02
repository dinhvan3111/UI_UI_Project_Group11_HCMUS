import db from '../utils/database.js';
import { Schema, ObjectId } from '../utils/database.js';

export const CartInfos = new Schema({
    _id: ObjectId,  // productId
    price: Number,
    quantity: Number
});

export const CartInfo = db.model('cartinfos', CartInfos);

export const Carts = new Schema({
    _id: String,    // userId
    products: [CartInfos]
}, { versionKey: false });

export const Cart = db.model('carts', Carts);

export default Cart;