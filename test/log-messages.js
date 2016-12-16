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

describe('Log messages', function() {

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

  describe('GET /log-messages', function() {
    let url = "http://localhost:8001/log-messages";

    it('returns all log messages and status 200', function (done) {
      request.get({uri: url, json: true}, function(error, response, body) {
        let logMessages = body;

        chai.expect(response.statusCode).to.equal(200);

        logMessages.forEach(logMessage => validateLogMessage(logMessage));

        done();
      });
    });

    it('creates a new error log message when query parameter is invalid', function (done) {
      let invalidUrl = "http://localhost:8001/contacts/null";
      let logUrl = "http://localhost:8001/log-messages";

      request.get({uri: invalidUrl, json: true}, function(error, response, body) {
        chai.expect(body.statusCode).to.equal(404);
        chai.expect(body.error).to.equal('Not Found');
        chai.expect(body.message).to.equal('Contact not found.');

        request.get({uri: logUrl, json: true}, function(error, response, body) {
          let logMessages = body;

          chai.expect(logMessages.length).to.equal(1);
          chai.expect(logMessages[0].level).to.equal('error');
          chai.expect(response.statusCode).to.equal(200);

          validateLogMessage(logMessages[0]);

          done();
        });
      });
    });

    it('creates a new error log message when contact cannot be created', function (done) {
      let invalidPostData = {
        lastName: 'Makkonen',
        email: 'mikko-pekka.makkonen@helsinki.fi',
        telephone: '040 5438 235',
        gender: 'Male'
      };

      let invalidUrl = "http://localhost:8001/contacts";
      let logUrl = "http://localhost:8001/log-messages";

      request.post({uri: invalidUrl, body: invalidPostData, json: true}, function(error, response, body) {
        chai.expect(body.statusCode).to.equal(400);
        chai.expect(body.error).to.equal('Bad Request');
        chai.expect(body.message).to.equal('Invalid payload data.');

        request.get({uri: logUrl, json: true}, function(error, response, body) {
          let logMessages = body;

          chai.expect(logMessages.length).to.equal(1);
          chai.expect(logMessages[0].level).to.equal('error');
          chai.expect(response.statusCode).to.equal(200);

          validateLogMessage(logMessages[0]);

          done();
        });
      });
    });
  });

  describe("POST /log-messages", function() {
    let url = "http://localhost:8001/log-messages";

    it('creates new log message and returns status 200', function(done) {
      let validPostData = {
        level: 'error',
        msg: 'Error occurred',
        meta: {origin: 'front-end'}
      };

      request.post({uri: url, body: validPostData, json: true}, function(error, response, body) {
        chai.expect(response.statusCode).to.equal(200);
        chai.expect(response.body).to.equal('Saved new log message');

        request.get({uri: url, json: true}, function(error, response, body) {
          let logMessages = body;

          chai.expect(logMessages.length).to.equal(1);

          logMessages.forEach(logMessage => validateLogMessage(logMessage));

          done();
        });
      });
    });

    it('does not create new log message and returns status 400 when msg field is missing', function(done) {
      let invalidPostData = {
        level: 'error',
        meta: {origin: 'front-end'}
      };

      request.post({uri: url, body: invalidPostData, json: true}, function(error, response, body) {
        chai.expect(body.statusCode).to.equal(400);
        chai.expect(body.error).to.equal('Bad Request');

        request.get({uri: url, json: true}, function(error, response, body) {
          let logMessages = body;

          chai.expect(logMessages.length).to.equal(1);

          done();
        });
      });
    });
  });
});

function validateLogMessage(logMessage) {
  chai.expect(logMessage.id).to.be.defined;
  chai.expect(logMessage.level).to.be.defined;
  chai.expect(logMessage.msg).to.be.defined;
  chai.expect(logMessage.meta).to.be.defined;
  chai.expect(logMessage.meta).to.be.an('object');
}
