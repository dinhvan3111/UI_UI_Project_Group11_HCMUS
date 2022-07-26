import express from 'express';
import cartModel from '../models/cart.model.js';
import productModel from '../models/product.model.js';

const router = express.Router();

router.post('/', async function(req, res){
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