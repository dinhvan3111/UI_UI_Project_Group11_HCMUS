import { ObjectId, getNewObjectId, toObjectId, STATE_CART_ENUM } from '../utils/database.js';
import Order from '../schema/orderSchema.js';
import Validator from '../utils/validator.js';

export default {
    async findById(id) {
        try {
            const order = await Order.findById({ _id: id }).exec();
            return order;
        }
        catch (err) {
            return null;
        }
    },

    async save(order) {
        try {
            const ret = await order.save();
            return ret;
        }
        catch (err) {
            console.log(err.code);
        }
        return null;
    },

    async findByState(state) {
        if (!Validator.isValidOrderState(state)) {
            return null;
        }
        const stateNum = parseInt(state);
        return await Order.aggregate([
            {
                "$match": {
                    "orders.state": stateNum
                }
            },
            {
                "$project": {
                    "orders": {
                        "$filter": {
                            "input": "$orders",
                            "as": "orderList",
                            "cond": {
                                "$eq": ["$$orderList.state", stateNum]
                            }
                        }
                    }
                }
            }
        ]);
    },
}