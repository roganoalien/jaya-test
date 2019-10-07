const appRoot = require('app-root-path'),
	winston = require('winston');

const options = {
	file: {
		level: 'info',
		filename: `${appRoot}/assets/log.txt`,
		handleExceptions: true,
		format: winston.format.combine(
			winston.format.timestamp({
				format: 'DD-MM-YYYY HH:MM:ss'
			}),
			winston.format.errors({ stack: true }),
			winston.format.splat(),
			winston.format.json()
		),
		maxsize: 5242880,
		maxFiles: 5
	},
	console: {
		level: 'debug',
		handleExceptions: true,
		format: winston.format.combine(
			winston.format.colorize(),
			winston.format.simple()
		),
		colorize: true
	}
};

const logger = new winston.createLogger({
	transports: [
		new winston.transports.File(options.file),
		new winston.transports.Console(options.console)
	],
	exitOnError: false
});

logger.stream = {
	write: function(message, encoding) {
		logger.info(message);
	}
};

module.exports = logger;
