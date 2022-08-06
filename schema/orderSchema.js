import db from '../utils/database.js';
import { Schema, ObjectId, STATE_CART_ENUM } from '../utils/database.js';
import { CartInfos } from './cartsSchema.js';

export const DeliveryInfos = new Schema({
    recvDay: String,
    name: String,
    phone: String,
    email: String,
    addr: String,
    receiveAt: Number,
}, { versionKey: false, _id: false });


export const Orders = new Schema({
    _id: String, // userId
    orders: [
        {
            cartInfos: [CartInfos],
            totalPrice: Number,
            state: Number,
            startDay: String,
            paidDay: String,
            voucherId: String,
            deliveryInfo: DeliveryInfos,
        }
    ]

}, { versionKey: false });


export const Order = db.model('orders', Orders);
export const DeliveryInfo = db.model('deliveryinfo', DeliveryInfos);
export default Order;