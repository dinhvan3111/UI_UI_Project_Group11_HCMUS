import express from 'express';

const router = express.Router();

router.get('/cart', function(req,res){
    res.render('vwCart/cart');
});

export default router;