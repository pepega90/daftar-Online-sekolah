const express = require('express');
const route = express.Router();

//model
const Siswa = require('../models/siswa');

//middleware
const isAuth = require('../middleware/is-auth');

//item per halaman
const ITEM_PER_PAGE = 4;

route.get('/', isAuth, (req, res, next) => {
	res.render('admin/admin.ejs');
});

route.get('/daftar-siswa-baru', (req, res, next) => {
	const halaman = +req.query.halaman || 1;
	Siswa.find()
		.skip((halaman - 1) * ITEM_PER_PAGE)
		.limit(ITEM_PER_PAGE)
		.then(siswa => {
			res.render('admin/tabel-siswa.ejs', {
				siswa: siswa,
				hal: halaman,
				prevHal: halaman - 1,
				nextHal: halaman + 1,
			});
		})
		.catch(err => console.log(err));
});

route.post('/daftar-siswa-baru/:siswaId', (req, res, next) => {
	const siswaId = req.params.siswaId;
	Siswa.findByIdAndDelete(siswaId)
		.then(murid => {
			res.redirect('/admin/daftar-siswa-baru');
		})
		.catch(err => {
			console.log(err);
		});
});

route.get('/detail-siswa/:siswaId', (req, res, next) => {
	const siswaId = req.params.siswaId;
	Siswa.findById(siswaId)
		.then(murid => {
			res.render('admin/detail.ejs', { siswa: murid });
		})
		.catch(err => {
			console.log(err);
		});
});

route.get('/cetak-tabel-pendaftaran', (req, res, next) => {
	Siswa.find({})
		.then(murid => {
			res.render('admin/cetak-tabel-daftar.ejs', { siswa: murid });
		})
		.catch(err => console.log(err));
});

module.exports = route;
