import db from '../utils/database.js';
import { Schema, ObjectId, STATE_CART_ENUM } from '../utils/database.js';

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

export const DeliveryInfo = new Schema({
    recvDay: String,
    name: String,
    phone: String,
    email: String,
    addr: String,
}, { versionKey: false, _id: false });

export const CartsState = new Schema({
    _id: String, // userId
    data: [
        {
            cartInfos: [CartInfos],
            totalPrice: Number,
            state: Number,
            startDay: String,
            paidDay: String,
            voucherId: String,
            deliveryInfo: DeliveryInfo,
        }
    ]

}, { versionKey: false });


export const Cart = db.model('carts', Carts);
export const CartState = db.model('cartsstate', CartsState);

export default Cart;