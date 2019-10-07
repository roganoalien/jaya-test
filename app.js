const bodyParser = require('body-parser'),
	express = require('express'),
	favicon = require('serve-favicon'),
	cors = require('cors'),
	morgan = require('morgan'),
	path = require('path'),
	passport = require('passport'),
	flash = require('connect-flash'),
	winston = require('./src/config/config-winston'),
	session = require('express-session');

const { config } = require('./src/config/config-app'),
	adminRoutes = require('./src/routes/routes-admin'),
	mainRoutes = require('./src/routes/routes-main');

const app = express();
require('./src/config/config-db');
require('./src/config/config-passport');
app.set('port', process.env.PORT || config.port);
app.set('views', path.join(__dirname, './src/views'));
app.set('view engine', 'pug');
//-- Middlewares
app.use(favicon(path.join(__dirname, 'public/favicon', 'favicon.ico')));
app.use(morgan('combined', { stream: winston.stream }));
// app.use(morgan('dev'));
app.use(
	session({
		secret: config.secret,
		resave: true,
		saveUninitialized: true
	})
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
});
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
//-- Routes
app.use(mainRoutes);
app.use(adminRoutes);
const server = app.listen(app.get('port'), function() {
	console.log(`Listening http://localhost:${server.address().port}`);
});
