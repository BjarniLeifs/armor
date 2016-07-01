/* 
	Here we create a new instance of Client to interact with the database and then establish
	communication with it via the connect(). We then set run a SQL query via the query()
	method. Communication is closed via the end(). Be sure to check out the documentation 
	at : https://github.com/brianc/node-postgres/wiki/Client
*/
/* Definging postgressSQL module */
var pg = require('pg');
const config = require('./../../config/configuration');
/* Defining connectionstring for the database */
const connectionString = process.env.DATABASE_URL || config.addTestUserUrl;
const bcrypt = require('bcryptjs');

var user1 = {
	username  		: 'remove1',
	name 			: 'remove1',
	email	   		: 'remove1@armor.is',
	password 		: 'remove1'
};
var user2 = {
	username  		: 'remove2',
	name 			: 'remove2',
	email	   		: 'remove2@armor.is',
	password 		: 'remove2'
};

exports.addUsers = () => {
	register(user1);
	register(user2);

	console.log("-------------------------------------");
	console.log("|  Test data successfully executed  |");
	console.log("-------------------------------------");
}

/* register new user */
function register (req) {
	"use strict";
	bcrypt.genSalt(10, (err, salt) => {
	    bcrypt.hash(req.password, salt, (err, hash) => {
			let stringAdd = 'INSERT INTO users (username, name, email, hash)';
				stringAdd +='  VALUES($1, $2, $3, $4) returning *';
				// Defining values to insert 
			let value = [req.username, req.name, req.email, hash];	
			
			pg.connect(connectionString, (err, client, done) => {
				if (err) {
					done(err);
					console.log("Error from database " + err);
					process.exit();
				}

				/* SQL Query, select data */
				let query = client.query(stringAdd, value,
					(err, result) => {
		        		done();

		    		}
		    	);
				/* Stream results back */
				query.on('row', (row) => {
				});

				/* close connection */
				query.on('end', () => {
					if (err) {
						done();
						console.log("Error from database" + err);
					} else {
						done();
					}
					process.exit();
				});
			});
   		});
	});	
}




