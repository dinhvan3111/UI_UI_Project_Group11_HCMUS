import authRoute from '../routes/auth.route.js';
import productManagementRoute from '../routes/product_management.route.js';
import productUserRoute from '../routes/product_user.route.js';

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

	app.use('/products', productManagementRoute);
	app.use('/products', productUserRoute);


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