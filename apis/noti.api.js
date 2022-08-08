import express from 'express';
import NotiModel from '../models/notification.model.js';
import Checker from '../utils/validator.js';
import Permission from '../middlewares/permission.mdw.js';

const router = express.Router();

router.get('/', Permission.notLogin, async function (req, res) {
    if (!Checker.isValidNum(req.query.page)) {
        return res.json({
            code: 400,
            message: 'Bad Request',
            status: 'Bad Request'
        });
    }
    const data = await NotiModel.getAllNoti(req.session.passport.user._id, req.query.page);
    console.log(data[0]);
    return res.json({
        code: 200,
        message: 'OK',
        status: 'OK',
        data: data[0]
    });
});

export default router;