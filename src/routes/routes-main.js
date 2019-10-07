const express = require('express'),
	nodemailer = require('nodemailer'),
	request = require('request'),
	router = express.Router();

const { config } = require('../config/config-app'),
	workModel = require('../models/model-work'),
	userModel = require('../models/model-user');

// Indice
router.get('/', async (req, res) => {
	const works = await workModel.find({});
	console.log(works);
	res.render('sections/index', {
		index: true,
		title: 'Rodrigo García | Portafolio',
		description:
			'Hola! Mi nombre es Rodrigo García y soy un Creative Developer. Esto significa que no soy solo un desarrollador Fullstack enfocado en NodeJS sino que también tengo experiencia y background en diseño UI/UX.',
		image:
			'https://rodrigogarcia.com.mx/public/img/social/rodrigogarcia-portfolio.png',
		url: '',
		works
	});
});
// Detalle
router.get('/work/:url', async (req, res) => {
	const url = req.params.url;
	const work = await workModel.findOne({ url });
	// res.status(200).json(work);
	console.log(work.content.blocks);
	res.render('sections/detail', {
		description: work.description,
		index: false,
		title: work.title,
		image: `https://rodrigogarcia.com.mx/public/img/social/rodrigogarcia-${work.url}.png`,
		url: work.url,
		work
	});
});

module.exports = router;
