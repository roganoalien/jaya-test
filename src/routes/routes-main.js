const express = require('express'),
	lineReader = require('line-reader'),
	fs = require('fs'),
	winston = require('winston'),
	router = express.Router();

const { config } = require('../config/config-app'),
	userModel = require('../models/model-user');

// Indice
router.get('/', async (req, res) => {
	res.render('admin/login', {
		title: 'Login'
	});
});

router.get('/asc', (req, res) => {
	let object = [];
	lineReader.eachLine('./assets/original.txt', function(line, last) {
		let text = line.replace('];', '');
		text = text.replace('[', '');
		text = text.split(',');
		let array = [];
		text.map(item => {
			array.push(parseInt(item));
		});
		object.push(
			array.sort(function(a, b) {
				return a - b;
			})
		);
		console.log(line);
		if (last) {
			let string = '';
			object.map(item => {
				string += JSON.stringify(item) + ';\n';
			});
			fs.writeFile('./assets/sorted.txt', string, err => {
				if (err) throw err;
			});
			const ip =
				req.headers['x-forwarded-for'] ||
				req.connection.remoteAddress ||
				req.socket.remoteAddress ||
				(req.connection.socket
					? req.connection.socket.remoteAddress
					: null);
			Logger(ip, 'Ascending');
			res.status(200).json({
				message: 'Arrays in ascending order',
				arrays: object
			});
		}
	});
});

router.get('/des', (req, res) => {
	let object = [];
	lineReader.eachLine('./assets/original.txt', function(line, last) {
		let text = line.replace('];', '');
		text = text.replace('[', '');
		text = text.split(',');
		let array = [];
		text.map(item => {
			array.push(parseInt(item));
		});
		object.push(
			array.sort(function(a, b) {
				return b - a;
			})
		);
		console.log(line);
		if (last) {
			let string = '';
			object.map(item => {
				string += JSON.stringify(item) + ';\n';
			});
			fs.writeFile('./assets/sorted.txt', string, err => {
				if (err) throw err;
			});
			const ip =
				req.headers['x-forwarded-for'] ||
				req.connection.remoteAddress ||
				req.socket.remoteAddress ||
				(req.connection.socket
					? req.connection.socket.remoteAddress
					: null);
			Logger(ip, 'Descending');
			res.status(200).json({
				message: 'Arrays in descending order',
				arrays: object
			});
		}
	});
});

router.get('/mix', (req, res) => {
	let object = [];
	let count = 0;
	lineReader.eachLine('./assets/original.txt', function(line, last) {
		let text = line.replace('];', '');
		text = text.replace('[', '');
		text = text.split(',');
		let array = [];
		text.map(item => {
			array.push(parseInt(item));
		});

		object.push(
			array.sort(function(a, b) {
				if (count % 2) {
					return b - a;
				} else {
					return a - b;
				}
			})
		);
		count++;
		if (last) {
			let string = '';
			object.map(item => {
				string += JSON.stringify(item) + ';\n';
			});
			fs.writeFile('./assets/sorted.txt', string, err => {
				if (err) throw err;
			});
			const ip =
				req.headers['x-forwarded-for'] ||
				req.connection.remoteAddress ||
				req.socket.remoteAddress ||
				(req.connection.socket
					? req.connection.socket.remoteAddress
					: null);
			Logger(ip, 'Mixed');
			res.status(200).json({
				message: 'Arrays in mixed order',
				arrays: object
			});
		}
	});
});

function Logger(ip, request) {
	console.log('LOGGER');
	// fs.appendFile('./assets/log.txt', `${ip} | ${request}\n`, function(err) {
	// 	if (err) throw err;
	// 	console.log(`${request} request from ${ip}!`);
	// });
	const logger = winston.createLogger({
		level: 'log',
		format: winston.format.json(),
		defaultMeta: { request, ip },
		transports: [
			new winston.transports.File({
				filename: '../../assets/log.txt',
				level: 'log'
			})
		]
	});
	if (config.port !== 'production') {
		logger.add(
			new winston.transports.Console({
				format: winston.format.simple
			})
		);
	}
}

module.exports = router;
