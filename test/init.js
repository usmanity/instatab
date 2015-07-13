var mocha = require("mocha");
var assert = require("chai").assert;
var config = require("../config.json");

describe("constants", function() {
  describe("client_id", function() {
    it("should have a client_id", function() {
      assert.ok("client_id", config.dev.client_id);
    });
  });
  describe("redirect_uri", function(){
    it("should have a redirect_uri", function(){
      assert.ok("redirect_uri", config.dev.redirect_uri)
    })
  });
});
