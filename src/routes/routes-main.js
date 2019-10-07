const express = require('express'),
	lineReader = require('line-reader'),
	fs = require('fs'),
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
			res.status(200).json({
				message: 'Arrays in mixed order',
				arrays: object
			});
		}
	});
});

module.exports = router;
