import db from '../utils/database.js';
import { Schema, ObjectId, STATE_CART_ENUM } from '../utils/database.js';
import { CartInfos } from './cartsSchema.js';

export const DeliveryInfo = new Schema({
    recvDay: String,
    name: String,
    phone: String,
    email: String,
    addr: String,
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
            deliveryInfo: DeliveryInfo,
        }
    ]

}, { versionKey: false });


const Order = db.model('orders', Orders);
export default Order;