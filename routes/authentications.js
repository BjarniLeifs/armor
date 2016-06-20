var express = require('express');
var router = express.Router();

/* Definging postgressSQL module */
var pg = require('pg');
/* Definging configuration of database config */
var db = require('../../config/configuration');
/* Defining connectionstring for the database */
var connectionString = process.env.DATABASE_URL || db.connectionUrl;


var service = requrie('./../library/dbLibrary');
var dateService = requrie('./../library/dates');
var authService = require('./../library/users');

router.post('/register', function (req, res, next) {
	/* USERNAME should be lowerCASE! to ensure we get unique names at all times. */
	var resUser = [req.body.username];
	/* Getting salt and hash to put in database with user */
	var passObject = authService.setPassword(req.body.password);
	var returnMe = [];
	/* Defingin and looking for user with username before I can add to database.*/
	var table = 'users';
	var string = 'select * from ' + table +' WHERE username = ($1)';
	/* Calling for that user if exist it prompt the result else insert into database. */
	helper = service.queryStringValue(string,resUser, 
		function (err, result) {
			if (result.length < 1) {
				/* Defining the string to pass to helper for insert */
				var stringAdd = 'INSERT INTO users (username, name, email, hash, salt)';
					stringAdd +='  VALUES($1, $2, $3, $4, $5) returning *';
				//var auditid = jwttoken.decodeJWT(req);

				/* Defining values to insert */
				var value = [req.body.username, req.body.name, 
							req.body.email, passObject.hash, passObject.salt];
				/* Calling postService to add values with string constrains */
				addHelper = service.queryStringValue(stringAdd, value,
					function (err, results) {
						if (results) {
							return res.status(200).json({message: 'User added succesfully.'});
						} else {
							return res.status(400).json({message: 'Error adding user.'});
						}
					}
				);
			} else {
				for (var i = 0; i < result.length; i++){
					/* User was found, returning to user for his knowladge */
					if(result[i].username === req.body.username){
						return res.status(400).json({message: 'Username already exists, with email ' + result[i].email + '.'});
					}
				}
			}
		}
	);
});

/* Login is for everyone to access... */
router.post('/login', function (req, res, next) {
	if (!req.body.username || !req.body.password) {
		return res.status(400).json({message: 'Please fill out all fields!'});
	}
	var table = 'users';
	var string ='SELECT * FROM '+ table + ' WHERE UPPER(username) = UPPER($1)';
	var value = [req.body.username];
	helper = service.queryStringValue(string, value, function (err, result) {
		if (err) {
			return res.status(400).json({message: 'Error running query to '+ table});
		} else {
			if (result[0] !== undefined) {
				/* Check if user is active or not... if not he can not login. */
				if (result[0].isactive) {
					/* Check if password is valid. */
					if (authService.validPassword(req.body.password, result[0])) {
						return res.json({token: authService.generateJWT(result[0])});
					} else {
						res.status(422).json({message: 'Incorrect password'});
					}
				} else {
					res.status(422).json({message: 'This user is not active. Contact administrator'});
				}
			} else {
				res.status(400).json({message: 'No such user.'});
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

				var stringUpdate = 'UPDATE users SET reset_token = ($1), token_expired = ($2) WHERE id = ($3)';
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