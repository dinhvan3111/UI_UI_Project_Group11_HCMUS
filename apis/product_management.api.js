import express from 'express';
import ProductModel from '../models/product.model.js';
import Validator from '../utils/validator.js';

const router = express.Router();

router.delete('/:id', async function (req, res) {
    if (!Validator.isValidStr(req.params.id)
        // TODO
    ) {
        return res.json({
            code: 400,
            status: 'Bad Request',
            message: 'Invalid required field'
        });
    }
    return res.json({
        code: 200,
        status: 'OK'
    });
});

export default router;