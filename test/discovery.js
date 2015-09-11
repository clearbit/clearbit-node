'use strict';

var expect     = require('chai').use(require('chai-as-promised')).expect;
var nock       = require('nock');
var Discovery  = require('../')('k').Discovery;

describe('Discovery', function () {

  var mock;
  before(function () {
    mock = nock('https://discovery.clearbit.com');
  });
  after(nock.cleanAll);
  afterEach(function () {
    mock.done();
  });

  var fixtures = require('./fixtures/discovery');

  describe('Discovery#search', function () {

    it('can search for companies', function () {
      mock
        .post('/v1/companies/search')
        .reply(200, fixtures);
      return Discovery.search({query: {name: 'uber'}})
        .then(function (result) {
          expect(result.results)
            .to.deep.equal(fixtures.results);
        });
    });

  });

});
