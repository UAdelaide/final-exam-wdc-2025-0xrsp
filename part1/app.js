var express = require('express');
var path = require('path');
var fs = require('fs').promises;
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql2/promise');
var api_router = require('./api_router.js')

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

(async () => {
	try {
		// Connect to MySQL without specifying a database
		const connection = await mysql.createConnection({
			host: 'localhost',
			user: 'root',
			password: '' // Set your MySQL root password
		});

		// Create the database if it doesn't exist
		await connection.query("DROP DATABASE IF EXISTS DogWalkService;");
		await connection.query("CREATE DATABASE DogWalkService;");
		await connection.end();

		// Now connect to the created database
		const db = await mysql.createConnection({
			host: 'localhost',
			user: 'root',
			password: '',
			database: 'DogWalkService',
			multipleStatements: true
		});

		app.locals.db = db;

		const sql = await fs.readFile('dogwalks.sql', 'utf8');
		await db.query(sql);

		const testdata = await fs.readFile('testdata.sql', 'utf8');
		await db.query(testdata);

	} catch (err) {
		console.error('Error setting up database. Ensure Mysql is running: service mysql start', err);
	}
})();


app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', api_router);

module.exports = app;