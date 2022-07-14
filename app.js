import sessionMdw from './middlewares/session.mdw.js';
import express from 'express';
import morgan from 'morgan';
import {dirname} from 'path';
import {fileURLToPath} from 'url';
import viewMdw from './middlewares/view.mdw.js';
import routeMdw from './middlewares/routes.mdw.js';
import env from './utils/env.js';
import localsMdw from './middlewares/locals.mdw.js';
import productModel from './models/product.model.js';
import {ObjectId, getNewObjectId, toObjectId} from './utils/database.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
console.log(__dirname);
const app = express();


app.use(morgan('dev'))
app.use(express.static(__dirname + '/public'));


const port = env.PORT;

sessionMdw(app);
viewMdw(app);
localsMdw(app);
routeMdw(app);
// console.log(await productModel.getTopNew(0, 6));
// console.log(await cartModel.removeFromCart("vutuanhaigk123@gmail.com", "62cdfef382ee775bec00778a"));
// const product = new Product({
//     _id: getNewObjectId(),
//     title: 'req.body.title',
//     description: 'req.body.description',
//     id_category: toObjectId('62cd843c62264f6314c6cf15'),
//     price: 100000,
//     stock: 100,
//     sale_price: 50000,
//     thumb: 'imgsInfo.thumb',
//     imgs: ['imgsInfo.imgs'],
//     sold: 0,
//     waranty: '',
//     percentSale: 50,
//     created: Date.now()
// });
// console.log(Date.now());
// console.log(await product.save());


app.listen(port, function (){
    console.log(`Example app listening at http://localhost:${port}`)
})