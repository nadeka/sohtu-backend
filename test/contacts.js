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

describe('Contacts', function() {

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

  describe("GET /contacts", function() {
    let url = 'http://localhost:8001/contacts';

    it('returns all contacts and status 200', function (done) {
      request.get({uri: url, json: true}, function(error, response, body) {
        let contacts = body;

        chai.expect(contacts.length).to.equal(3);
        chai.expect(response.statusCode).to.equal(200);

        contacts.forEach(contact => validateContact(contact));

        done();
      });
    });
  });

  describe('GET /contacts/id', function() {
    it('returns correct contact and status 200 when valid id is given', function (done) {
      let validUrl = "http://localhost:8001/contacts/1";

      request.get({uri: validUrl, json: true}, function(error, response, body) {
        let contact = body;

        validateContact(contact);
        chai.expect(contact.firstName).to.equal('Salli');
        chai.expect(contact.lastName).to.equal('Saarenpää');
        chai.expect(contact.email).to.equal('salli.saarenpää@gmail.com');
        chai.expect(contact.telephone).to.equal('0400 123 456');
        chai.expect(contact.gender).to.equal('Female');

        done();
      });
    });

    it("returns error 404 when invalid id is given", function (done) {
      let invalidUrl = "http://localhost:8001/contacts/asdasd";

      request.get({uri: invalidUrl, json: true}, function(error, response, body) {
        chai.expect(body.statusCode).to.equal(404);
        chai.expect(body.error).to.equal('Not Found');
        chai.expect(body.message).to.equal('Contact not found.');

        done();
      });
    });

    it("returns error 404 when given id does not exist", function (done) {
      let invalidUrl = "http://localhost:8001/contacts/999999";

      request.get({uri: invalidUrl, json: true}, function(error, response, body) {
        chai.expect(body.statusCode).to.equal(404);
        chai.expect(body.error).to.equal('Not Found');
        chai.expect(body.message).to.equal('Contact not found.');

        done();
      });
    });
  });

  describe("POST /contacts", function() {
    let url = "http://localhost:8001/contacts";

    it('creates new contact and returns status 200', function(done) {
      let validPostData = {
        firstName: 'Mikko-Pekka',
        lastName: 'Makkonen',
        email: 'mikko-pekka.makkonen@helsinki.fi',
        telephone: '040 5438 235',
        gender: 'Male'
      };

      request.post({uri: url, body: validPostData, json: true}, function(error, response, body) {
        let contact = body;
        validateContact(contact);
        chai.expect(contact.firstName).to.equal('Mikko-Pekka');
        chai.expect(contact.lastName).to.equal('Makkonen');
        chai.expect(contact.email).to.equal('mikko-pekka.makkonen@helsinki.fi');
        chai.expect(contact.telephone).to.equal('040 5438 235');
        chai.expect(contact.gender).to.equal('Male');
        chai.expect(response.statusCode).to.equal(200);

        request.get({uri: url, json: true}, function(error, response, body) {
          let contacts = body;

          chai.expect(contacts.length).to.equal(4);

          contacts.forEach(contact => validateContact(contact));

          done();
        });
      });
    });

    it('does not create new contact and returns status 400 when first name field is missing', function(done) {
      let invalidPostData = {
        lastName: 'Makkonen',
        email: 'mikko-pekka.makkonen@helsinki.fi',
        telephone: '040 5438 235',
        gender: 'Male'
      };

      request.post({uri: url, body: invalidPostData, json: true}, function(error, response, body) {
        chai.expect(body.statusCode).to.equal(400);
        chai.expect(body.error).to.equal('Bad Request');

        request.get({uri: url, json: true}, function(error, response, body) {
          let contacts = body;

          chai.expect(contacts.length).to.equal(3);

          contacts.forEach(contact => validateContact(contact));

          done();
        });
      });
    });
  });
});

function validateContact(contact) {
  chai.expect(contact.id).to.be.defined;
  chai.expect(contact.firstName).to.be.defined;
  chai.expect(contact.lastName).to.be.defined;
  chai.expect(contact.email).to.be.defined;
  chai.expect(contact.telephone).to.be.defined;
  chai.expect(contact.gender).to.be.defined;
}
