import { ObjectId, getNewObjectId, toObjectId } from '../utils/database.js';
import Notification from '../schema/notificationsSchema.js';
import { broadcastNotify } from '../routes/notification.route.js';

function getCurDateTime() {
    const date = new Date();
    return date.toLocaleString('tr-TR', {
        timeZone: 'Asia/Ho_Chi_Minh',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
};

async function createNewNoti(userId, message) {
    const newNoti = await this.save(new Notification({
        _id: userId,
        notifications: [
            message,
        ]
    }));
    return newOrder;
}

export default {
    async findById(id) {
        try {
            const order = await Notification.findById({ _id: id }).exec();
            return order;
        }
        catch (err) {
            return null;
        }
    },

    async save(notification) {
        try {
            const ret = await notification.save();
            return ret;
        }
        catch (err) {
            console.log(err.code);
        }
        return null;
    },

    async newNotiAndNotify(userId, title, description) {
        const message = {
            title: title,
            description: description,
            date: getCurDateTime()
        };
        const userNoti = await this.findById(userId);
        if (userNoti === null) {
            await createNewNoti(userId, message);
        }
        else {
            userNoti.notifications.push(message);
            await userNoti.save();
        }

        // notify user
        broadcastNotify(JSON.stringify(message), userId);
    },
}