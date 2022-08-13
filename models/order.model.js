import { ObjectId, getNewObjectId, toObjectId, STATE_CART_ENUM, NUM_TO_DESCRIPTION, NUM_TO_CART_STATE } from '../utils/database.js';
import CartModel from './cart.model.js';
import NotiModel from './notification.model.js';
import { Order, DeliveryInfo } from '../schema/orderSchema.js';
import { CartInfo } from '../schema/cartsSchema.js';
import Validator from '../utils/validator.js';
import ProductModel from './product.model.js';
import Notification from '../schema/notificationsSchema.js';
import env from '../utils/env.js';

const RECEIVE_AT_HOME = 0;
const RECEIVE_AT_SHOP = 1;

function newDeliveryInfo(reqBody, defaultEmail) {
    return new DeliveryInfo({
        recvDay: reqBody.recvDay || null,
        name: reqBody.name,
        phone: reqBody.phone,
        email: reqBody.email || defaultEmail,
        addr: reqBody.address,
        receiveAt: parseInt(reqBody.receiveAt)
    });
};

function newCartInfo(productIdObj, price, quantity) {
    return new CartInfo({
        _id: productIdObj,
        price: price,
        quantity: quantity
    });
};

function newCartInfos(products) {
    const cartInfos = [];
    for (let i = 0; i < products.length; i++) {
        const orderInCart = newCartInfo(products[i]._id, products[i].price, products[i].quantity);
        console.log('orderInCart:', orderInCart);
        cartInfos.push(orderInCart);
    }
    console.log('cartInfos:', cartInfos);
    return cartInfos;
};

function sumPrice(products) {
    let price = 0;
    for (let i = 0; i < products.length; i++) {
        price += products[i].price;
    }
    return price;
}

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

async function toOrdersPagingQuery(conditions, skip, limit, selections, sort) {
    return await Order.aggregate([
        { '$unwind': '$orders' },
        { '$match': conditions },
        { '$sort': sort },
        {
            '$facet': {
                'data': [
                    { '$skip': skip },
                    { '$limit': limit },
                    // { '$project': selections },
                ],
                "total": [
                    { "$count": "count" }
                ]
            }
        }
    ]);
};

// async function toUserOrdersPagingQuery(conditions, skip, limit, selections, sort) {
//     return await Order.aggregate([
//         { '$unwind': '$orders' },
//         { '$match': conditions },
//         { '$sort': sort },
//         {
//             '$facet': {
//                 'data': [
//                     { '$skip': skip },
//                     { '$limit': limit },
//                     { '$project': selections },
//                 ],
//                 "total": [
//                     { "$count": "count" }
//                 ]
//             }
//         }
//     ]);
// };

