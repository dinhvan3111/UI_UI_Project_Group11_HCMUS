import { STATE_CART_ENUM, NUM_TO_DESCRIPTION, NUM_TO_CART_STATE } from '../utils/database.js';
import Order from '../schema/orderSchema.js';
import Rating from '../schema/ratingsSchema.js';
import { toObjectId } from '../utils/database.js';
import OrderModel from './order.model.js';

export default {
    async findById(id) {
        try {
            const rating = await Rating.findById({ _id: id }).exec();
            return rating;
        }
        catch (err) {
            return null;
        }
    },

    async findByInfo(userId, productId, orderId) {
        try {
            const rating = await Rating.findOne({ userId: userId, productId: productId, orderId: orderId }).exec();
            return rating;
        }
        catch (err) {
            return null;
        }
    },

    async save(rating) {
        try {
            const ret = await rating.save();
            return ret;
        }
        catch (err) {
            console.log(err.code);
        }
        return null;
    },

    async getMore(productId, page = 0, limit = 5, selections = {}, sort = { '_id': -1 }) {
        if (page < 0) {
            return null;
        }
        const comments = await Rating.paginate({
            productId: productId
        }, {
            page: page,
            limit: limit,
            select: selections
        });
        return comments;
    },

    async rate(userId, productId, orderId, stars, comment) {
        const order = await OrderModel.findOrderByInfo(userId, productId, orderId);
        if (order.orders[0].state !== STATE_CART_ENUM.DONE && order.orders[0].state !== STATE_CART_ENUM.CANCEL) {
            return false;
        }
        const rating = new Rating({
            userId: userId,
            productId: productId,
            orderId: orderId,
            stars: stars,
            comment: comment,
        });
        return await this.save(rating);
    },
}