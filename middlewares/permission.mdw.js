import userModel from '../models/user.model.js';

function isLogon(req, res) {
    if(typeof (req.user) !== 'undefined'){
		req.session.retUrl = req.originalUrl;
		const url = '/login';
		res.redirect(url);
		return true;
	}
	return false;
}

function notLogin(req, res){
	if(typeof (req.user) === 'undefined'){
		req.session.retUrl = req.originalUrl;
		const url = '/login';
		res.redirect(url);
		return true;
	}
	return false;
}

export default {
	isLogon(req, res, next){
		if(isLogon(req, res) !== true){
			next();
		}
	},

	notLogin(req, res, next){
		if(notLogin(req, res) !== true){
			next();
		}
	},
	
}