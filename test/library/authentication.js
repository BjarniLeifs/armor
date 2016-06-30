var exports = module.exports = {};

var request = require('supertest');
const authService = require('./../../library/authentication');
const userService = require('./../../library/users');

var http = require('http');

exports.getUserInfo = function (username) {
	"use strict";
	userService.usernameInfo(username, function (err, result) {
		if (err)
			return err;

		console.log(result);
		return result;
	});
	
};

exports.getUserToken = function () {
	"use strict";
	var object = {
		username: 'bjarni',
		password: 'bjarni',
	};

	return users.generateJWT(object);
};