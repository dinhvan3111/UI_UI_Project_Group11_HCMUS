import db from '../utils/database.js';
import {Schema, ObjectId} from '../utils/database.js';

const WishLists = new Schema({
    _id: String,    // userId
    productIds: [ObjectId],
}, { versionKey: false });

const WishList = db.model('wishlists', WishLists);

export default WishList;