'use strict';

var expect     = require('chai').expect;
var nock       = require('nock');
var Prospector = require('../')('k').Prospector;

describe('Prospector', function () {
  var mock;

  before(function () {
    mock = nock('https://prospector.clearbit.com');
  });

  after(nock.cleanAll);

  afterEach(function () {
    mock.done();
  });

  describe('Prospector.search', function () {
    var domain = 'clearbit.com';

    it('can find people by domain', function () {
      var response = { page: 1, page_size: 5, total: 0, results: [] };

      mock
        .get('/v2/people/search?domain=' + domain)
        .reply(200, response);

      return Prospector.search({ domain: domain })
        .then(function (response) {
          expect(response.page).to.eq(1);
          expect(response.total).to.eq(0);
          expect(response.results).to.be.instanceof(Array).and.be.empty;
          expect(response.page_size).to.eq(5);
        });
    });

    it('can page through records', function () {
      var response = { page: 2, page_size: 10, total: 0, results: [] };

      mock
        .get('/v2/people/search?domain=' + domain + '&page=2&page_size=10')
        .reply(200, response);

      return Prospector.search({ domain: domain, page: 2, page_size: 10 })
        .then(function (response) {
          expect(response.page).to.eq(2);
          expect(response.page_size).to.eq(10);
        });
    });
  });

  describe('Prospector#getEmail', function () {
    var id       = 'e_1234',
        response = { email: 'tristan@clearbit.com' };

    it('can find an e-mail by ID', function () {
      mock
        .get('/v2/people/' + id + '/email')
        .reply(200, response);

      return new Prospector({ id: id }).getEmail()
        .then(function (email) {
          expect(email).to.eq(response.email);
        });
    });
  });

  describe('Prospector#getVerified', function () {
    var id       = 'e_1234',
        response = { verified: true };

    it('can find an e-mail by ID', function () {
      mock
        .get('/v2/people/' + id + '/email')
        .reply(200, response);

      return new Prospector({ id: id }).getVerified()
        .then(function (verified) {
          expect(verified).to.eq(true);
        });
    });
  });
});
