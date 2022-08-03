import sessionMdw from './middlewares/session.mdw.js';
import express from 'express';
import morgan from 'morgan';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import viewMdw from './middlewares/view.mdw.js';
import routeMdw from './middlewares/routes.mdw.js';
import env from './utils/env.js';
import localsMdw from './middlewares/locals.mdw.js';
import WebSocket from './websocket.js';
import productModel from './models/product.model.js';
import { ObjectId, getNewObjectId, toObjectId } from './utils/database.js';
import userModel from './models/user.model.js';
import validator from './utils/validator.js';
import { broadcastNotify } from './routes/notification.route.js';
import CategoryModel from './models/category.model.js';
import OrderModel from './models/order.model.js';
import CartModel from './models/cart.model.js';
import Cart from './schema/cartsSchema.js';
import Product from './schema/productsSchema.js';

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

// const res = await Cart.aggregate([

//     { '$unwind': '$products' },
//     { '$match': { '_id': 'vutuanhaigk123@gmail.com', 'products.quantity': { '$gt': 0 } } },
//     {
//         '$facet': {
//             'data': [
//                 { '$skip': 0 },
//                 { '$limit': 3 },
//                 { '$project': { '_id': 1, 'products': 1 } },
//                 { '$sort': { 'products.price': -1 } },
//             ],
//             "total": [
//                 { "$count": "count" }
//             ]
//         }
//     }
// ]);
// console.log(res[0].data);


// WebSocket(server);


// setInterval(function () {
//     const jsonResp = {
//         total: 10,
//         id: '111111',
//         description: 'This is a test notification',
//     }
//     console.log('do notify');
//     broadcastNotify(JSON.stringify(jsonResp));
// }, 10 * 1000);

