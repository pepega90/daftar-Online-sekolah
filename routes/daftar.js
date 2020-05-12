const express = require('express');
const route = express.Router();
const { validationResult } = require('express-validator');
//model
const Siswa = require('../models/siswa');

// validation
const checkDaftar = require('../middleware/validation-check').daftarValidation;

route.get('/', (req, res, next) => {
	res.render('daftar/daftar.ejs', {
		errMessage: [],
	});
});

route.post('/', checkDaftar, (req, res, next) => {
	const { nama, nisn, nik, lahir, kelamin, agama, sekolah } = req.body;
	let pesanErr = validationResult(req);
	if (!pesanErr.isEmpty()) {
		res.render('daftar/daftar.ejs', {
			errMessage: pesanErr.array(),
		});
	}
	const image = req.file;
	if (!image) {
		res.render('daftar/daftar.ejs', {
			errMessage: pesanErr.array(),
		});
	}
	const foto = image.path;
	const murid = new Siswa({
		nama,
		nisn,
		nik,
		tanggal_lahir: lahir,
		foto: foto,
		jenis_kelamin: kelamin,
		agama,
		asal_sekolah: sekolah,
	});

	murid
		.save()
		.then(result => {
			res.redirect('/cetak-form');
		})
		.catch(err => console.log(err));
});

route.get('/cetak-form', (req, res, next) => {
	Siswa.find({})
		.then(murid => {
			let index;
			murid.forEach((_, urut) => {
				index = urut;
			});
			res.render('daftar/cetak.ejs', { siswa: murid, index });
		})
		.catch(err => console.log(err));
});

route.get('/form-pendaftaran/:idSiswa', (req, res, next) => {
	const siswaId = req.params.idSiswa;
	Siswa.findById(siswaId)
		.then(siswa => {
			res.render('daftar/formDaftar.ejs', { siswa: siswa });
		})
		.catch(err => console.log(err));
});

module.exports = route;
