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

describe("Templates", function() {

  // Run migrations and insert seeds before each test
  beforeEach(function(done) {
    bookshelf.knex.migrate.rollback()
      .then(function() {
        bookshelf.knex.migrate.latest()
          .then(function() {
            return bookshelf.knex.seed.run()
              .then(function() {
                done();
              });
          });
      });
  });

  // Rollback migrations after each test
  afterEach(function (done) {
    bookshelf.knex.migrate.rollback()
      .then(function() {
        done();
      });
  });

  describe("GET /templates", function() {
    let url = "http://localhost:8001/templates";

    it("returns all templates and status 200", function (done) {
      request.get({uri: url, json: true}, function(error, response, body) {
        let templates = body;

        chai.expect(templates.length).to.equal(4);
        chai.expect(response.statusCode).to.equal(200);

        templates.forEach(template => validateTemplate(template));

        done();
      });
    });
  });
});

function validateTemplate(template) {
  chai.expect(template.id).to.be.defined;
  chai.expect(template.name).to.be.defined;
}
