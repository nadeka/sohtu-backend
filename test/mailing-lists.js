'use strict';

// We use a different database and server port in tests so the test
// environment is completely separated from the dev environment
process.env.NODE_ENV = 'test';
process.env.PORT = '8001';

let server = require('../server');
let bookshelf = require('../config/bookshelf');

// Chai is used for making assertions
//
// Check: http://chaijs.com/
let chai = require('chai');

// Request is used for making HTTP requests
//
// Check: https://github.com/request/request
let request = require('request');

describe("Mailing lists", function() {

  // Run migrations and insert seeds before tests
  before(function (done) {
    bookshelf.knex.migrate.latest().then(function () {
      bookshelf.knex.seed.run().then(function () {
        done();
      });
    });
  });

  // Clean the mailing_lists table after tests
  after(function (done) {
    bookshelf.knex('mailing_lists').truncate().then(function () {
      done();
    });
  });

  describe("GET /mailing-lists", function() {

    let url = "http://localhost:8001/mailing-lists";

    it("returns status code 200", function(done) {
      request.get({uri: url, json: true}, function(error, response, body) {
        chai.expect(response.statusCode).to.equal(200);
        done();
      });
    });

    it("returns all mailing lists", function(done) {
      request.get({uri: url, json: true}, function(error, response, body) {
        let mailingLists = body.mailingLists;

        chai.expect(mailingLists.length).to.equal(2);

        mailingLists.forEach(mailingList => validateMailingList(mailingList));

        done();
      });
    });
  });

  describe("GET /mailing-lists/id", function() {

  });

  describe("POST /mailing-lists", function() {

  });
});

function validateMailingList(mailingList) {
  chai.expect(mailingList.id).to.be.defined;
  chai.expect(mailingList.name).to.be.defined;
}