const { body } = require('express-validator/check');

const loginAdminValidation = [
	body('username').notEmpty().withMessage('Username Tidak Boleh Kosong'),
	body('password').notEmpty().withMessage('Password Tidak Boleh Kosong'),
];

const daftarValidation = [
	body('nama').notEmpty().withMessage('Nama Tidak Boleh Kosong'),
	body('nisn').notEmpty().withMessage('NISN Tidak Boleh Kosong'),
	body('nik').notEmpty().withMessage('NIK Tidak Boleh Kosong'),
	body('lahir').notEmpty().withMessage('Tanggal Lahir Tidak Boleh Kosong'),
	body('kelamin').notEmpty().withMessage('Jenis Kelamin Tidak Boleh Kosong'),
	body('agama').notEmpty().withMessage('Agama Tidak Boleh Kosong'),
	body('sekolah').notEmpty().withMessage('Asal Sekolah Tidak Boleh Kosong'),
];

exports.loginAdminValidation = loginAdminValidation;
exports.daftarValidation = daftarValidation;
