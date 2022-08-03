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
    let updated = false;
    const userCart = await CartModel.findById(userId);
    for (let i = 0; productIds.length > 0 && i < userCart.products.length; i++) {
        const productIdInCart = productIds[productIds.length - 1].id;
        if (userCart.products[i]._id.toString() === productIdInCart) {
            updated = true;
            userCart.products.pull({ _id: productIdInCart });
        }
    }
    if (updated) {
        return await userCart.save() !== null;
    }
    return true;
}

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
}