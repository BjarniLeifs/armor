const express = require('express');
const router = express.Router();
/* Definging postgressSQL module */
const pg = require('pg');
/* Definging configuration of database config */
const config = require('./../config/configuration');
/* Defining connectionstring for the database */
const connectionString = process.env.DATABASE_URL || config.connectionUrl;


const service  	= require('./../library/dbLibrary');
const dateService = require('./../library/dates');
const authService = require('./../library/users');


/* GET users listing. */
router.get('/users/users', function (req, res, next) {
	"use strict";
	let table = 'users';
	let string = 'SELECT * FROM ' +table;
	service.queryStringUser(string, function (err, result) {
		if (result) {
			return res.status(200).json(result);
		} else {
			return res.status(400).json({message: 'Error running query to '+ table});
		}
	});
	
});



/* Delete user, this is only for the user himself, if not the same then nothing happens*/
router.post('/users/deleteUser', function (req, res, next) {
	if(!req.body.id) {
		return res.status(400).json({messgae : 'You have to provide id of user'});
	}
	if (req.body.id == req.payload.id) {
		let string = 'DELETE FROM users where id = ($1)';
		let value = [token.id];
		service.queryStringValue(string, value, function (err, result) {
			if (err) {
				return res.status(400).json({message: 'Error running query to '+ table});
			} else {
				return res.status(200).json({message: 'Successfully deleted user'});
			}
		});
	} else {
		return res.status(401).json({message : 'You are not authorized'});
	}
 
});

module.exports = router;
