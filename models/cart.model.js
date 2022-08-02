import { ObjectId, getNewObjectId, toObjectId } from '../utils/database.js';
import env from '../utils/env.js';
import { Cart, CartInfo, CartsState } from '../schema/cartsSchema.js';

async function createNewCart(userId, productId, price, quantity) {
    userCart = await this.save(new Cart({
        _id: userId,
        products: [
            new CartInfo({
                _id: productId,
                price: price,
                quantity: quantity
            }),
        ]
    }));
    if (userCart === null) {
        return false;
    }
    return true;
}

export default {
    async findById(id) {
        return await Cart.findById({ _id: id }).exec();
    },

    async save(cart) {
        try {
            const ret = await cart.save();
            return ret;
        }
        catch (err) {
            console.log(err.code);
        }
        return null;
    },

    async getAll() {
        return await Cart.find({}).exec();

    },

    async addToCart(userId, product, quantity) {
        let userCart = await this.findById(userId);
        if (userCart === null) {
            // Create a doc for this user in cart schema
            return await this.createNewCart(userId, product._id, product.sale_price, quantity);
        }
        const res = await this.findByFilter({
            "_id": userId,
            "products._id": product._id.toString()
        });
        if (res.length > 0) {
            // product is already in cart of user
            res[0].products.id(product._id.toString()).quantity += quantity;
            return await res[0].save() !== null;
        }
        // product is not in cart of user
        userCart.products.push(
            new CartInfo({
                _id: product._id,
                price: product.sale_price,
                quantity: quantity
            })
        );
        const result = await userCart.save();
        if (result === null) {
            return false;
        }
        return true;
    },

    async findByFilter(filter) {
        return await Cart.find(filter).exec();
    },

    async removeFromCart(userId, productIdStr) {
        const res = await this.findByFilter({
            "_id": userId,
            "products._id": productIdStr
        });
        if (res.length > 0) {
            res[0].products.pull({ _id: productIdStr });
            return await res[0].save() !== null;
        }
        return true;
    },

    async getTotalItems(userIdStr) {
        const userCart = await this.findById(userIdStr);
        if (userCart === null) {
            return 0;
        }
        return userCart.products.length;
    },

    async createNewCart(userId, productId, price, quantity) {
        const userCart = await this.save(new Cart({
            _id: userId,
            products: [
                new CartInfo({
                    _id: productId,
                    price: price,
                    quantity: quantity
                }),
            ]
        }));
        if (userCart === null) {
            return false;
        }
        return true;
    },
}