import express from 'express';
import Checker from '../utils/validator.js';
import RatingModel from '../models/rating.model.js';
import Permission from '../middlewares/permission.mdw.js';

const router = express.Router();

router.get('/', async function (req, res) {
    if (!Checker.isValidStr(req.query.productId) ||
        !Checker.isValidNum(req.query.page)) {
        return res.json({
            code: 400,
            status: 'Bad Request',
            message: 'Bad Request'
        });
    }
    const page = parseInt(req.query.page);
    const rating = await RatingModel.getMore(req.query.productId, page);
    return res.json({
        code: 200,
        status: 'OK',
        message: 'OK',
        data: rating
    });
});

router.post('/:orderId', Permission.notLogin, async function (req, res) {
    const orderId = req.params.orderId;
    const userId = req.session.passport.user._id;
    const productId = req.body.productId;
    let rating = null;
    if (!Checker.isValidStr(orderId) ||
        !Checker.isValidStr(productId) ||
        !Checker.isValidStar(req.body.stars) ||
        !Checker.isValidStr(req.body.comment) ||
        !(rating = await RatingModel.rate(userId, productId, orderId, req.body.stars, req.body.comment))) {
        return res.json({
            code: 400,
            status: 'Bad Request',
            message: 'Bad Request'
        });
    }
    return res.json({
        code: 200,
        status: 'OK',
        message: 'OK',
        data: rating
    });
});

export default router;