export default {
    RECEIVE_AT_HOME,
    RECEIVE_AT_SHOP,

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
        const orders = await Order.aggregate([
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

    async findOrderByInfo(userId, productId, orderId) {
        const orders = await Order.aggregate([
            { '$match': { '_id': userId, 'orders._id': toObjectId(orderId), 'orders.cartInfos._id': toObjectId(productId) } },
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
        const quantities = {};
        for (let i = 0; i < reqBody.products.length; i++) {
            productIds.push(reqBody.products[i].id);
            quantities[`${reqBody.products[i].id}`] = parseInt(reqBody.products[i].quantity);
        }
        // Init user's order
        const order = await this.add(userId, reqBody, productIds, quantities);
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

    async add(userId, reqBody, productIds, quantities) {

        const productsInCart = await CartModel.getProductsInCart(userId, productIds);
        if (productsInCart.length < 1) {
            return null;
        }
        for (let i = 0; i < productsInCart[0].length; i++) {
            productsInCart[0].quantity = quantities[`${productsInCart[0].id}`];
        }
        const deliveryInfo = newDeliveryInfo(reqBody, userId);
        const cartInfos = newCartInfos(productsInCart[0].products);
        let totalPrice = sumPrice(productsInCart[0].products);
        const startDay = NotiModel.getCurDateTime();
        const orderInfo = {
            cartInfos: cartInfos,
            totalPrice: totalPrice,
            state: STATE_CART_ENUM.ORDERING,
            startDay: startDay,
            paidDay: null,
            voucherId: null,
            deliveryInfo: deliveryInfo,
        }

        let userOrder = await this.findById(userId);
        // user order is not initialized yet
        if (userOrder === null) {
            return await this.createNewOrder(userId, orderInfo);
        }
        // else user order is initialized already
        userOrder.orders.push(orderInfo);
        const result = await userOrder.save();
        return result;
    },

    async createNewOrder(userId, orderInfo) {
        const newOrder = await this.save(new Order({
            _id: userId,
            orders: [
                orderInfo,
            ]
        }));
        return newOrder;
    },

    // Retrieve all orders of a user
    async getAllOrdersOfUser(userId, page = 0, limit = env.TOTAL_SEARCH_RESULTS * 1, selections = { '_id': 0, 'orders': 1 }, sort = { 'orders.state': 1, 'orders._id': -1 }) {
        const skip = page2SkipItems(page, limit);
        const conditions = { '_id': userId };
        return await toOrdersPagingQuery(conditions, skip, limit, selections, sort);
    },

    // Retrieve all orders of a user by order status
    async getAllOrdersByStateOfUser(userId, cartState, page = 0, limit = env.TOTAL_SEARCH_RESULTS,
        selections = { '_id': 0, 'orders': { '$filter': { 'input': '$orders', 'as': 'orders', 'cond': { '$eq': ['$$orders.state', cartState] } } } },
        sort = { 'orders.state': 1, 'orders._id': -1 }) {
        const skip = page2SkipItems(page, limit);
        const conditions = { '_id': userId, 'orders.state': cartState };
        return await toOrdersPagingQuery(conditions, skip, limit, selections, sort);
    },

    // Retrieve all orders (for manager/ staff)
    async getAllOrders(page = 0, limit = env.TOTAL_SEARCH_RESULTS, selections = { '_id': 1, 'orders': 1 }, sort = { 'orders.state': 1, 'orders._id': 1 }) {
        const skip = page2SkipItems(page, limit);
        const conditions = {};
        return await toOrdersPagingQuery(conditions, skip, limit, selections, sort);
    },

    // Retrive all orders by order status (for manager/ staff)
    async getAllOrdersByState(cartState, page = 0, limit = env.TOTAL_SEARCH_RESULTS, selections = { '_id': 1, 'orders': 1 }, sort = { 'orders.state': 1, 'orders._id': 1 }) {
        const skip = page2SkipItems(page, limit);
        const conditions = { 'orders.state': cartState };
        return await toOrdersPagingQuery(conditions, skip, limit, selections, sort);
    },

    async changeState(userIdOrder, orderId, cartState) {
        const cartStateExist = NUM_TO_CART_STATE[`${cartState}`];
        console.log('cart state:' ,cartState)
        console.log('cartstateexist' ,cartStateExist);
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
            console.log('order.model.js:330');
            if (res.modifiedCount && res.modifiedCount > 0) {
                NotiModel.newNotiAndNotify(userIdOrder,
                    `Đơn hàng ${orderId}`,
                    `${cartStateExist}`);
                return true;
            }
        }
        return false;
    },

    async toNextState(userIdOrder, orderId) {

        const order = await this.findOrderById(userIdOrder, orderId);
        console.log(order);
        if (order && order.orders[0].state < STATE_CART_ENUM.DONE) {
            const res = await this.changeState(userIdOrder, orderId, order.orders[0].state + 1);
            console.log('res', res);
            if (res && order.orders[0].state + 1 === STATE_CART_ENUM.DONE) {
                const productIds = [];
                for (let i = 0; i < order.orders[0].cartInfos.length; i++) {
                    productIds.push(order.orders[0].cartInfos[i]._id.toString());
                }
                ProductModel.incSold(productIds);
            }
            return res;
        }
        return false;
    },

    async cancelOrder(userIdOrder, orderId) {

        const order = await this.findOrderById(userIdOrder, orderId);
        if (order && order.orders[0].state < STATE_CART_ENUM.DONE) {
            const res = await this.changeState(userIdOrder, orderId, STATE_CART_ENUM.CANCEL);
            return res;
        }
        return false;
    },

    async getSingleOrderInfo(order) {
        const productIds = [];
        order.orders[0]._id = order.orders[0]._id.toString();
        for (let i = 0; i < order.orders[0].cartInfos.length; i++) {
            order.orders[0].cartInfos[i]._id = order.orders[0].cartInfos[i]._id.toString();
            productIds.push(order.orders[0].cartInfos[i]._id);
        }
        const products = await ProductModel.multiGet(productIds, { thumb: 1, title: 1 });
        console.log(products);
        for (let i = 0; i < order.orders[0].cartInfos.length; i++) {
            order.orders[0].cartInfos[i].thumb = products[`${order.orders[0].cartInfos[i]._id}`].thumb;
            order.orders[0].cartInfos[i].title = products[`${order.orders[0].cartInfos[i]._id}`].title;
        }
        return order.orders[0];
    },

    async getMultiOrderInfo(ordersRet) {
        const productIds = [];
        const orders = [];
        // console.log(ordersRet[0].data[0].orders);
        for (let i = 0; i < ordersRet[0].data.length; i++) {
            let order = ordersRet[0].data[i].orders;
            order._id = order._id.toString();
            for (let j = 0; j < ordersRet[0].data[i].orders.cartInfos.length; j++) {

                order.cartInfos[j]._id = order.cartInfos[j]._id.toString();
                if (!productIds.includes(order.cartInfos[j]._id)) {
                    productIds.push(order.cartInfos[j]._id);
                }
            }
            orders.push(order);
        }
        // for (let i = 0; i < ordersRet[0].data[0].orders.length; i++) {
        //     let order = null;
        //     for (let j = 0; j < ordersRet[0].data[0].orders[i].cartInfos.length; j++) {
        //         order = ordersRet[0].data[0].orders[i];
        //         order._id = order._id.toString();
        //         order.cartInfos[j]._id = order.cartInfos[j]._id.toString();

        //         if (!productIds.includes(order.cartInfos[j]._id)) {
        //             productIds.push(order.cartInfos[j]._id);
        //         }
        //     }
        //     orders.push(order);
        // }

        const products = await ProductModel.multiGet(productIds, { thumb: 1, title: 1 });
        // console.log('order.model.js:341 ', products);

        for (let i = 0; i < orders.length; i++) {
            for (let j = 0; j < orders[i].cartInfos.length; j++) {
                orders[i].cartInfos[j].thumb = products[`${orders[i].cartInfos[j]._id}`].thumb;
                orders[i].cartInfos[j].title = products[`${orders[i].cartInfos[j]._id}`].title;
            }
        }
        // console.log(orders);
        return orders;
    }
}