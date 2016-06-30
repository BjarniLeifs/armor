const jwt = require('jsonwebtoken');
const service = require('./../library/dbLibrary');

exports.usernameInfo = (username, cb) => {
	"use strict";
	let string = 'select * from users where username = ($1)';
	let value = [username];

	service.queryStringValueUser(string, value, (err, results) => {
		if (err)
			return cb(err);
		else  
			return cb(results);
	});
};