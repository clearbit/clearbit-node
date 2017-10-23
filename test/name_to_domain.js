'use strict';

var expect       = require('chai').use(require('chai-as-promised')).expect;
var nock         = require('nock');
var NameToDomain = require('../')('k').NameToDomain;

describe('NameToDomain', function () {

  var mock;
  before(function () {
    mock = nock('https://company.clearbit.com');
  });
  after(nock.cleanAll);
  afterEach(function () {
    mock.done();
  });

  var data = require('./fixtures/name_to_domain');

  describe('NameToDomain#find', function () {

    it('can find a domain by name', function () {
      mock
        .get('/v1/domains/find?name=Uber')
        .reply(200, data);
      return NameToDomain.find({name: 'Uber'})
        .then(function (response) {
          expect(response)
            .and.have.property('domain', data.domain);
        });
    });
  });
});
