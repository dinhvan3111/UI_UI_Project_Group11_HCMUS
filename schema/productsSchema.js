import db from '../utils/database.js';
import {Schema, ObjectId} from '../utils/database.js';
import paginate from 'mongoose-paginate-v2';

const Products = new Schema({
    _id: ObjectId,
    title: {type: String, text: true},
    description: {type: String, text: true},
    price: Number,
    stock: Number,
    id_category: ObjectId,
    sale_price: Number,
    thumb: String,
    imgs: [String],
    sold: Number,
    waranty: String,
    percentSale: Number,
    created: Date
    
}, { versionKey: false });

Products.plugin(paginate);

const Product = db.model('products', Products);

export default Product;

