import { request } from 'express';
import categoryModel from '../models/category.model.js';
import userModel from '../models/user.model.js';
import cartModel from '../models/cart.model.js';

export default function (app) {
    app.use(async function (req, res, next) {
        const categories = await categoryModel.getAll();
        let categoriesRes = [];
        for (let i = 0; i < categories.length; i++) {
            categoriesRes.push({
                name: categories[i].name,
                ico: categories[i].ico
            });
        }
        res.locals.maxLcCategories = categories.length;
        res.locals.lcCategories = categoriesRes;
        next();
    });

    app.use(async function (req, res, next) {
        let result = 0;
        if (typeof (req.session.passport) !== 'undefined') {
            if (typeof (req.session.passport.user._id) !== 'undefined') {
                result = await cartModel.getTotalItems(req.session.passport.user._id);
            }
            else {
                result = await cartModel.getTotalItems(req.session.passport.user.data._id);
            }
        }
        res.locals.lcTotalInCart = result;
        next();
    });

    app.use(async function (req, res, next) {
        let authUser = req.session.passport;
        if (typeof (authUser) === 'undefined') {
            authUser = false;
        }
        else {
            authUser.user = req.session.passport.user;
            if (typeof (authUser.user.data) !== 'undefined') {
                authUser.user = req.session.passport.user.data;
            }
            const user = await userModel.findById(authUser.user._id);
            // req.user.id_permission = user.id_permission;
            authUser.user.id_permission = user.id_permission;
            req.session.passport.id_permission = user.id_permission;
        }
        res.locals.lcAuthUser = authUser.user;
        // console.log('lcAuthUser', res.locals.lcAuthUser);
        next();
    });
}