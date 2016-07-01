var exports = module.exports = {};

var request = require('supertest');
const authService = require('./../../library/authentication');
const userService = require('./../../library/users');
const testDataService = require('./../../data/test/testauthentication');

var http = require('http');

exports.loadData = () => {
	testDataService.addUsers();
};

exports.getUserInfo = (username) => {
	"use strict";
	userService.usernameInfo(username, (err, result) => {
		if (err)
			return err;

		console.log(result);
		return result;
	});
	
};

