import mongoose from 'mongoose';
import env from './env.js';

export const connectionInfo = {
    host: env.DB_HOST,
    dbName: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASS,
    connectionUrl: `mongodb+srv://${env.DB_USER}:${env.DB_PASS}@${env.DB_HOST}/${env.DB_NAME}`
}

export const PERMISSION_ENUM = {
    USER: 1,
    STAFF: 2,
    ADMIN: 3
};

export const STATE_CART_ENUM = {
    ORDERING: 0,
    CONFIRMED: 1,
    TRANSPORTING: 2,
    DONE: 3,
    CANCEL: 4,
};

export const NUM_TO_CART_STATE = {
    0: STATE_CART_ENUM.ORDERING,
    1: STATE_CART_ENUM.CONFIRMED,
    2: STATE_CART_ENUM.TRANSPORTING,
    3: STATE_CART_ENUM.DONE,
    4: STATE_CART_ENUM.CANCEL,
};

export const NUM_TO_DESCRIPTION = {
    0: 'Chờ xác nhận',
    1: 'Đã xác nhận',
    2: 'Đang giao',
    3: 'Giao thành công',
    4: 'Bị hủy',
};

export function getNewObjectId() {
    return new mongoose.Types.ObjectId();
}

export function toObjectId(objIdStr) {
    return mongoose.Types.ObjectId(objIdStr);
}

export const Schema = mongoose.Schema;
export const ObjectId = mongoose.ObjectId;

const db = mongoose.createConnection(connectionInfo.connectionUrl);

export default db;