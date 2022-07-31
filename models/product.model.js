import { ObjectId, getNewObjectId, toObjectId } from '../utils/database.js';
import env from '../utils/env.js';
import uploadModel from '../models/upload.model.js';
import Product from '../schema/productsSchema.js';

function getSearchQuery(queryStr) {
    return {
        index: 'products',
        compound: {
            filter: [{
                autocomplete: {
                    path: "title",
                    query: queryStr
                }
            }],
            must: [{
                autocomplete: {
                    query: queryStr,
                    path: "title",
                    fuzzy: {
                        maxEdits: 2
                    },
                },
            }]
        }
    };
};

export default {
    async findById(id) {
        return await Product.findById({ _id: id }).exec();
    },

    async save(product) {
        try {
            const ret = await product.save();
            return ret;
        }
        catch (err) {
            console.log(err.code);
        }
        return null;
    },

    toObject(product) {
        const productRet = product.toObject();
        if (productRet.id_category) {
            productRet.id_category = productRet.id_category.toString();
        }
        if (productRet.percentSale && productRet.percentSale === 0) {
            delete productRet.percentSale;
        }
        productRet._id = productRet._id.toString();
        return productRet;
    },

    async getRelatedProducts(productId, categoryId, limit) {
        return await Product.find({
            $and: [
                { _id: { $ne: productId } },
                { id_category: categoryId },
            ]
        }).sort({
            percentSale: -1,
            sold: -1,
            created: -1
        }).select({
            _id: 1,
            title: 1,
            percentSale: 1,
            price: 1,
            thumb: 1,
            sale_price: 1,
        }).limit(limit).exec();
    },

    async getTotalProductsSearch(queryStr) {
        const products = await Product.aggregate([
            {
                $search: getSearchQuery(queryStr)
            },
            {
                $project: {
                    _id: 1,
                }
            },
        ]).limit(parseInt(env.TOTAL_SEARCH_RESULTS));
        return products.length;
    },

    async search(queryStr, page = 0) {
        const products = await Product.aggregate([{
            $search: getSearchQuery(queryStr)
        }
        ]).limit(parseInt(env.TOTAL_SEARCH_RESULTS))
            .skip(page * env.TOTAL_PRODUCTS_PER_PAGE)
            .limit(parseInt(env.TOTAL_PRODUCTS_PER_PAGE));
        return products;
    },

    async searchAutocomplete(queryStr, nResults) {
        const products = await Product.aggregate([
            {
                // $search: {
                //     index: 'products',
                //     compound: {
                //         must: [
                //             {
                //                 text: {
                //                     query: queryStr,
                //                     path: 'title',
                //                     fuzzy: {
                //                         maxEdits: 2,
                //                     }
                //                 }
                //             }
                //         ]
                //     }
                // }
                $search: getSearchQuery(queryStr)
            },
            {
                $limit: nResults,
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    thumb: 1,
                }
            }
        ]);
        return products;
    },

    async add(req) {
        // Upload to firebase storage
        const objIdStr = getNewObjectId().toString();
        let imgList = [];
        for (let i = 0; i < req.files.imgs.length; i++) {
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

    async getTopSell(offset, numOfProduct) {
        const products = await Product.find({}).sort({
            sold: -1,
            percentSale: -1,
            created: -1
        })
            .skip(offset)
            .limit(numOfProduct);
        return products;
    },

    async getTopDiscount(offset, numOfProduct) {
        const products = await Product.find({}).sort({ percentSale: -1 })
            .skip(offset)
            .limit(numOfProduct);
        return products;
    },

    async getTopNew(offset, numOfProduct) {
        const products = await Product.find({}).sort({
            created: -1
        })
            .skip(offset)
            .limit(numOfProduct);
        return products;
    },

    async delSalePercentAttr(product) {
        if (product.percentSale === 0) {
            delete product.percentSale;
        }
    },

    async getAll(page = 0, limit = 5, selection = { _id: 1, title: 1, thumb: 1, stock: 1, price: 1, sale_price: 1 }) {
        const products = await Product.paginate({}, {
            page: page,
            limit: limit,
            select: selection
        });
        return products;
    }
}
