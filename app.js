import sessionMdw from './middlewares/session.mdw.js';
import express from 'express';
import morgan from 'morgan';
import {dirname} from 'path';
import {fileURLToPath} from 'url';
import viewMdw from './middlewares/view.mdw.js';
import routeMdw from './middlewares/routes.mdw.js';
import {engine} from 'express-handlebars';
import {MongoClient} from 'mongodb';
import Product from './schema/productsSchema.js';
import User from './schema/usersSchema.js';
import {Cart, CartsState, CartState} from './schema/cartsSchema.js';
import Category from './schema/categoriesSchema.js';
import env from './utils/env.js';
import { PERMISSION_ENUM, STATE_CART_ENUM } from './utils/database.js';
import UserModel from './models/user.model.js';
import storageBucket from './models/firebase.model.js';
import admin from 'firebase-admin';
// import certificate from './cert/bestgear-355409-dc7563e333b8.json' assert {type: "json"};;
import {getNewObjectId} from './utils/database.js';
import productModel from './models/product.model.js';

// const file = await storageBucket.file('a.jpeg').delete();
// console.log(getNewObjectId());
// const productId = getNewObjectId().toString();
// const product = new Product({
//     _id: productId,
//     title: 'test product is available',
//     description: 'test product has test description',
//     price: 100000,
//     stock: 100,
//     id_category: null,
//     sale_price: 10000,
//     thumb: 'fake link',
//     imgs: [
//         'fake link',
//         'fake url',
//     ]
// });
// console.log(await product.save());

// console.log(await productModel.search('this', 0));

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

// const category = new Category({
//     _id: getNewObjectId(),
//     name: 'Category Test',
//     parentId: null
// });
// category.save(function (err, result) {
//     if(!err){
//         console.log(result);
//     }
// });

// const dbClient = new MongoClient(urlConnection);
// const dbName = 'qlbh';
// await dbClient.connect();
// const db = dbClient.db(dbName);
// const collection = db.collection('user');
// const filteredDocs = await collection.find({ name: 'Tên' }).toArray();
// console.log('Found documents filtered =>', filteredDocs);

// const insertResult = await collection.insertMany([{ _id: 1, name: 'tên1' }, { _id: 2, name: 'tên2' }, { _id: 3, name: 'tên3' }]);
// console.log('Inserted documents =>', insertResult);

// const product = new Product({
//     title: 'Test Product',
//     description: 'This is a test product',
//     price : 100000,
//     stock : 10,
//     id_category : 10,
//     sale_price : 10000,
// });
// product.save(function (err) {
//     if (!err) {
//         return console.log('Product saved successfully');
//     }
// });
// console.log(await product.save());


// const user = new User({
//     name: 'John Doe',
//     _id: 'john@example.com',
//     password: 'password',
//     addr: 'Address',
//     id_permission: PERMISSION_ENUM.USER
// });
// let id = undefined;
// try{
//     const ret = await user.save();
//     console.log(ret);
// }
// catch(err) {
//     console.log(err.code);
// }

// const cart = new Cart({
//     userId: 0,
//     productId: 0,
//     price: 100000,
//     quantity: 10,
// });

// cart.save(function (err, result) {
//     if (!err) {
//         console.log('Cart saved successfully\n', result.id);
//     }
//     else{
//         console.log(err);
//     }
// });

// const cartState = new CartState({
//     cartInfo: cart,
//     totalPrice: 100000,
//     state: STATE_CART_ENUM.PROCESSING,
//     startDay: '11/11/2001',
//     paidDay: '11/11/2001',
//     recvDay: '11/11/2001',
//     voucherId: 0,
// });

// cartState.save( function (err, result){
//     if (!err) {
//         console.log(result.id);
//     }
// });


// const fromDb = await CartState.findOne({_id: '62c30a212fa8fbc60278ecf0'}).exec();
// console.log(fromDb._id);


// await UserModel.findById('john@example.com');
// console.log(env.STORAGE_CERT_NAME);

// storageBucket.file('a.jpeg').getMetadata().then(results => {
//     console.log(results[0]);
// }).catch(err => {
//     console.log(err);
// });

app.use(morgan('dev'))
app.use(express.static(__dirname + '/public'));


const port = env.PORT;

sessionMdw(app);
viewMdw(app);
routeMdw(app);

app.get('/', (req, res) => {
    res.render('home');
});

app.listen(port, function (){
    console.log(`Example app listening at http://localhost:${port}`)
})