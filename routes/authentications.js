var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
/* Definging postgressSQL module */
var pg = require('pg');
/* Definging configuration of database config */
var config = require('./../config/configuration');
/* Defining connectionstring for the database */
var connectionString = process.env.DATABASE_URL || config.connectionUrl;


var service  	= require('./../library/dbLibrary');
var dateService = require('./../library/dates');
var authService = require('./../library/users');

//Just for development
/*
router.get('/users', function (req, res, next) {
	var table = 'users';
	var string = 'SELECT * FROM ' +table;
	helper = service.queryString(string, function (err, result) {
		if (result) {
			return res.status(200).json(result);
		} else {
			return res.status(400).json({message: 'Error running query to '+ table});
		}
	});
	
});
*/

/* function register for registering new users */
router.post('/register', function (req, res, next) {
	/* USERNAME should be lowerCASE! to ensure we get unique names at all times. */
	var resUser = [req.body.username];
	/* Getting salt and hash to put in database with user */
	var hash = authService.setPassword(req.body.password);
	var returnMe = [];
	/* Defining and looking for user with username before I can add to database.*/
	var table = 'users';
	var string = 'select * from ' + table +' WHERE username = ($1)';
	//Calling for that user if exist it prompt the result else insert into database. 
	service.queryStringValue(string, resUser, 
		function (err, result) {
			if (result.length < 1) {
				authService.register(req, function (results) {
					if (!results) {
						return res.status(400).json({message: 'Error adding user.'});
					} else {
						return res.status(200).json({message: 'User added succesfully.'});
					}
				});
			} else {
				// User was found, returning to user for his knowladge
				return res.status(400).json({message: 'Username already exists.'});	
			}
		}
	);
});

/* function login checks if username is in the database and then authenticates password */
router.post('/login', function (req, res, next) {
	if (!req.body.username || !req.body.password) {
		return res.status(400).json({message: 'Please fill out all fields!'});
	}
	var table = 'users';
	var string ='SELECT * FROM '+ table + ' WHERE UPPER(username) = UPPER($1)';
	var value = [req.body.username];
	service.queryStringValue(string, value, function (err, result) {
		if (err) {
			return res.status(400).json({message: 'Error running query to '+ table});
		} else {
			if (result[0] !== undefined) {
				// Check password agains salt
				authService.validPassword(req.body.password, result[0], function (callBack){
					if (callBack) {
						return res.status(200).json({token: authService.generateJWT(result[0])});
					}  else {
						return res.status(422).json({message: 'Incorrect password'});
					}
				});
			} else {
				return res.status(400).json({message: 'No such user.'});
			}
		}
	});
});

/* Sends e-mail to user if requested of forgotten password with token */
router.post('/forgotPassword', function (req, res, next) {
	if (!req.body.email) {
		return res.status(400).json({message: 'Please fill out your email!'});
	}
	var table = 'users';
	var string ='SELECT * FROM '+ table + ' WHERE email = ($1)';
	var value = [req.body.email];

	helper = service.queryStringValue(string, value, function (err, result) {
		if (err) {
			return res.status(400).json({message: 'Error running query to '+ table});
		} else {
			var objectResult = result[0];
			if (objectResult.email === req.body.email) {

				var newToken = {
					token 	 	: authService.generateResetJWT(objectResult),
					tokenExpire : dateService.dateAddMin(60)
				};

				var stringUpdate = 'UPDATE users SET resettoken = ($1), tokenexpired = ($2) WHERE id = ($3)';
				var valueUpdate = [newToken.token, newToken.tokenExpire, objectResult.id];
				
				var update = service.queryStringValue(stringUpdate, valueUpdate, function (err, result) {
					if (err) {
						return res.status(400).json({message: 'Error running query'});
					} else {
						authService.sendResetPassEmail(objectResult, newToken, req, function (err) {
							if (err) {
								return res.status(400).json({message: 'Error when sending mail.'});
							} 
						});
						return res.status(200).json({message: 'E-mail sent to user'});
					}
				});

			} else {	
				return res.status(404).json({message: 'No such email, contact administrator'});
			}
		}
	});
});	
/* Get token from users after e-mail was sent to check if the right user, then okei to reset password */
router.post('/reset/:token', function (req, res, next) {

	var token = req.params.token;
	if (!token) {
		return res.status(400).json({message: 'Please provide token'});
	}
	if (!req.body.password || !req.body.confirmPassword) {
		return res.status(400).json({message: 'Please fill out both password fields.'});
	}
	if (req.body.password === req.body.confirmPassword) {
		var results = {};
		pg.connect(connectionString, function (err, client, done) {
			if (err) {
				done(err);
				return res.status(400).json({message: 'error fetching client from pool'});
			}

			
			/* SQL Query, select data */
			var query = client.query('SELECT * FROM users WHERE reset_token = ($1)', [token],
				function (err, result) {
					done();
				}
			);
			/* Stream results back */ 
			query.on('row', function (row) {
				results = {
					id 		 	: row.id,
					username 	: row.username,
					email 	 	: row.email,
					name 	 	: row.name,
					tokenExpire : row.token_expired,
					token 		: row.reset_token
				};

			});
			/* close connection */
			query.on('end', function () {		
				var today = dateService.dateAddMin(0);

				if (err) {
					done();
					return res.status(400).json({message: 'Error running query'});
				} else {
					if (results.token === token) {
						if (today <= results.tokenExpire) {
							var passObject = authService.setPassword(req.body.password);
							
							client.query('UPDATE users SET reset_token = ($1), token_expired = ($2), hash = ($3), salt = ($4) WHERE id = ($5) ', 
								[null, null, passObject.hash, passObject.salt ,results.id], 
								function (err, result) {
									if (err) {
										done(err);
										return res.status(400).json({message: 'Erorr updating password.'});
									}
									done();
								}
							);
							authService.confirmPassReset(results, req);
							res.status(200).json({message: 'Confirmation E-mail sent to user about password is updated.'});	
						} else {
							done();
							res.status(404).json({message: 'Token has expired.'});
						}

					} else {
						done();
						res.status(404).json({message: 'Invalid token'});
					}
				}
				
			});

		});
	} else {
		return res.status(400).json({message: 'Password did not match.'});
	} 
	
});


module.exports = router;