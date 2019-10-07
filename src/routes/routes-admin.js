const express = require('express'),
	fs = require('fs'),
	path = require('path'),
	router = express.Router();

const { config } = require('../config/config-app'),
	{ isAuthenticated } = require('../utils/util-auth');

const Admin = require('../models/model-user');

// Admin Index
router.get('/admin', isAuthenticated, async (req, res) => {
	res.render('admin/dashboard', {
		title: 'Admin | Dashboard',
		works
	});
});

module.exports = router;
