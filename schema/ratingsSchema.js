import db from '../utils/database.js';
import {Schema, ObjectId} from '../utils/database.js';

const Ratings = new Schema({
    _id: ObjectId,  // cartInfo attr in CartState Schema
    userId: String,
    productId: Number,
    cartStateId: ObjectId,
    stars: Number,
    comment: String,
    date: String,
}, { versionKey: false });

const Rating = db.model('ratings', Ratings);

export default Rating;