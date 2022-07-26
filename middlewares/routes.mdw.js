import authRoute from '../routes/auth.route.js';
import productManagementRoute from '../routes/product_management.route.js';
import productUserRoute from '../routes/product_user.route.js';
import cartRoute from '../routes/cart.route.js';
import productModel from '../models/product.model.js';
import paymentRoute from '../routes/payment.route.js';
import categoryRoute from '../routes/category.route.js';

import apiCart from '../apis/cart.api.js';
import apiAuth from '../apis/auth.api.js';

export default function(app){

	app.post('/logout', async function(req, res){
		if(typeof(req.session.passport) !== 'undefined'){
	      	// delete req.session.idAcc;
			await req.logout(function(err) {
				if (err) { 
					return res.json({
						code: 400,
						status: 'Bad Request',
						message: 'Not login'
					});
				}
				res.json({
					code: 200,
					status: 'OK',
					message: 'Logged out'
				});
			});
			// const url = req.headers.referer || '/';
	    }
	    
	});

    app.use('/', authRoute);
	app.use('/', cartRoute);
	app.use('/', paymentRoute);
	app.use('/products', productManagementRoute);
	app.use('/products', productUserRoute);
	app.use('/categories', categoryRoute);

	app.use('/api/cart', apiCart);
	app.use('/api/auth', apiAuth);

	app.get('/', async function(req, res) {
		const topNew = await productModel.getTopNew(0, 6);
		const topDiscount = await productModel.getTopDiscount(0, 6);
		const topSell = await productModel.getTopSell(0, 4);
		const topNewTmp = [];
		const topDiscountTmp = [];
		const topSellTmp = [];

		for(let i = 0; i < topNew.length; i++){
			if(topSell[i] !== undefined){
				const productInTopSell = topSell[i].toObject();
				productInTopSell._id = topSell[i]._id.toString();
				productInTopSell.id_category = topSell[i].id_category.toString();
				productModel.delSalePercentAttr(productInTopSell);
				topSellTmp.push(productInTopSell);
			}
			const productInTopDiscount = topDiscount[i].toObject();
			productInTopDiscount._id = topDiscount[i]._id.toString();
			productInTopDiscount.id_category = topDiscount[i].id_category.toString();
			productModel.delSalePercentAttr(productInTopDiscount);
			topDiscountTmp.push(productInTopDiscount);

			const productInTopNew = topNew[i].toObject();
			productInTopNew._id = topNew[i]._id.toString();
			productInTopNew.id_category = topNew[i].id_category.toString();
			productModel.delSalePercentAttr(productInTopNew);
			topNewTmp.push(productInTopNew);
		}
		res.render('home', {
			topNew: topNewTmp,
			topDiscount: topDiscountTmp,
			topSell: topSellTmp,
		});
	});

	// app.get('/err', function(req, res){
	//     throw new Error('Error');
	// });
	// app.use(function (req, res, next){
	//     res.render('404', {layout: false});
	// });

	// app.use(function (err, req, res, next){
	//     res.render('500', {layout: false});
	//     console.log(err);
	// });
}