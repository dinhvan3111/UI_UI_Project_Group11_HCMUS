import express from 'express';
import productModel from '../models/product.model.js';
import categoryModel from '../models/category.model.js';
import linkManager from '../utils/linkManager.js';

const router = express.Router();

router.get('/', async function (req, res) {
    if (req.query.q === undefined ||
        req.query.q.length === 0) {
        return res.status(404).send('Not Found');
    }
    const productsQuery = await productModel.search(req.query.q,req.query.page * 1 - 1 || 0);
    const products = [];
    for (let i = 0; i < productsQuery.length; i++) {
        const product = productsQuery[i];
        product._id = product._id.toString();
        productModel.delSalePercentAttr(product);
        products.push(product);
    }
    let totalProducts = 0;
    if (products.length !== 0) {
        totalProducts = await productModel.getTotalProductsSearch(req.query.q)
    }
    let totalPages = totalProducts % 10 + 1;
    res.render('vwProduct/search_result', {
        keyword: req.query.q,
        products: products,
        totalProducts: totalProducts,
        totalPages
    });
});

router.get('/search-autocomplete', async function (req, res) {
    const queryStr = req.query.q || '';
    if (queryStr.length < 2) {
        return res.json({
            code: 400,
            status: 'Bad Request',
            message: 'Not enough characters'
        });
    }
    // console.log(queryStr);
    const products = await productModel.searchAutocomplete(queryStr, 8);
    if (products.length > 0) {
        for (let i = 0; i < products.length; i++) {
            products[i].thumb = linkManager.getImgLink(products[i].thumb);
        }
    }
    return res.json({
        code: 200,
        status: 'OK',
        message: 'OK',
        data: products
    });
});

router.get('/:id', async function (req, res) {
    const product = await productModel.findById(req.params.id);
    if (product === null) {
        res.sendStatus(404);
    }
    else {
        const category = await categoryModel.findById(product.id_category.toString());
        const productRet = productModel.toObject(product);

        const relatedProducts = await productModel.getRelatedProducts(productRet._id, productRet.id_category, 5);
        for (let i = 0; i < relatedProducts.length; i++) {
            relatedProducts[i] = productModel.toObject(relatedProducts[i]);
        }

        res.render('vwProduct/product_detail', {
            product: productRet,
            categoryOfProduct: category.toObject(),
            relatedProducts: relatedProducts,
        });
    }
});

export default router;