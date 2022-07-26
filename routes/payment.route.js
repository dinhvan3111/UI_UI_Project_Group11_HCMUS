import express from 'express';

const router = express.Router();

router.get('/check-out', function(req,res){
    res.render('vwPayment/check_out');
});

export default router;
