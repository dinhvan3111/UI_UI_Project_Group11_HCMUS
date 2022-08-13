import env from '../utils/env.js';
import { engine } from 'express-handlebars';
import hbs_sections from 'express-handlebars-sections';
import express from 'express';
import linkManager from '../utils/linkManager.js';
import { NUM_TO_DESCRIPTION } from '../utils/database.js';

export default function (app) {
	app.use(express.urlencoded({
		extended: true,
		limit: '25mb'
	}));
	app.use(express.json({
		type: "application/json",
		limit: '25mb'
	}));
	app.engine('hbs', engine({
		defaultLayout: 'main.hbs',
		helpers: {
			format_number(num) {
				num = num + '';
				for (let i = num.length - 3; i > 0; i -= 3) {
					num = num.slice(0, i) + ',' + num.slice(i);
				}
				return num;
			},
			getImgLink(imgPath) {
				return linkManager.getImgLink(imgPath);
			},
			section: hbs_sections(),
			roundFloat(percentage) {
				if (typeof (percentage) !== 'undefined') {
					var rounded = percentage.toFixed();
					return rounded;
				}
			},
			convertToStateDesc(num){
				return NUM_TO_DESCRIPTION[num];
			},
			convertToStateNum(desc){
				return Object.keys(NUM_TO_DESCRIPTION).find(key => NUM_TO_DESCRIPTION[key] === desc);
			},
			toJSDate (dateTime) {
				var dateTime = new Date(dateTime);
				const options = {};
				options.hour = '2-digit';
				options.minute = '2-digit';
				options.hour12 = 'true';

				return dateTime.toLocaleDateString('en-GB', options);
			},
			ifCond(v1, operator, v2) {
				switch (operator) {
					case '==':
						return (v1 == v2) ? true : false;
					case '===':
						return (v1 === v2) ? true : false;
					case '!=':
						return (v1 != v2) ? true : false;
					case '!==':
						return (v1 !== v2) ? true : false;
					case '<':
						return (v1 < v2) ? true : false;
					case '<=':
						return (v1 <= v2) ? true : false;
					case '>':
						return (v1 > v2) ? true : false;
					case '>=':
						return (v1 >= v2) ? true : false;
					case '&&':
						return (v1 && v2) ? true : false;
					case '||':
						return (v1 || v2) ? true : false;
					default:
						return false;
				}
			}
		}
	}));

	app.set('view engine', 'hbs');
	app.set('views', './views');
}