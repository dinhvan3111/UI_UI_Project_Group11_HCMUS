import session from 'express-session';
import passport from 'passport';
import MongoStore from 'connect-mongo'
import FacebookStrategy from 'passport-facebook';
import fnGoogleStrategy from 'passport-google-oauth';
const GoogleStrategy = fnGoogleStrategy.OAuth2Strategy;
import env from '../utils/env.js';
import { connectionInfo } from '../utils/database.js';
import UserModel from '../models/user.model.js';

async function findOrCreate(profile){
	const idThirdPartyAcc = profile.id;
	const provider = profile.provider;
	const displayName = profile.displayName;
	console.log('session:')
	console.log(profile);
	var email = null;
	if(typeof(profile.emails) !== 'undefined'){
		email = profile.emails[0].value;
	}
	const info = await UserModel.findOrCreateByThirdPartyAcc(
					idThirdPartyAcc, displayName, email, provider);
	return info;
}

export default function (app){
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
		proxy : true,
        // Enable cookie secure = true when deploy
		// cookie: {
		// 	secure: true
		// }
	}));

    app.use(passport.initialize());
	app.use(passport.session());

	passport.serializeUser(function(user, done) {
	  done(null, user);
	});

	passport.deserializeUser(function(obj, done) {
	  done(null, obj);
	});

	passport.use(new FacebookStrategy({
	    clientID: env.FB_APP_ID,
	    clientSecret: env.FB_SECRET,
	    callbackURL: env.FB_CALLBACK_URL,
	    profileFields: ['id', 'emails', 'displayName']
	  },
	  async function(accessToken, refreshToken, profile, done) {
		const info = await findOrCreate(profile);
		console.log(info);
		if(info === null){
			return done(null, false);
		}
		return done(null, info);
	  }
	));

	passport.use(new GoogleStrategy({
	    clientID: env.GG_APP_ID,
	    clientSecret: env.GG_SECRET,
	    callbackURL: env.GG_CALLBACK_URL
	  },
	  async function(accessToken, refreshToken, profile, done) {
		const info = await findOrCreate(profile);
		if(info === null){
			return done(null, false);
		}
		return done(null, info);
	  }
	));
}