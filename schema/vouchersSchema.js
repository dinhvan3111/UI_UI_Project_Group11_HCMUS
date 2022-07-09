import db from '../utils/database.js';
import {Schema} from '../utils/database.js';

const Vouchers = new Schema({
    _id: String,
    name: String,
    productId: Number,
    categoryId: Number,
    description: String,
    discount: Number,
    maxDiscount: Number,
    stock: Number,
}, { versionKey: false });

const Voucher = db.model('vouchers', Vouchers);

export default Voucher;