import db from '../utils/database.js';
import {Schema, ObjectId, STATE_CART_ENUM} from '../utils/database.js';

export const Carts = new Schema({
    userId: String,
    productId: ObjectId,
    price: Number,
    quantity: Number
}, { versionKey: false });

export const CartsState = new Schema({
    cartInfo: {
        productId: ObjectId,
        price: Number,
        quantity: Number,
    },
    totalPrice: Number,
    state: Number,
    startDay: String,
    paidDay: String,
    recvDay: String,
    voucherId: String,
}, { versionKey: false });


export const Cart = db.model('carts', Carts);
export const CartState = db.model('cartsstate', CartsState);

export default Cart;