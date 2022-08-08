import express from 'express';
import Checker from '../utils/validator.js';
import OrderModel from '../models/order.model.js';

const router = express.Router();

router.get('/check-out', function (req, res) {
    res.render('vwPayment/check_out');
});

router.get('/order-confirm', async function (req, res) {
    let order = null;
    if (!Checker.isValidStr(req.query.id) || !(order = await OrderModel.findOrderById(req.session.passport.user._id, req.query.id))) {
        return res.status(404).send('Not found');
    }
    console.log(order);
    res.render('vwPayment/order_confirm', {
        orderId: order.orders[0]._id.toString(),
    });
});

router.get('/order-failed', function (req, res) {
    res.render('vwPayment/order_failed');
});

export default router;
