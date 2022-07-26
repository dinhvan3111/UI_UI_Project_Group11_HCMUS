import express from 'express';
import env from '../utils/env.js';
import bucket from '../models/firebase.model.js';
import productModel from '../models/product.model.js';
import multer from 'multer';
const upload = multer({
    storage: multer.memoryStorage(),
});

const cpUpload = upload.fields([
    {name: 'thumb', maxCount: 1},
    {name: 'imgs', maxCount: 5}
]);

function onlyNumbers(str) {
    return /^[0-9.,]+$/.test(str);
}

const router = express.Router();

router.post('/', cpUpload, async function(req, res) {
    // Thieu middleware check permission
    if(!req.files || !req.files.thumb[0] || !req.files.thumb[0].mimetype.includes('image/')){
        res.status(400).send('Error: No thumb found');
    }
    if(!req.files.thumb[0].size >= env.MAX_IMG_SIZE){
        res.status(413).send('Error: Image too large');
    }
    for(let i = 0; i < req.files.imgs.length; i++){
        if(!req.files.imgs[i] || !req.files.imgs[i].mimetype.includes('image/')){
            res.status(400).send('Error: No imgs found');
        }
        if(!req.files.imgs[i].size >= env.MAX_IMG_SIZE){
            res.status(413).send('Error: Image too large');
        }
    }
    if(!req.body.title || req.body.title.length === 0 || 
        !req.body.description || req.body.description.length === 0 ||
        !req.body.price || req.body.price <= 0 || 
        !req.body.sale_price || req.body.sale_price <= 0 || 
        !req.body.stock || req.body.stock <= 0 ||
        !onlyNumbers(req.body.price) || !onlyNumbers(req.body.sale_price) || !onlyNumbers(req.body.stock) ||
        !req.body.id_category || req.body.id_category.length === 0
        ){
            res.status(400).send('Error: Invalid request');
    }
    const isAdded = await productModel.add(req);
    if(isAdded === null) {
        res.status(500).send('Error: Please try again');
    }
    else {
        res.status(200).send('Success' + isAdded);
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

router.get('/management', async function(req, res) {
    const pagingRet = await productModel.getAll();
    const products = [];
    for(let i = 0; i < pagingRet.docs.length; i++) {
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
    res.render('vwProduct/management',{
        products: products,
        totalProducts: pagingRet.totalDocs,
        curPage: pagingRet.page
    });
});

export default router;