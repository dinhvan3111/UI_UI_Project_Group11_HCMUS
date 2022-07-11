import dotenv from 'dotenv';
dotenv.config();

const envVar = {
	DB_HOST: process.env.DB_HOST,
	DB_USER: process.env.DB_USER,
	DB_PASS: process.env.DB_PASS,
	DB_NAME: process.env.DB_NAME,
	SECRET_APP: process.env.SECRET_APP,
	PORT: process.env.PORT,
	MAX_IMG_SIZE: process.env.MAX_IMG_SIZE,
	TOTAL_SEARCH_RESULTS: process.env.TOTAL_SEARCH_RESULTS,
	TOTAL_PRODUCTS_PER_PAGE: process.env.TOTAL_PRODUCTS_PER_PAGE,
	DOMAIN: process.env.DOMAIN,
	FB_APP_ID: process.env.FB_APP_ID,
	FB_SECRET: process.env.FB_SECRET,
	FB_CALLBACK_URL: process.env.DOMAIN + process.env.FB_CALLBACK_URL,
	GG_APP_ID: process.env.GG_APP_ID,
	GG_SECRET: process.env.GG_SECRET,
	GG_CALLBACK_URL: process.env.DOMAIN + process.env.GG_CALLBACK_URL,
	STORAGE_CERT_NAME: process.env.STORAGE_CERT_NAME,
	STORAGE_BUCKET: process.env.STORAGE_BUCKET,
};


export default envVar;