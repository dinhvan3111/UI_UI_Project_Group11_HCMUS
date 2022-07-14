import express from 'express';
import cartModel from '../models/cart.model.js';
import productModel from '../models/product.model.js';

const FREE_SHIP_AMMOUNT = 500000;
const router = express.Router();

router.get('/cart', async function(req,res){
    const cart = await cartModel.findById(req.session.passport.user._id);
    const products = [];
    let totalPrice = 0;
    let cartRet = {};
    if(cart !== null){
        for (let i = 0; i < cart.products.length; i++) {
            const product = await productModel.findById(cart.products[i]._id);
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
    if(cartRet.totalPrice < FREE_SHIP_AMMOUNT && totalPrice > 0){
        shipPrice = 30000;
    }
    cartRet.finalPrice = cartRet.totalPrice + shipPrice;
    cartRet.shipPrice = shipPrice;
    res.render('vwCart/cart', {
        cart: cartRet
    });
});

router.post('/api/cart', async function(req, res){
    if(req.body.productId === undefined || 
        req.body.productId === null ||
        req.body.productId.length === 0 ||
        req.body.quantity === undefined ||
        req.body.quantity === null ||
        req.body.quantity.length === 0 ||
        /^[0-9]+$/.test(req.body.quantity) === false){
        res.json({
            code: 422,
            status: 'Unprocessable Entity',
            message: 'Missing field'
        });
        return;
    }
    const product = await productModel.findById(req.body.productId);
    if(product === null){
        res.json({
            code: 400,
            status: 'Bad Request',
            message: 'Product Id not found'
        });
    }
    const result = await cartModel.addToCart(
        req.session.passport.user._id, 
        product,
        parseInt(req.body.quantity));
    if(result === true){
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

export default router;