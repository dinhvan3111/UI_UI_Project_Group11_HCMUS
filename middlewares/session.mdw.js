import session from 'express-session';
import passport from 'passport';
import MongoStore from 'connect-mongo'
import LocalStrategy from 'passport-local';
import FacebookStrategy from 'passport-facebook';
import fnGoogleStrategy from 'passport-google-oauth';
const GoogleStrategy = fnGoogleStrategy.OAuth2Strategy;
import env from '../utils/env.js';
import { connectionInfo } from '../utils/database.js';
import UserModel from '../models/user.model.js';

async function findOrCreate(profile) {
	const idThirdPartyAcc = profile.id;
	const provider = profile.provider;
	const displayName = profile.displayName;
	// console.log('session:')
	// console.log(profile);
	var email = null;
	if (typeof (profile.emails) !== 'undefined') {
		email = profile.emails[0].value;
	}
	const info = await UserModel.findOrCreateByThirdPartyAcc(
		idThirdPartyAcc, displayName, email, provider);
	return info;
}

export default function (app) {
	app.set('trust proxy', 1);
	app.use(session({
		secret: env.SECRET_APP,
		resave: false,
		saveUninitialized: true,
		store: MongoStore.create({
			mongoUrl: connectionInfo.connectionUrl,
			ttl: 14 * 24 * 60 * 60, // = 14 days. Default
			autoRemove: 'native', // Default
		}),
		proxy: true,
		// Enable cookie secure = true when deploy
		// cookie: {
		// 	secure: true
		// }
	}));

	app.use(passport.initialize());
	app.use(passport.session());

	passport.serializeUser(function (user, done) {
		done(null, user);
	});

	passport.deserializeUser(function (obj, done) {
		done(null, obj);
	});

	passport.use(new FacebookStrategy({
		clientID: env.FB_APP_ID,
		clientSecret: env.FB_SECRET,
		callbackURL: env.FB_CALLBACK_URL,
		profileFields: ['id', 'email', 'displayName']
	},
		async function (accessToken, refreshToken, profile, done) {
			console.log(profile);
			const info = await findOrCreate(profile);
			console.log(info);
			if (info.code === UserModel.ERROR_CODE) {
				return done(null, false, { message: info.message })
			}
			return done(null, info);
		}
	));

	passport.use(new GoogleStrategy({
		clientID: env.GG_APP_ID,
		clientSecret: env.GG_SECRET,
		callbackURL: env.GG_CALLBACK_URL
	},
		async function (accessToken, refreshToken, profile, done) {
			const info = await findOrCreate(profile);
			console.log('info: ', info);
			if (info.code === UserModel.ERROR_CODE) {
				return done(null, false, { message: info.message })
			}
			return done(null, info);
		}
	));

	passport.use(new LocalStrategy(
		async function verify(username, password, done) {
			if (!username === undefined ||
				!username.length === 0 ||
				!password === undefined ||
				!password.length === 0) {

				return done(null, false, { message: 'Tài khoản hoặc mật khẩu không chính xác.' });
			}
			const isAuthenticated = await UserModel.checkLogin(username, password);
			if (isAuthenticated !== null) {
				return done(null, isAuthenticated);
			}
			return done(null, false, { message: 'Tài khoản hoặc mật khẩu không chính xác.' });
		})
	);
}