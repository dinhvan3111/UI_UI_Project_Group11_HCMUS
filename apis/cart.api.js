import express from 'express';
import cartModel from '../models/cart.model.js';
import productModel from '../models/product.model.js';
import Validator from '../utils/validator.js';
import Checker from '../middlewares/permission.mdw.js';
import OrderModel from '../models/order.model.js';

const router = express.Router();

router.delete('/:id', async function (req, res) {
    if (!Validator.isValidStr(req.params.id) ||
        !await cartModel.removeFromCart(req.session.passport.user._id, req.params.id)) {
        return res.json({
            code: 400,
            status: 'Bad Request',
            message: 'Invalid required field'
        });
    }
    return res.json({
        code: 200,
        status: 'OK'
    });
});

router.post('/', Checker.isUser, async function (req, res) {
    if (req.body.productId === undefined ||
        req.body.productId === null ||
        req.body.productId.length === 0 ||
        req.body.quantity === undefined ||
        req.body.quantity === null ||
        req.body.quantity.length === 0 ||
        /^[0-9]+$/.test(req.body.quantity) === false) {
        return res.json({
            code: 422,
            status: 'Unprocessable Entity',
            message: 'Missing field'
        });
    }
    const product = await productModel.findById(req.body.productId);
    if (product === null) {
        return res.json({
            code: 400,
            status: 'Bad Request',
            message: 'Product Id not found'
        });
    }
    const result = await cartModel.addToCart(
        req.session.passport.user._id,
        product,
        parseInt(req.body.quantity));
    if (result === true) {
        const totalInCart = await cartModel.getTotalItems(req.session.passport.user._id);
        return res.json({
            code: 200,
            status: 'OK',
            message: 'Product is added to cart',
            totalInCart: totalInCart
        });
    }
    return res.json({
        code: 400,
        status: 'Bad Request',
        message: 'Failed to add product to cart. Please try again'
    });
});

router.post('/check-out', async function (req, res) {
    console.log(req.body);
    const userId = req.session.passport.user._id;
    console.log(userId);
    let order = null;
    if (!Validator.isValidOrder(req.body) ||
        !(order = await OrderModel.ordering(userId, req.body))) {
        return res.json({
            code: 400,
            status: 'Bad Request',
            message: 'Retry later'
        });
    }
    console.log('order:', order);
    return res.json({
        code: 200,
        status: 'OK',
        message: 'Success',
        data: order.orders[order.orders.length - 1]._id.toString()
    });
});


export default router;