const express = require('express'),
	fs = require('fs'),
	path = require('path'),
	Jimp = require('jimp'),
	multer = require('multer'),
	router = express.Router();

const { config } = require('../config/config-app'),
	{ isAuthenticated } = require('../utils/util-auth');

const Admin = require('../models/model-user'),
	Work = require('../models/model-work');

//-- Multer Configuration
const storage = multer.diskStorage({
	destination: async function(req, file, cb) {
		// Almacenamos el directorio final en una variable
		const dir = './public/portfolio';
		// Revisamos si existe el directorio del usuario
		if (!fs.existsSync(dir)) {
			// Si no existe lo creamos, ya que cuando se crea una función
			// para destination, multer no crea la carpeta por default
			await fs.mkdirSync(dir);
		}
		cb(null, dir);
	},
	filename: function(req, file, cb) {
		// removeOlder(file, req);
		console.log(req.body);
		cb(null, req.body.url + path.extname(file.originalname));
	}
});
//-- Removes older images if existed
function removeOlder(which, req) {
	try {
		fs.unlinkSync(which.path);
	} catch (err) {
		console.log(err);
	}
}
//-- Uploads image with multer
const uploadImg = multer({
	storage,
	limits: {
		fileSize: 1000000
	},
	fileFilter: function(req, file, cb) {
		checkFileType(file, cb);
	}
});
// Check if upload is an image
function checkFileType(file, cb) {
	// Extensiones permitidas
	const filetypes = /jpeg|jpg|png|gif/;
	// Checamos extensiones
	const extname = filetypes.test(
		path.extname(file.originalname).toLocaleLowerCase()
	);
	// Checamos mime
	const mimetype = filetypes.test(file.mimetype);
	// Validamos
	if (mimetype && extname) {
		return cb(null, true);
	} else {
		cb('Error: Solo se permiten imágenes');
	}
}
// Admin Index
router.get('/admin', isAuthenticated, async (req, res) => {
	const works = await Work.find({});
	res.render('admin/dashboard', {
		title: 'Admin | Dashboard',
		works
	});
});
// Create project
router.get('/admin/crear-proyecto', isAuthenticated, async (req, res) => {
	res.render('admin/create-project', {
		title: 'Admin | Ver Trabajos'
	});
});
router.post(
	'/admin/crear-proyecto',
	uploadImg.single('uploadImg'),
	async (req, res) => {
		const { title, subtitle, url } = req.body;
		const filePath = req.file.path.replace('undefined', url);
		fs.renameSync(req.file.path, filePath);
		const workObject = {
			background: `/${filePath}`,
			title,
			subtitle,
			url
		};
		let _url = `./${filePath.replace('.', '-lq.')}`;
		Jimp.read(`./${filePath}`, (err, img) => {
			if (err) throw err;
			img.quality(20)
				.pixelate(20)
				// .blur(15)
				.write(_url);
		});
		workObject.background_lq = _url.replace('.', '');
		const newWork = new Work(workObject);
		newWork.save().then(() => {
			req.flash('success', '¡Se creó el proyecto!');
			res.redirect('/admin');
		});
	}
);
router.get('/admin/editar/:id', isAuthenticated, async (req, res) => {
	await Work.findById(req.params.id, (err, work) => {
		if (err) throw err;
		res.render('admin/project-detail', {
			title: `Editar | ${work.title}`,
			work
		});
	});
});
router.get('/admin/borrar/:id', async (req, res) => {
	await Work.findByIdAndDelete(req.params.id, (err, work) => {
		if (err) {
			req.flash(
				'error',
				'¡Parece que hubo un problema al eliminar el proyecto!'
			);
			res.redirect('/admin');
		} else {
			fs.unlinkSync(`./${work.background}`);
			fs.unlinkSync(`./${work.background_lq}`);
			req.flash('success', '¡Se eliminó correctamente!');
			res.redirect('/admin');
		}
	});
});
router.post('/admin/guardar/:id', (req, res) => {
	const { title, subtitle, description, software, quill } = req.body;
	const id = req.params.id;
	// Work.findById(id, (err, work) => {
	// 	try {
	// 		work.title = title;
	// 		work.subtitle = subtitle;
	// 		work.description = description;
	// 		work.software = software;
	// 		work.content = JSON.parse(quill);
	// 		work.save().then(() => {
	// 			req.flash('success', '¡Se guardó el proyecto!');
	// 			res.redirect(`/admin/editar/${id}`);
	// 		});
	// 	} catch (err) {
	// 		console.log(err);
	// 	}
	// });
});

module.exports = router;
