import {ObjectId, getNewObjectId, toObjectId} from '../utils/database.js';
import env from '../utils/env.js';
import uploadModel from '../models/upload.model.js';
import Product from '../schema/productsSchema.js';

export default {
    async findById(id) {
        return await Product.findById({_id: id}).exec();
    },

    async save(product){
        try{
            const ret = await product.save();
            return ret;
        }
        catch(err) {
            console.log(err.code);
        }
        return null;
    },

    async search(queryStr, page = 0){
        const products = await Product.find({
            '$search': {
              'index': 'products',
              'text': {
                'query': queryStr,
              }
            }
          })
            .limit(env.TOTAL_SEARCH_RESULTS)
            .skip(page * env.TOTAL_PRODUCTS_PER_PAGE)
            .limit(env.TOTAL_PRODUCTS_PER_PAGE);
        return products;
    },

    async add(req){
        // Upload to firebase storage
        const objIdStr = getNewObjectId().toString();
        let imgList = [];
        for(let i = 0; i < req.files.imgs.length; i++) {
            const path = objIdStr + '/' + req.files.imgs[i].originalname;
            imgList.push(path);
            uploadModel.uploadFile(req.files.imgs[i], path);
        }
        let imgsInfo = {
            thumb: objIdStr + '/thumb/' + req.files.thumb[0].originalname,
            imgs: imgList
        }
        uploadModel.uploadFile(req.files.thumb[0], imgsInfo.thumb);

        const percentSale = Math.round(((req.body.price - req.body.sale_price) / 
                                    req.body.price) * 100);

        // create new Product
        const product = new Product({
            _id: toObjectId(objIdStr),
            title: req.body.title,
            description: req.body.description,
            id_category: toObjectId(req.body.id_category),
            price: req.body.price,
            stock: req.body.stock,
            sale_price: req.body.sale_price,
            thumb: imgsInfo.thumb,
            imgs: imgsInfo.imgs,
            sold: 0,
            waranty: req.body.waranty || '',
            percentSale: percentSale
        });

        return await this.save(product);
    },
    
    async getTopSell(offset, numOfProduct){
        const products = await Product.find({}).sort({
            sold: -1,
            percentSale: -1,
            created: -1
        })
            .skip(offset)
            .limit(numOfProduct);
        return products;
    },

    async getTopDiscount(offset, numOfProduct){
        const products = await Product.find({}).sort({percentSale: -1})
            .skip(offset)
            .limit(numOfProduct);
        return products;
    },

    async getTopNew(offset, numOfProduct){
        const products = await Product.find({}).sort({
            created: -1
        })
            .skip(offset)
            .limit(numOfProduct);
        return products;
    }
}
