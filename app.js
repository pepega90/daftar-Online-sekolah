const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const multer = require('multer');

//route
const adminRoute = require('./routes/admin');
const daftarRoute = require('./routes/daftar');
const authRoute = require('./routes/auth');

// model admin
const Admin = require('./models/admin.js');
const Siswa = require('./models/siswa.js');

// set view
app.set('view engine', 'ejs');
app.set('views', 'views');

//multer configuration
const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'images');
	},
	filename: (req, file, cb) => {
		cb(
			null,
			new Date().toISOString().replace(/:/g, '-') +
				'-' +
				file.originalname
		);
	},
});

const filterImage = (req, file, cb) => {
	if (
		file.mimetype === 'image/png' ||
		file.mimetype === 'image/jpg' ||
		file.mimetype === 'image/jpeg'
	) {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

//middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	multer({ storage: fileStorage, fileFilter: filterImage }).single('image')
);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(
	session({
		secret: 'smkn-01-pepega',
		resave: false,
		saveUninitialized: false,
	})
);
app.use(flash());

//bikin session admin
app.use((req, res, next) => {
	if (!req.session.admin) {
		return next();
	}
	Admin.findById(req.session.admin)
		.then(admin => {
			req.session.admin = admin;
			next();
		})
		.catch(err => {
			next(new Error(err));
		});
});

// filter jenis_kelamin
app.use((req, res, next) => {
	Siswa.find({ jenis_kelamin: 'perempuan' })
		.then(siswa => {
			req.totalCewek = siswa.length;
			next();
		})
		.catch(err => {
			next(new Error(err));
		});
});

app.use((req, res, next) => {
	Siswa.find({ jenis_kelamin: 'laki-laki' })
		.then(siswa => {
			req.totalLaki = siswa.length;
			next();
		})
		.catch(err => {
			next(new Error(err));
		});
});

app.use((req, res, next) => {
	Siswa.find({ jenis_kelamin: 'lgbt' })
		.then(siswa => {
			req.totalLgbt = siswa.length;
			next();
		})
		.catch(err => {
			next(new Error(err));
		});
});

app.use((req, res, next) => {
	Siswa.find()
		.then(siswa => {
			req.totalSiswa = siswa.length;
			next();
		})
		.catch(err => {
			next(new Error(err));
		});
});

// locals res
app.use((req, res, next) => {
	res.locals.isAdmin = req.session.admin;
	// ambil total siswa berdasarkan jenis kelamin
	res.locals.totalPerempuan = req.totalCewek;
	res.locals.totalLaki = req.totalLaki;
	res.locals.totalGay = req.totalLgbt;
	// semua siswa
	res.locals.totalSiswa = req.totalSiswa;
	next();
});

//register routes
app.use('/admin', adminRoute);
app.use(authRoute);
app.use(daftarRoute);

//connecting to database
mongoose
	.connect('mongodb://localhost:27017/pendaftara')
	.then(() => {
		app.listen(7000);
		console.log('Connection established');
	})
	.catch(err => console.log(err));
