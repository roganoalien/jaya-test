const express = require('express'),
	{ check, validationResult } = require('express-validator/check'),
	passport = require('passport'),
	router = express.Router();

const { config } = require('../config/config-app'),
	{ isAuthenticated } = require('../utils/util-auth');

const Admin = require('../models/model-user');

// Admin Index
router.get('/login', (req, res) => {
	res.render('admin/login', {
		title: 'Login'
	});
});

router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/admin',
		successFlash: 'Sesión Iniciada',
		failureRedirect: '/login',
		failureFlash: 'Email o Password incorrecto'
	})
);

router.get('/register', (req, res) => {
	res.render('admin/register', {
		title: 'Register'
	});
});

router.post(
	'/register',
	[
		check('name')
			.isLength({ min: 4 })
			.withMessage('El nombre debe de tener mínimo 4 carácteres'),
		check('email')
			.not()
			.isEmpty()
			.withMessage('Debe elegirse un correo')
			.isEmail()
			.withMessage('Se debe elegir un correo válido'),
		check('password')
			.isLength({ min: 8 })
			.withMessage('La contraseña debe de tener al menos 8 carácteres')
			.matches('[0-9]')
			.withMessage('La contraseña debe de tener mínimo un número')
			.matches('[a-z]')
			.withMessage('La contraseña debe de tener mínimo una minúscula')
			.matches('[A-Z]')
			.withMessage('La contraseña debe de tener mínimo una mayúscula'),
		check('password').custom((value, { req, loc, path }) => {
			if (value !== req.body.confirmPassword) {
				throw new Error('Las contraseñas no coinciden');
			} else {
				return value;
			}
		})
	],
	async (req, res) => {
		const { redirect_url } = req.query;
		const { name, email, password } = req.body,
			emailUser = await Admin.findOne({ email }),
			errors = validationResult(req);
		let render_view = 'admin/register';
		let redirect_url_fail = '/registro',
			redirect_url_success = '/login',
			error_title = 'Registro de Administrador';
		if (redirect_url === 'admin') {
			render_view = 'admin/create-admin';
			redirect_url_fail = '/admin/crear-admin';
			error_title = 'Crear Administrador';
			redirect_url_success = '/admin';
		}
		if (!errors.isEmpty()) {
			res.render(render_view, {
				title: error_title,
				errors: errors.array()
			});
		} else {
			console.log('REGISTRO -- sin errores');
			if (emailUser) {
				console.log('REGISTRO -- correo EXISTE');
				req.flash('error', '¡El email ya se ha utilizado!');
				res.redirect(redirect_url_fail);
			} else {
				console.log('REGISTRO -- correo NO EXISTE');
				const newAdmin = new Admin({ name, email });
				newAdmin.password = await newAdmin.encryptPassword(password);
				await newAdmin.save();
				req.flash('success', '¡Registro Completado!');
				res.redirect(redirect_url_success);
			}
		}
	}
);

router.get('/admin', isAuthenticated, (req, res) => {
	res.render('admin/dashboard', {
		title: 'Admin'
	});
});

router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success', '¡Sesión Cerrada!');
	res.redirect('/login');
});

module.exports = router;
