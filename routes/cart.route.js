import express from 'express';
import CartModel from '../models/cart.model.js';
import ProductModel from '../models/product.model.js';
import Validator from '../utils/validator.js';
import OrderModel from '../models/order.model.js';
import { NUM_TO_DESCRIPTION } from '../utils/database.js';

const FREE_SHIP_AMMOUNT = 500000;
const router = express.Router();

router.get('/order/detail/:id', async function (req, res) {
    const userId = req.session.passport.user._id;
    let order = null;
    let orderDetail = null;
    try {
        order = await OrderModel.findOrderById(userId, req.params.id);
    }
    catch (err) {
        order = null;
    }
    if (order !== null) {
        orderDetail = await OrderModel.getSingleOrderInfo(order);
        console.log(orderDetail);
    }
    res.render('vwOrder/order_detail', {
        orderDetail: orderDetail,
    });
});

router.get('/cart', async function (req, res) {
    if (req.session.passport === undefined) {
        return res.redirect('/login');
    }
    const cart = await CartModel.findById(req.session.passport.user._id);
    const products = [];
    let totalPrice = 0;
    let cartRet = {};
    if (cart !== null) {
        for (let i = 0; i < cart.products.length; i++) {
            const product = await ProductModel.findById(cart.products[i]._id);
            const productTemp = product.toObject();
            productTemp.quantity = cart.products[i].quantity;
            productTemp.buy_price = cart.products[i].price;
            totalPrice += (productTemp.buy_price * productTemp.quantity);
            products.push(productTemp);
        }
        cartRet = cart.toObject();

    }

    cartRet.products = products;
    cartRet.totalPrice = totalPrice;
    let shipPrice = 0;
    if (cartRet.totalPrice < FREE_SHIP_AMMOUNT && totalPrice > 0) {
        shipPrice = 30000;
    }
    cartRet.finalPrice = cartRet.totalPrice + shipPrice;
    cartRet.shipPrice = shipPrice;
    res.render('vwCart/cart', {
        cart: cartRet
    });
});

router.post('/cart', async function (req, res) {
    // Post về 2 lần (cái đầu tiên hợp lệ vì có field products) nên phải lấy cái có products
    // if(req.body.products !== undefined){
    console.log(req.body);
    const userId = req.session.passport.user._id;
    if (!Validator.isValidOrder(req.body) ||
        !await OrderModel.ordering(userId, req.body)) {
        return res.redirect('/cart');
    }
    return res.redirect('/order-confirm?sucess=true');
    // }
});
// function getEachOrder(orders){
//     let newOrder = [];
//     let idArr = [];
//     orders.forEach(function(order){
//         if(!idArr.includes(order._id)){
//             idArr.push(order._id);
//         }
//     });
//     idArr.forEach(function(id){
//         let order = [];
//         orders.forEach(function(e){
//             if(e._id === id){
//                 order.push(e);
//             }
//         });
//         newOrder.push(order);
//     });
//     return newOrder;
// }
router.get('/purchased-history', async function (req, res) {
    const page = req.query.page || 1;
    const userId = req.session.passport.user._id;
    let state = req.query.state || -1;

    let orders = [];
    let ordersRet = null;
    if (state === -1) {
        ordersRet = await OrderModel.getAllOrdersOfUser(userId, page);
    }
    else {
        if (!Validator.isValidState(state)) {
            return res.redirect('/purchased-history');
        }
        state = parseInt(state);
        ordersRet = await OrderModel.getAllOrdersByStateOfUser(userId, state, page);
        // console.log('ordersRet: ', ordersRet[0].data[0]);
    }
    if (ordersRet !== null && ordersRet[0].data.length > 0) {
        orders = await OrderModel.getMultiOrderInfo(ordersRet);
    }
    let descState = "Tất cả";
    if(state!==-1){
        descState =  NUM_TO_DESCRIPTION[state];
    }
    console.log(descState);
    res.render('vwCart/purchase_history', {
        orders: orders,
        state: descState
    });
})

export default router;