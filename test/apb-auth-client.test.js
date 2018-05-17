const AuthClient = require('../lib/apb-auth-client');
const assert = require('assert');
//const nock = require('nock');
const loginResponse = require('./login-response');

describe('AuthClient', function() {

  describe('#storeToken()', function(){
    it('should store the token in localstorage', function(done){
      var auth = new AuthClient("https://client.com", false);
      auth.storeToken("testToken");
      assert.equal(localStorage.getItem("AuthClientJWTtoken"), "testToken");
      done();
    });
  });

  describe('#login()', function() {
    beforeEach(() => {
      //TODO: mock http requests
      // Nock will only work on Node - not the browser :(


    });
    it('should pass.', function(done) {
      assert.equal("true", "true");
      done();
    });



    it('should resolve if the request is good.', function(done) {
      var auth = new AuthClient("https://client.com", false);
      auth.login("/loginsuccess", "user","pass")
        .then(function(data){
          assert.equal(data.user.username, "user");
          assert.ok(data.token);
          done();
        })
        .catch(function(err){
          console.log(err);
          done(Error("Rejected when should have resolved."));
        });
    });
    it('should reject if the request is bad.', function(done) {
      var auth = new AuthClient("https://client.com", false);
      auth.login("/loginfail", "user","pass")
        .then(function(data){
          done(Error("Resoved when should have rejected."));
        })
        .catch(function(err){
          console.log(err)
          assert.equal(err.error, "login failed");
          done();
        });
    });
  });
});
