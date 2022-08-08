import express from 'express';
import OrderModel from '../models/order.model.js';
import { STATE_CART_ENUM } from '../utils/database.js';
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
    // console.log(orders, '\n', total);

    return res.render('vwOrder/order_view', {
        orders: orders,
        total: total
    });

});

export default router;