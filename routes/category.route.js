import express from 'express';
import CategoryModel from '../models/category.model.js';
import ProductModel from '../models/product.model.js';
import env from '../utils/env.js';

const router = express.Router();

router.get('/:id', async function (req, res) {
    const category = await CategoryModel.findById(req.params.id);
    if (category === null) {
        res.sendStatus(404);
    }
    else {
        const ret = await ProductModel.getAllInCategory(req.params.id, req.query.page || null);
        const products = ret.docs;
        for (let i = 0; i < products.length; i++) {
            products[i] = ProductModel.toObject(products[i]);
        }
        res.render('vwProduct/search_result', {
            products: products,
            totalProducts: ret.totalDocs,
            totalPages: ret.totalPages,
            category: category.toObject(),
            limit: env.TOTAL_SEARCH_RESULTS,
        });
    }
});

export default router;