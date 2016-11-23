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

  describe("GET /mailing-lists", function() {
    let url = "http://localhost:8001/mailing-lists";

    it("returns all mailing lists and status 200", function (done) {
      request.get({uri: url, json: true}, function(error, response, body) {
        let mailingLists = body.mailingLists;

        chai.expect(mailingLists.length).to.equal(3);
        chai.expect(response.statusCode).to.equal(200);

        mailingLists.forEach(mailingList => validateMailingList(mailingList));

        done();
      });
    });
  });

  describe("GET /mailing-lists/id", function() {
    it("returns correct mailing list and status 200 when valid id is given", function (done) {
      let validUrl = "http://localhost:8001/mailing-lists/1";

      request.get({uri: validUrl, json: true}, function(error, response, body) {
        let mailingList = body.mailingList;

        validateMailingList(mailingList);
        chai.expect(mailingList.name).to.equal('List 1');
        chai.expect(mailingList.description).to.equal('Description 1');

        done();
      });
    });

    it("returns undefined mailing list and status 404 when invalid id is given", function (done) {
      let invalidUrl = "http://localhost:8001/mailing-lists/asdasd";

      request.get({uri: invalidUrl, json: true}, function(error, response, body) {
        let mailingList = body.mailingList;

        chai.expect(mailingList).to.be.undefined;
        chai.expect(body.statusCode).to.equal(404);

        done();
      });
    });

    it("returns undefined mailing list and status 404 when given id does not exist", function (done) {
      let invalidUrl = "http://localhost:8001/mailing-lists/999999";

      request.get({uri: invalidUrl, json: true}, function(error, response, body) {
        let mailingList = body.mailingList;

        chai.expect(mailingList).to.be.undefined;
        chai.expect(body.statusCode).to.equal(404);

        done();
      });
    });
  });

  describe("POST /mailing-lists", function() {
    let url = "http://localhost:8001/mailing-lists";

    it('creates new mailing list and returns status 200 when valid name is given', function(done) {
      let validPostData =
      { mailingList:
        { name: 'abcdefg',
          description: 'hijklmn'
        }
      };

      request.post({uri: url, body: validPostData, json: true}, function(error, response, body) {
        let mailingList = body.mailingList;
        validateMailingList(mailingList);
        chai.expect(mailingList.name).to.equal('abcdefg');
        chai.expect(mailingList.description).to.equal('hijklmn');
        chai.expect(response.statusCode).to.equal(200);

        request.get({uri: url, json: true}, function(error, response, body) {
          let mailingLists = body.mailingLists;

          chai.expect(mailingLists.length).to.equal(4);

          mailingLists.forEach(mailingList => validateMailingList(mailingList));

          done();
        });
      });
    });

    it('does not create new mailing list and returns status 400 when given name is empty', function(done) {
      let invalidPostData =
      { mailingList:
        { name: '',
          description: 'hijklmn'
        }
      };

      request.post({uri: url, body: invalidPostData, json: true}, function(error, response, body) {
        let mailingList = body.mailingList;
        chai.expect(mailingList).to.be.undefined;
        chai.expect(body.statusCode).to.equal(400);

        request.get({uri: url, json: true}, function(error, response, body) {
          let mailingLists = body.mailingLists;

          chai.expect(mailingLists.length).to.equal(3);

          mailingLists.forEach(mailingList => validateMailingList(mailingList));

          done();
        });
      });
    });

    it('does not create new mailing list and returns status 400 when given name is null', function(done) {
      let invalidPostData =
      { mailingList:
        { name: null,
          description: 'hijklmn'
        }
      };

      request.post({uri: url, body: invalidPostData, json: true}, function(error, response, body) {
        let mailingList = body.mailingList;
        chai.expect(mailingList).to.be.undefined;
        chai.expect(body.statusCode).to.equal(400);

        request.get({uri: url, json: true}, function(error, response, body) {
          let mailingLists = body.mailingLists;

          chai.expect(mailingLists.length).to.equal(3);

          mailingLists.forEach(mailingList => validateMailingList(mailingList));

          done();
        });
      });
    });

    it('does not create new mailing list and returns status 400 when description field is missing', function(done) {
      let invalidPostData =
      { mailingList:
        { name: 'abcdefg'
        }
      };

      request.post({uri: url, body: invalidPostData, json: true}, function(error, response, body) {
        let mailingList = body.mailingList;
        chai.expect(mailingList).to.be.undefined;
        chai.expect(body.statusCode).to.equal(400);

        request.get({uri: url, json: true}, function(error, response, body) {
          let mailingLists = body.mailingLists;

          chai.expect(mailingLists.length).to.equal(3);

          mailingLists.forEach(mailingList => validateMailingList(mailingList));

          done();
        });
      });
    });
  });
});

function validateMailingList(mailingList) {
  chai.expect(mailingList.id).to.be.defined;
  chai.expect(mailingList.name).to.be.defined;
}
