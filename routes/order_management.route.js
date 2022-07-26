import express from 'express';

const router = express.Router();

router.get('/management', function(req, res){
    res.render('vwOrder/order_view');
});

export default router;