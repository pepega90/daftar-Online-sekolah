const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const siwaSchema = new Schema({
	nama: {
		type: String,
		required: true,
	},
	nisn: {
		type: String,
		required: true,
	},
	nik: {
		type: String,
		required: true,
	},
	tanggal_lahir: {
		type: Date,
		required: true,
	},
	foto: {
		type: String,
		required: true,
	},
	jenis_kelamin: {
		type: String,
		required: true,
	},
	agama: {
		type: String,
		required: true,
	},
	asal_sekolah: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model('siswa', siwaSchema);
