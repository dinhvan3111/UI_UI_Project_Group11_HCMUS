import express from 'express';
import CartModel from '../models/cart.model.js';
import ProductModel from '../models/product.model.js';
import Validator from '../utils/validator.js';
import OrderModel from '../models/order.model.js';

const FREE_SHIP_AMMOUNT = 500000;
const router = express.Router();

router.get('/order/detail', async function (req, res) {
    res.render('vwOrder/order_detail');
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
    if(req.body.products !== undefined){
        console.log(req.body);
        const userId = req.session.passport.user._id;
        if (!Validator.isValidOrder(req.body) ||
            !await OrderModel.ordering(userId, req.body)) {
            return res.redirect('/cart');
        }
        return res.redirect('/order-confirm?sucess=true');
    }
});

router.get('/purchased-history', function (req, res) {
    res.render('vwCart/purchase_history');
})

export default router;