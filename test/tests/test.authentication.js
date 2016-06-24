var request     = require('supertest');
var authservice = require('../library/authentication');
var config      = require('./../../config/configuration');

describe('Checking Authentication', function () {
  var server, userToken, user, failuser; 

  beforeEach(function () {
    server = require('../../app');
    server.set('DATABASE_URL', config.testConnectionUrl);

    userToken = authservice.getUserToken();
    user = {
      'username' : 'test',
      'email' : 'test@test.is', 
      'password' : 'test'
    };  
    failUse = {
      'username' : 'test',
      'email' : 'test@test.is', 
      'password' : 'tesst'
    };
  });

  afterEach(function() {
    server.set('DATABASE_URL', config.connectionUrl);
  });
  
  it('Should register user', function testUserRegister (done) {
    request(server)
      .post('/auth/register')
      .send(user)
      .expect(200)
      .end(function (err, ress) {
        if (err) {
          done(err);
        } 
      });

      done();
  });
  
  it('Should login user', function testUserLogin (done) {

    request(server)
      .post('/auth/login')
      .send(user)
      .expect(200)
      .end(function (err, ress) {
        if (err)
          done(err);
      });
      done();
  });

  it('Should fail login user', function testUserLogin (done) {
    request(server)
      .post('/auth/login')
      .send(failuser)
      .expect(400)
      .end(function (err, ress) {
        if (err)
          done(err);
      });
      done();
  });

/* // how to use auth on closed calls
  it('Should get all users ', function testGetAllUsers (done) {
    request(server)
      .get('/api/getAllUsers')
      .set('Authorization', 'Bearer ' + adminToken )
      .expect(200)
      .end(function (err, ress) {
        if (err) {
          done(err);
        } 
      });
      done();
  });
*/

 


});