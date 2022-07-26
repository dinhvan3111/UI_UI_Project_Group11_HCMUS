import passport from 'passport';
import express from 'express';
import validator from '../utils/validator.js';
import userModel from '../models/user.model.js';

const router = express.Router();

router.get('/login', function(req, res) {
    res.render('vwAccount/login', {layout:false});
});

router.get('/register', function(req,res){
    res.render('vwAccount/register', {layout:false});
});

router.post('/register', async function (req, res){
    if (!validator.isValidStr(req.body.fullname) ||
        !validator.isValidStr(req.body.address) ||
        !validator.isValidStr(req.body.email) ||
        !validator.isValidStr(req.body.password)){

        return res.redirect('/register');
    }
    if(!validator.isValidEmail(req.body.email)) {
        return res.render('vwAccount/register', {
            layout: false,
            err_message: 'Email không hợp lệ'
        });
    }
    if(await userModel.findById(req.body.email) !== null){
        return res.render('vwAccount/register', {
            layout: false,
            err_message: 'Email đã tồn tại trong hệ thống'
        });
    }
    if(await userModel.register(req.body) === null){
        
        return res.render('vwAccount/register', {
            layout: false,
            err_message: 'Đã xảy ra lỗi! Vui lòng thử lại sau'
        });
    }
    return res.render('vwAccount/register', {
        layout: false,
        success_message: 'Đăng ký thành công'
    });
});

router.post('/auth/facebook', function(req, res, next) {
    req.session.loginInfo = {
        provider: 'Facebook'
    }
    next();
    }, passport.authenticate('facebook', {scope: ['email']})
);

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {failureRedirect: '/login'}),
    function(req, res){
        if(typeof(req.session.idAcc) !== 'undefined'){
            delete req.session.idAcc;
        }
        delete req.session.loginInfo;
        const url = req.session.retUrl || '/';
        if(typeof(req.session.retUrl) !== 'undefined'){
            delete req.session.retUrl;
        }
        res.redirect(url);
    }
);

router.post('/auth/google', function(req, res, next){
    req.session.loginInfo = {
        provider: 'Google'
    }
    next();
    }, passport.authenticate('google', {scope: ['profile', 'email']})
);

router.get('/auth/google/callback',
    passport.authenticate('google', {failureRedirect: '/login'}),
    function(req, res){
        if(typeof(req.session.idAcc) !== 'undefined'){
            delete req.session.idAcc;
        }
            delete req.session.loginInfo;
            const url = req.session.retUrl || '/';
        if(typeof(req.session.retUrl) !== 'undefined'){
            delete req.session.retUrl;
        }
        res.redirect(url);
    }
);

export default router;