import express from 'express';
import userModel from '../models/user.model.js';

const router = express.Router();

router.post('/email', async function (req, res){
    if(req.body.email === undefined || 
        req.body.email.length === 0) {
            return res.json({
                status: 'Bad Request',
                code: 400,
                message: 'Missing field'
            });
    }
    const user = await userModel.findById(req.body.email);
    return res.json({
        status: 'OK',
        code: 200,
        message: 'OK',
        data: user !== null
    });
});

export default router;