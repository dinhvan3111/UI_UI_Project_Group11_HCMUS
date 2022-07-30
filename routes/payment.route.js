import express from 'express';

const router = express.Router();

router.get('/check-out', function(req,res){
    res.render('vwPayment/check_out');
});

router.get('/order-confirm', function(req,res){
    res.render('vwPayment/order_confirm');
});

export default router;
