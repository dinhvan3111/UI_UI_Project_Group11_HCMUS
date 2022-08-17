import userModel from '../models/user.model.js';
import { PERMISSION_ENUM } from '../utils/database.js';

const REDIRECTED = true;

function isLogon(req, res) {
	if (!req.user) {
        // If user have not logged in
        return REDIRECTED;
    }
	return !REDIRECTED;
}

function notLogin(req, res) {
	if (typeof (req.user) === 'undefined') {
		req.session.retUrl = req.originalUrl;
		const url = '/login';
		res.redirect(url);
		return REDIRECTED;
	}
	return !REDIRECTED;
}

export default {
	isLogon(req, res, next) {
		if (isLogon(req, res) !== REDIRECTED) {
			next();
		}
	},

	notLogin(req, res, next) {
		if (notLogin(req, res) !== REDIRECTED) {
			return next();
		}
		return res.redirect('/login');
	},

	isAdmin(req, res, next) {
		if (isLogon(req, res) !== REDIRECTED &&
			req.session.passport.user.id_permission === PERMISSION_ENUM.ADMIN) {
			return next();
		}
		return res.redirect('back');
	},

	isStaff(req, res, next) {
		if (isLogon(req, res) !== REDIRECTED &&
			req.session.passport.user.id_permission === PERMISSION_ENUM.STAFF) {
			return next();
		}
		return res.redirect('back');
	},

	isUser(req, res, next) {
		if (isLogon(req, res) !== REDIRECTED &&
			req.session.passport.user.id_permission === PERMISSION_ENUM.USER) {
			return next();
		}
		return res.redirect('back');
	},
}