import express from 'express';
import productModel from '../models/product.model.js';
import categoryModel from '../models/category.model.js';

const router = express.Router();

router.get('/:id', async function(req, res) {
    const product = await productModel.findById(req.params.id);
    if(product === null){
        res.status(404);
    }
    else {
        const category = await categoryModel.findById(product.id_category.toString());
        res.render('vwProduct/product_detail', {
            product: product.toObject(),
            categoryOfProduct: category.toObject(),
        });
    }
});

export default router;