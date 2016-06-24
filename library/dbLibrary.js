
//let exports = module.exports = {};

let pg = require('pg');
/* Definging configuration of database config */
let config = require('./../config/configuration');
/* Defining connectionstring for the database */
let connectionString = process.env.DATABASE_URL ||  config.connectionUrl;

/* Query to get all */
exports.queryString = function (string, cb) {

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
			results.push(row);
			//console.log(row);
		});

		/* close connection */
		query.on('end', function () {
			if (err) {
				done();
				return cb(err, null);
			} else {
				done();
				//console.log("done " + results);
				return cb(err,results);
			}
		});
	});
};
/* Query to get all with an value */
exports.queryStringValue = function (string, value, cb) {

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
			//console.log(row);
		});

		/* close connection */
		query.on('end', function () {
			if (err) {
				done();
				return cb(err, null);
			} else {
				done();
				//console.log("done " + results);
				return cb(err,results);
			}
		});
	});

};