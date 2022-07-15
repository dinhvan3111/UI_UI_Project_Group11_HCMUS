import db from '../utils/database.js';
import {Schema, ObjectId} from '../utils/database.js';

const Categories = new Schema({
    _id: ObjectId,
    name: String,
    parentId: ObjectId,
    ico: String,
}, { versionKey: false });

const Category = db.model('categories', Categories);

export default Category;