import express from 'express';
import productModel from '../models/product.model.js';
import categoryModel from '../models/category.model.js';

const router = express.Router();

router.get('/', function(req, res){
    res.status(200).send('Search not implemented');
});

router.get('/search-autocomplete', async function(req, res) {
    const queryStr = req.query.q || '';
    if(queryStr.length < 2){
        return res.json({
            code: 400,
            status: 'Bad Request',
            message: 'Not enough characters'
        });
    }
    console.log(queryStr);
    const products = await productModel.searchAutocomplete(queryStr, 10);
    return res.json({
        code: 200,
        status: 'OK',
        message: 'OK',
        data: products
    });
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