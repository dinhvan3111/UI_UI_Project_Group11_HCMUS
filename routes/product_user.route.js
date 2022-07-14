import express from 'express';
import productModel from '../models/product.model.js';
import categoryModel from '../models/category.model.js';

const router = express.Router();

router.get('/cart', function(req,res){
    res.render('vwCart/cart');
});

// test detail
router.get('/detail', function(req,res){
    res.render('vwProduct/detail');
});

router.get('/:id', async function(req, res) {
    const product = await productModel.findById(req.params.id);
    if(product === null){
        res.status(404);
    }
    else {
        const category = await categoryModel.findById(product.id_category.toString());
        const productRet = product.toObject();
        productRet.id_category = productRet.id_category.toString();
        productRet._id = productRet._id.toString();
        res.render('vwProduct/product_detail', { 
            product: productRet,
            categoryOfProduct: category.toObject(),
        });
    }
});

export default router;