var exports = module.exports = {};

var request = require('supertest');
var users = require('../../library/users');

var http = require('http');


exports.getUserToken = function () {
	var object = {
		id: 1,
		username: 'bjarni',
		password: 'bjarni',
	};

	return users.generateJWT(object);
};