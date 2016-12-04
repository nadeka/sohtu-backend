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

describe('Email campaigns', function() {

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

  describe("POST /email-campaigns", function() {
    let url = "http://localhost:8001/email-campaigns";

    it('creates new email-campaign and returns status 200', function(done) {
      let validPostData = {
        name: 'AutumnOctober2016',
        subject: 'Autumn Sale!',
        mailingLists: [1, 2, 3],
        template: '1',
        content: '<h1>',
        schedule: '2018-11-24T09:30:50.621Z',
        status: 'pending'
      };

      request.post({uri: url, body: validPostData, json: true}, function(error, response, body) {
        let emailCampaign = body;
        validateEmailCampaign(emailCampaign);
        chai.expect(emailCampaign.name).to.equal('AutumnOctober2016');
        chai.expect(emailCampaign.subject).to.equal('Autumn Sale!');
        chai.expect(emailCampaign.mailingLists.length).to.equal(3);
        chai.expect(emailCampaign.mailingLists[0].id).to.equal(1);
        chai.expect(emailCampaign.mailingLists[1].id).to.equal(2);
        chai.expect(emailCampaign.mailingLists[2].id).to.equal(3);
        chai.expect(emailCampaign.content).to.equal('<h1>');
        chai.expect(emailCampaign.schedule).to.equal('2018-11-24T09:30:50.621Z');
        chai.expect(response.statusCode).to.equal(200);
        done();
      });

    });

    it('does not create new email campaign and returns status 400 when name field is missing', function(done) {
      let invalidPostData = {
        subject: 'Autumn Sale!',
        mailingLists: [1, 2, 3],
        template: '1',
        content: '<h1>',
        schedule: '2016-11-24T09:30:50.621Z'
      };

      request.post({uri: url, body: invalidPostData, json: true}, function(error, response, body) {
        chai.expect(body.statusCode).to.equal(400);
        chai.expect(body.error).to.equal('Bad Request');
        done();
      });
    });
  });

});

function validateEmailCampaign(emailCampaign) {
  chai.expect(emailCampaign.id).to.be.defined;
  chai.expect(emailCampaign.templateId).to.be.defined;
  chai.expect(emailCampaign.name).to.be.defined;
  chai.expect(emailCampaign.subject).to.be.defined;
  chai.expect(emailCampaign.content).to.be.defined;
  chai.expect(emailCampaign.mailingLists).to.be.defined;
  chai.expect(emailCampaign.schedule).to.be.defined;
  chai.expect(emailCampaign.status).to.be.defined;
}
