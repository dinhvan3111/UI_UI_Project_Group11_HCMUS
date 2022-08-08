import { ObjectId, getNewObjectId, toObjectId } from '../utils/database.js';
import Notification from '../schema/notificationsSchema.js';
import { broadcastNotify } from '../routes/notification.route.js';

async function toNotisPagingQuery(conditions, skip, limit, selections, sort) {
    return await Notification.aggregate([
        { '$unwind': '$notifications' },
        { '$match': conditions },
        {
            '$facet': {
                'data': [
                    { '$skip': skip },
                    { '$limit': limit },
                    { '$project': selections },
                    { '$sort': sort },
                ],
                "total": [
                    { "$count": "count" }
                ]
            }
        }
    ]);
};

function page2SkipItems(page, limit) {
    // start from 1
    if (page <= 1) {
        return 0;
    }
    return (page * limit) - limit;
};

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

    async createNewNoti(userId, message) {
        const newNoti = await this.save(new Notification({
            _id: userId,
            notifications: [
                message,
            ]
        }));
        return newNoti;
    },

    async newNotiAndNotify(userId, title, description) {
        const message = {
            title: title,
            description: description,
            date: this.getCurDateTime()
        };
        const userNoti = await this.findById(userId);
        if (userNoti === null) {
            await this.createNewNoti(userId, message);
        }
        else {
            userNoti.notifications.push(message);
            await userNoti.save();
        }

        // notify user
        broadcastNotify(JSON.stringify(message), userId);
    },

    getCurDateTime() {
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
    },

    async getAllNoti(userId, page = 0, limit = 10, selections = { '_id': 0, 'notifications': 1 }, sort = { '_id': -1 }) {
        const skip = page2SkipItems(page, limit);
        const conditions = { '_id': userId };
        return await toNotisPagingQuery(conditions, skip, limit, selections, sort);
    },
}