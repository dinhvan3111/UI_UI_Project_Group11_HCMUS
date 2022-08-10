import express from 'express';
import OrderModel from '../models/order.model.js';
import { STATE_CART_ENUM, NUM_TO_DESCRIPTION } from '../utils/database.js';
import Checker from '../utils/validator.js';

const router = express.Router();

router.get('/management', async function (req, res) {
    const page = req.query.page || 1;
    let state = req.query.state || -1;


    let selections = { _id: 1, orders: { _id: 1, totalPrice: 1, state: 1, paidDay: 1 } }
    let ordersRet = null;
    let orders = [];
    let total = 0;
    // All state
    if (state === -1) {
        ordersRet = await OrderModel.getAllOrders(page, 10, selections);
    }
    else {
        if (!Checker.isValidState(state)) {
            return res.redirect('/orders/management');
        }
        state = parseInt(state);
        ordersRet = await OrderModel.getAllOrdersByState(state, page, 10, selections);
    }
    console.log(ordersRet[0].data);
    for (let i = 0; i < ordersRet[0].data.length; i++) {
        const order = ordersRet[0].data[i];
        order.orders._id = ordersRet[0].data[i].orders._id.toString();
        orders.push(order);
    }
    if (ordersRet[0].total.length > 0) {
        total = ordersRet[0].total[0].count;
    }
    else {
        total = 0;
    }

    // Return state description
    let descState = "Tất cả";
    if (state !== -1) {
        descState = NUM_TO_DESCRIPTION[state];
    }
    // console.log(orders, '\n', total, '\n', state);

    return res.render('vwOrder/order_view', {
        orders: orders,
        total: total,
        descState: descState
    });
});

router.post('/management', async function (req, res) {
    let page = req.body.page;
    let state = req.body.state;
    let url = '/orders/management';
    if (Checker.isValidStr(req.body.userId) &&
        Checker.isValidStr(req.body.orderId) &&
        Checker.isValidNum(req.body.type) &&
        (req.body.type === 0 ||
            req.body.type === 1)) {
        if (!Checker.isValidNum(page)) {
            page = 1;
        }
        else {
            url = url + '?page=' + page;
        }
        if (!Checker.isValidOrderState(state)) {
            state = -1;
        }
        else {
            url = url + '?state=' + state;
        }
        if (req.body.type === 0) {
            OrderModel.cancelOrder(req.body.userId, req.body.orderId);
        }
        else {
            OrderModel.toNextState(req.body.userId, req.body.orderId);
        }
    }

    return res.redirect(url);
});

export default router;