import authRoute from '../routes/auth.route.js';
import productManagementRoute from '../routes/product_management.route.js';
import productUserRoute from '../routes/product_user.route.js';
import cartRoute from '../routes/cart.route.js';
import productModel from '../models/product.model.js';

export default function(app){

	app.post('/logout', function(req, res){
		if(typeof(req.session.idAcc) !== 'undefined'){
	      	delete req.session.idAcc;
	    }
	    req.logout();
	    // const url = req.headers.referer || '/';
		res.redirect('/login');
	});

    app.use('/', authRoute);
	app.use('/', cartRoute);
	app.use('/products', productManagementRoute);
	app.use('/products', productUserRoute);


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
				topSellTmp.push(productInTopSell);
			}
			const productInTopDiscount = topDiscount[i].toObject();
			productInTopDiscount._id = topDiscount[i]._id.toString();
			productInTopDiscount.id_category = topDiscount[i].id_category.toString();
			topDiscountTmp.push(productInTopDiscount);

			const productInTopNew = topNew[i].toObject();
			productInTopNew._id = topNew[i]._id.toString();
			productInTopNew.id_category = topNew[i].id_category.toString();
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