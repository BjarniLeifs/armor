const jwt = require('jsonwebtoken');
const service = require('./../library/dbLibrary');

exports.usernameInfo = function (username, cb) {
	"use strict";
	let string = 'select * from users where username = ($1)';
	let value = [username];

	service.queryStringValueUser(string, value, function (err, results) {
		if (err)
			return cb(err, false);
		if (results) {
			return cb(false, results);
		} else {
			return cb(false, false);
		}

	});
};