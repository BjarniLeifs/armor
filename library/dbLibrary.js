
//let exports = module.exports = {};

const pg = require('pg');
/* Definging configuration of database config */
const config = require('./../config/configuration');
/* Defining connectionstring for the database */
const connectionString = process.env.DATABASE_URL ||  config.connectionUrl;


/* This gets all only for users, this is to exlude hash and other personal info from the object*/
exports.queryStringUser = function (string, cb) {
	"use strict";
	let results = [];	
		
	pg.connect(connectionString, function (err, client, done) {
		if (err) {
			done(err);
			return cb(err, null);
		}

		/* SQL Query, select data */
		let query = client.query(string,
			function (err, result) {
        		done();
    		}
    	);
		/* Stream results back */
		query.on('row', function (row) {
			let object = {
				id : row.id,
				name : row.name,
				email : row.email,
				username : row.username
			};
			results.push(object);
		});

		/* close connection */
		query.on('end', function () {
			if (err) {
				done();
				return cb(err, null);
			} else {
				done();
				return cb(err,results);
			}
		});
	});
};
/* Query to get all */
exports.queryString = function (string, cb) {
	"use strict";
	let results = [];	
		
	pg.connect(connectionString, function (err, client, done) {
		if (err) {
			done(err);
			return cb(err, null);
		}

		/* SQL Query, select data */
		let query = client.query(string,
			function (err, result) {
        		done();
    		}
    	);
		/* Stream results back */
		query.on('row', function (row) {
			let object = {
				id : row.id,
				name : row.name,
				email : row.email,
				username : row.username
			};
			results.push(object);
		});

		/* close connection */
		query.on('end', function () {
			if (err) {
				done();
				return cb(err, null);
			} else {
				done();
				return cb(err,results);
			}
		});
	});
};

/* USER only, this is to exclude information from user table that are personal and sensitive! */
exports.queryStringValueUser = function (string, value, cb) {
	"use strict";
	let results = [];	
		
	pg.connect(connectionString, function (err, client, done) {
		if (err) {
			done(err);
			return cb(err, null);
		}

		/* SQL Query, select data */
		let query = client.query(string, value,
			function (err, result) {
        		done();
    		}
    	);
		/* Stream results back */
		query.on('row', function (row) {
			results.push(row);
		});

		/* close connection */
		query.on('end', function () {
			if (err) {
				done();
				return cb(err, null);
			} else {
				done();
				return cb(err,results);
			}
		});
	});

};

/* Query to get all with an value */
exports.queryStringValue = function (string, value, cb) {
	"use strict";
	let results = [];	
		
	pg.connect(connectionString, function (err, client, done) {
		if (err) {
			done(err);
			return cb(err, null);
		}

		/* SQL Query, select data */
		let query = client.query(string, value,
			function (err, result) {
        		done();
    		}
    	);
		/* Stream results back */
		query.on('row', function (row) {
			results.push(row);
		});

		/* close connection */
		query.on('end', function () {
			if (err) {
				done();
				return cb(err, null);
			} else {
				done();
				return cb(err,results);
			}
		});
	});

};