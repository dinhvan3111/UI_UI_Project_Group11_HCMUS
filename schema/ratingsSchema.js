import db from '../utils/database.js';
import { Schema, ObjectId } from '../utils/database.js';
import paginate from 'mongoose-paginate-v2';

const Ratings = new Schema({
    userId: String,
    productId: ObjectId,
    orderId: ObjectId,
    stars: Number,
    comment: String,
    date: String,
}, { versionKey: false });

Ratings.plugin(paginate);
const Rating = db.model('ratings', Ratings);

export default Rating;