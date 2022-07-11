import db from '../utils/database.js';
import {Schema} from '../utils/database.js';

const Users = new Schema({
    _id: String,
    name: String,
    addr: String,
    password: String,
    id_permission: Number,
    phone: String,
    provider: String,
}, { versionKey: false });

const User = db.model('users', Users);

export default User;