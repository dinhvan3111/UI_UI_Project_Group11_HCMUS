import express from 'express';
import env from '../utils/env.js';
import bucket from '../models/firebase.model.js';
import ProductModel from '../models/product.model.js';
import CategoryModel from '../models/category.model.js';
import multer from 'multer';
import Validator from '../utils/validator.js';
import { request } from 'http';
import { PERMISSION_ENUM } from '../utils/database.js';
import Permission from '../middlewares/permission.mdw.js';


const upload = multer({
    storage: multer.memoryStorage(),
});

const cpUpload = upload.fields([
    { name: 'thumb', maxCount: 1 },
    { name: 'imgs', maxCount: 5 }
]);

function onlyNumbers(str) {
    return /^[0-9.,]+$/.test(str);
}

const router = express.Router();

router.post('/', cpUpload, async function (req, res) {
    // Thieu middleware check permission
    if (!req.files || !req.files.thumb[0] || !req.files.thumb[0].mimetype.includes('image/')) {
        res.status(400).send('Error: No thumb found');
        return;
    }
    if (!req.files.thumb[0].size >= env.MAX_IMG_SIZE) {
        res.status(413).send('Error: Image too large');
        return;
    }
    for (let i = 0; i < req.files.imgs.length; i++) {
        if (!req.files.imgs[i] || !req.files.imgs[i].mimetype.includes('image/')) {
            res.status(400).send('Error: No imgs found');
            return;
        }
        if (!req.files.imgs[i].size >= env.MAX_IMG_SIZE) {
            res.status(413).send('Error: Image too large');
            return;
        }
    }
    if (!req.body.title || req.body.title.length === 0 ||
        !req.body.description || req.body.description.length === 0 ||
        !req.body.price || req.body.price <= 0 ||
        !req.body.sale_price || req.body.sale_price <= 0 ||
        !req.body.stock || req.body.stock <= 0 ||
        !onlyNumbers(req.body.price) || !onlyNumbers(req.body.sale_price) || !onlyNumbers(req.body.stock) ||
        !req.body.id_category || req.body.id_category.length === 0
    ) {
        res.status(400).send('Error: Invalid request');
        return;
    }
    const isAdded = await ProductModel.add(req);
    if (isAdded === null) {
        res.status(500).send('Error: Please try again');
        return;
    }
    else {
        // res.status(200).send('Success' + isAdded);
        res.redirect('/products/management/add-product');
    }
    // const path = getNewObjectId().toString() + '/thumb/' + thumb.originalname;
    // const blob = bucket.file(path);
    // const blobWriter = blob.createWriteStream({
    //     metadata: {
    //         contentType: thumb.mimetype
    //     },
    //     public: true
    // });

    // blobWriter.on('error', err => {
    //     console.log(err);
    //     res.status(500).send('Error: Upload could not be executed');
    // });
    // blobWriter.on('finish', () => {
    //     const mediaLink = `https://storage.googleapis.com/${env.STORAGE_BUCKET}/${path}`;
    //     res.status(200).send('File uploaded ' + mediaLink);
    // });

    // blobWriter.end(thumb.buffer);




});

router.get('/management', Permission.isAdmin, async function (req, res) {
    const page = req.query.page || 1;
    const pagingRet = await ProductModel.getAll(page);
    const products = [];
    console.log(pagingRet);
    for (let i = 0; i < pagingRet.docs.length; i++) {
        const product = {
            _id: pagingRet.docs[i]._id.toString(),
            thumb: pagingRet.docs[i].thumb,
            title: pagingRet.docs[i].title,
            stock: pagingRet.docs[i].stock,
            price: pagingRet.docs[i].price,
            sale_price: pagingRet.docs[i].sale_price,
        };
        products.push(product);
    }
    res.render('vwProduct/management', {
        products: products,
        totalProducts: pagingRet.totalDocs,
        curPage: pagingRet.page,
        limit: env.TOTAL_SEARCH_RESULTS
    });
});

router.get('/management/add-product', Permission.isAdmin, async function (req, res) {
    res.render('vwProduct/add_product', {
        layout: 'main.hbs',
    });
});

router.get('/edit/:id', Permission.isAdmin, async function (req, res) {   
    const product = await ProductModel.findById(req.params.id);
    if (product === null) {
        res.sendStatus(404);
    }
    else {
        const productRet = ProductModel.toObject(product);
        const category = await CategoryModel.findById(productRet.id_category);
        res.render('vwProduct/edit_product', {
            product: productRet,
            category: category.toObject()
        });
    }
});

router.post('/edit/:id', async function (req, res) {
    req.body._id = req.params.id;
    console.log(req.body);
    if (!Validator.isValidStr(req.body.title) ||
        !Validator.isValidStr(req.body.id_category) ||
        !Validator.isValidNum(req.body.price) ||
        !Validator.isValidNum(req.body.sale_price) ||
        !Validator.isValidNum(req.body.stock) ||
        !Validator.isValidStr(req.body.waranty) ||
        !Validator.isValidStr(req.body.description) ||
        !await ProductModel.update(req.body)) {
        return res.redirect(`/products/edit/${req.params.id}`);
    }
    return res.redirect(`/products/${req.params.id}`);
});

export default router;