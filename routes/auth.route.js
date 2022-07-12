import passport from 'passport';
import express from 'express';

const router = express.Router();


router.get('/login', function(req, res) {
    res.render('detail');
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