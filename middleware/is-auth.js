module.exports = (req, res, next) => {
	if (!req.session.admin) {
		res.redirect('/login-admin');
	}
	next();
};
