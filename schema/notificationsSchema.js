import db from '../utils/database.js';
import { Schema } from '../utils/database.js';

const Notifications = new Schema({
    _id: String, // userId
    notifications: [
        {
            title: String,
            description: String,
            date: String,
        }
    ],
}, { versionKey: false });

const Notification = db.model('notifications', Notifications);

export default Notification;