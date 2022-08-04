import { ObjectId, getNewObjectId, toObjectId, STATE_CART_ENUM, NUM_TO_DESCRIPTION } from '../utils/database.js';
import CartModel from './cart.model.js';
import NotiModel from './notification.model.js';
import { Order, DeliveryInfo } from '../schema/orderSchema.js';
import { CartInfos } from '../schema/cartsSchema.js';
import Validator from '../utils/validator.js';
import Notification from '../schema/notificationsSchema.js';

function newDeliveryInfo(reqBody) {
    return new DeliveryInfo({
        recvDay: reqBody.recvDay || null,
        name: reqBody.name,
        phone: reqBody.phone,
        email: reqBody.email,
        addr: reqBody.address,
    });
};

function newCartInfo(productIdObj, price, quantity) {
    return new CartInfos({
        _id: productIdObj,
        price: price,
        quantity: quantity
    });
};

function newCartInfos(products) {
    const cartInfos = [];
    for (let i = 0; i < products.length; i++) {
        cartInfos.push(newCartInfo(products[i]._id, products[i].price, products[i].quantity));
    }
    return cartInfos;
};

async function createNewOrder(userId, orderInfo) {
    const newOrder = await this.save(new Order({
        _id: userId,
        orders: [
            orderInfo,
        ]
    }));
    return newOrder;
};

async function popProducts(userId, productIds) {
    // let updated = false;
    // const userCart = await CartModel.findById(userId);
    // for (let i = 0; productIds.length > 0 && i < userCart.products.length; i++) {
    //     const productIdInCart = productIds[productIds.length - 1].id;
    //     if (userCart.products[i]._id.toString() === productIdInCart) {
    //         updated = true;
    //         userCart.products.pull({ _id: productIdInCart });
    //     }
    // }
    // if (updated) {
    //     return await userCart.save() !== null;
    // }
    // return true;
    return await CartModel.mmultiRemoveFromCart(userId, productIds);
};

function page2SkipItems(page, limit) {
    // start from 1
    if (page <= 1) {
        return 0;
    }
    return (page * limit) - limit;
};

async function toOrdersPagingQuery(conditions, skip, limit, selections) {
    return await Order.aggregate([
        { '$unwind': '$orders' },
        { '$match': conditions },
        {
            '$facet': {
                'data': [
                    { '$skip': skip },
                    { '$limit': limit },
                    { '$project': selections },
                    { '$sort': { 'orders.state': 1 } },
                ],
                "total": [
                    { "$count": "count" }
                ]
            }
        }
    ]);
};

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

    async findOrderById(userId, orderId) {
        const orders = await Cart.aggregate([
            { '$match': { '_id': userId, 'orders._id': toObjectId(orderId) } },
            {
                "$project": {
                    "orders": {
                        "$filter": {
                            "input": "$orders",
                            "as": "orders",
                            "cond": {
                                "$eq": [
                                    "$$orders._id",
                                    toObjectId(orderId)
                                ]
                            }
                        }
                    }
                }
            }
        ]);
        if (orders.length === 0) {
            return null;
        }
        return orders[0];
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

    async ordering(userId, reqBody) {
        const productIds = [];
        for (let i = 0; i < reqBody.products.length; i++) {
            productIds.push(reqBody.products[i].id);
        }
        // Init user's order
        const order = await add(userId, reqBody, productIds);
        if (order !== null) {
            // pop products from user's cart
            popProducts(userId, productIds);
            // add notification 
            NotiModel.newNotiAndNotify(userId,
                `Đơn hàng ${order.orders[order.orders.length - 1]._id.toString()}`,
                `${NUM_TO_DESCRIPTION[0]}`);
            return order;
        }
        return null;
    },

    async add(userId, reqBody, productIds) {

        const productsInCart = await CartModel.getProductsInCart(userId, productIds);
        if (productsInCart.length < 1) {
            return null;
        }
        const deliveryInfo = newDeliveryInfo(reqBody);
        const cartInfos = newCartInfos(productsInCart[0]);
        const totalPrice = 0;
        const startDay = null;

        const orderInfo = {
            cartInfos: [cartInfos],
            totalPrice: Number,
            state: STATE_CART_ENUM.ORDERING,
            startDay: String,
            paidDay: null,
            voucherId: null,
            deliveryInfo: deliveryInfo,
        }

        let userOrder = await this.findById(userId);
        // user order is not initialized yet
        if (userOrder === null) {
            return await createNewOrder(userId, orderInfo);
        }
        // else user order is initialized already
        userOrder.orders.push(orderInfo);
        const result = await userOrder.save();
        return result;
    },

    // Retrieve all orders of a user
    async getAllOrdersOfUser(userId, page = 0, limit = 10, selections = { 'orders': 1 }) {
        const skip = page2SkipItems(page, limit);
        const conditions = { '_id': userId };
        return await toOrdersPagingQuery(conditions, skip, limit, selections);
    },

    // Retrieve all orders of a user by order status
    async getAllOrdersByStateOfUser(userId, cartState, page = 0, limit = 10, selections = { 'orders': 1 }) {
        const skip = page2SkipItems(page, limit);
        const conditions = { '_id': userId, 'orders.state': cartState };
        return await toOrdersPagingQuery(conditions, skip, limit, selections);
    },

    // Retrieve all orders (for manager/ staff)
    async getAllOrders(page = 0, limit = 10, selections = { '_id': 1, 'orders': 1 }) {
        const skip = page2SkipItems(page, limit);
        const conditions = {};
        return await toOrdersPagingQuery(conditions, skip, limit, selections);
    },

    // Retrive all orders by order status (for manager/ staff)
    async getAllOrdersByState(cartState, page = 0, limit = 10, selections = { '_id': 1, 'orders': 1 }) {
        const skip = page2SkipItems(page, limit);
        const conditions = { 'orders.state': cartState };
        return await toOrdersPagingQuery(conditions, skip, limit, selections);
    },

    async changeState(userIdOrder, orderId, cartState) {
        const cartStateExist = NUM_TO_CART_STATE[`${cartState}`];
        if (cartStateExist) {
            const res = await Order.updateOne(
                {
                    '_id': userIdOrder,
                    'orders._id': orderId
                },
                {
                    '$set': {
                        'orders.$.state': cartState
                    }
                }
            );
            if (res.modifiedCount && res.modifiedCount > 0) {
                return true;
            }
        }
        return false;
    },
}