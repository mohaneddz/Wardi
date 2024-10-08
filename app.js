// Importing the modules //////////////////////////////
// NPM Modules-------------------------
import path from 'path'; // path module
import express from 'express'; // express module
import morgan from 'morgan'; // morgan module ( for logging )
import rateLimit from 'express-rate-limit'; // rate limiting module ( for security )
import helmet from 'helmet'; // helmet module ( also for security )
import mongoSanitize from 'express-mongo-sanitize'; // mongo sanitize module ( for security )
import xss from 'xss-clean'; // xss module ( for security )
import hpp from 'hpp'; // hpp module ( for security )
import cookieParser from 'cookie-parser'; // cookie parser module ( for parsing cookies )
import bodyParser from 'body-parser'; // body parser module ( for parsing the body of the request )
import compression from 'compression'; // compression module ( for compressing the response )
import cors from 'cors'; // cors module ( for cross origin resource sharing )
import cron from 'node-cron';
import axios from 'axios'; // for making the HTTP request

// Error Handlers-------------------------
import AppError from './utils/appError.js'; // AppError class
import globalErrorHandler from './controllers/errorController.js';

// Routers-------------------------
import quranRouter from './routers/Content/quranRoutes.js';
import hadithRouter from './routers/Content/hadithRoutes.js';
import tafsirRouter from './routers/Content/tafsirRoutes.js';
import userRouter from './routers/userRoutes.js';
import viewRouter from './routers/viewRoutes.js';
import { fileURLToPath } from 'url';

import * as authController from './controllers/authController.js';
// Initial Variables-------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express(); // creating an express app

// Start of the express app //////////////////////////////

// app.enable('trust proxy', 1); // To correctly read the X-Forwarded-Proto header, enable trust proxy in Express (HTTP header)
// app.disable('trust proxy'); // To disable the trust proxy in Express ( in development )

app.set('view engine', 'pug'); // setting the view engine to pug ( for rendering the views :) )
app.set('views', path.join(__dirname, 'views'));

app.use(cors()); // Implementing CORS ( Cross Origin Resource Sharing )
app.options('*', cors());

app.use(express.static(path.join(__dirname, 'public')));
// Currently for the favorites
app.get('/models/Content/schemas/QuranSchema.js', (req, res) => {
	res.type('application/javascript');
	res.sendFile(path.join(__dirname, 'models', 'Content', 'schemas', 'QuranSchema.js'));
});

// // Setting the MIDDLEWARES! //////////////////////////////

// app.use(helmet()); // Setting the security HTTP headers
process.env.NODE_ENV === 'development' && app.use(morgan('dev')); // Only for development, logging the requests to console
const limiter = rateLimit({
	max: 1000, // limiting the requests to 100 per hour
	windowMs: 7 * 60 * 1000, // 7 Minutes ( to prevent DDOS attacks )
	message: 'Too many requests from this IP, please try again later!',
});

app.use('/', limiter); // limiting the requests to the api
app.use(express.json({ limit: '10kb' })); // parsing the json data from the body of the request
app.use(express.urlencoded({ extended: true, limit: '10kb' })); // parsing the form data from the body of the request / to parse URL-encoded data from the form
app.use(cookieParser()); // parsing the cookies from the request

app.use(mongoSanitize()); // Data sanitization against NoSQL query injection
app.use(xss()); // Data sanitization against XSS ( Cross Site Scripting )
app.use(hpp({ whitelist: [''] }));

app.use(compression());

cron.schedule('*/10 * * * *', async () => {
	try {
		await axios.get('https://wardi.onrender.com');
		console.log('Server pinged successfully at', new Date());
	} catch (error) {
		console.error('Error pinging the server:', error.message);
	}
});

// // Setting the routes //////////////////////////////

app.use(authController.isLoggedIn);
app.use('/', viewRouter); // view routes
app.use('/quran', quranRouter); // quran routes
app.use('/hadith', hadithRouter); // hadith routes
app.use('/user', userRouter); // user routes
app.use('/tafsir', tafsirRouter); // booking routes

app.all('*', (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server!, 404`));
});
app.use(globalErrorHandler); // centralize error handling functions

export default app;
