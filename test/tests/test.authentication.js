var request = require('supertest');
var authservice = require('../library/authentication');


describe('Checking Users API', function () {
  var server;
  var userToken;

  beforeEach(function () {
    server = require('../../app');
    userToken = authservice.getUserToken();
    
  });
  
  it('Should register user ', function testUserRegister (done) {
    var user = {
      'username' : 'test',
      'email' : 'test@test.is', 
      'password' : 'test'
    };

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