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
import ProductModel from './models/product.model.js';
import { ObjectId, getNewObjectId, toObjectId } from './utils/database.js';
import userModel from './models/user.model.js';
import validator from './utils/validator.js';
import { broadcastNotify } from './routes/notification.route.js';
import CategoryModel from './models/category.model.js';
import OrderModel from './models/order.model.js';
import CartModel from './models/cart.model.js';
import Cart from './schema/cartsSchema.js';
import Product from './schema/productsSchema.js';
import NotiModel from './models/notification.model.js';

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




const server = app.listen(port, function () {
    console.log(`Example app listening at http://localhost:${port}`);
});

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

