const express = require('express');
const route = express.Router();
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

//model
const Admin = require('../models/admin.js');

// validationMiddleware
const validationLogin = require('../middleware/validation-check')
	.loginAdminValidation;

route.get('/login-admin', (req, res, next) => {
	res.render('auth/login-admin.ejs', {
		errMessage: [],
		hasError: false,
	});
});

route.post('/login-admin', validationLogin, (req, res, next) => {
	const { username, password } = req.body;
	let pesanError = validationResult(req);
	if (!pesanError.isEmpty()) {
		res.render('auth/login-admin.ejs', {
			errMessage: pesanError.array(),
			hasError: true,
			oldInput: {
				username: username,
				password: password,
			},
		});
	}
	Admin.findOne({ username: username })
		.then(admin => {
			if (!admin) {
				res.redirect('/login-admin');
			}
			bcrypt.compare(password, admin.password).then(isMatch => {
				if (isMatch) {
					req.session.admin = admin;
					req.session.isAdmin = true;
					return req.session.save(() => {
						res.redirect('/admin');
					});
				}
			});
		})
		.catch(err => console.log(err));
});

route.post('/logout', (req, res, next) => {
	req.session.destroy(() => {
		res.redirect('/login-admin');
	});
});

module.exports = route;
