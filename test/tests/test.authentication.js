var request     = require('supertest');
var authservice = require('../library/authentication');


describe('Checking Authentication', function () {
  var server, userToken, user, failuser, registeruser; 
  before(function () { 
    process.env.NODE_ENV = 'testing';
    server = require('../../app');
    userToken = authservice.getUserToken();
    registeruser = {
      'username' : 'register',
      'name'     : 'register',
      'email'    : 'test@test.is', 
      'password' : 'testing'
    };  
    user ={
      'username' : 'test',
      'name'     : 'test',
      'email'    : 'test@armor.is', 
      'password' : 'test'
    };

    failUser = {
      'username' : 'test',
      'name'     : 'test',
      'email'    : 'test@armor.is', 
      'password' : 'wrong'
    };
  });

  after(function() {
    process.env.NODE_ENV = 'development';
  });
  
  it('Should register user', function testUserRegister (done) {
    request(server)
      .post('/auth/register')
      .send(registeruser)
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
      .send(failUser)
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