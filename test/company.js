'use strict';

var expect = require('chai').expect;
var nock   = require('nock');
var Client = require('../src/client');

describe('Company', function () {

  var client = new Client({key: 'k'});
  var Company = require('../src/company')(client);

  var mock;
  before(function () {
    mock = nock('https://company.clearbit.co');
  });
  after(nock.cleanAll);
  afterEach(function () {
    mock.done();
  });

  describe('#pending', function () {

    it('identifies whether the company has an id', function () {
      var company = new Company();
      expect(company.pending()).to.be.true;
      company.id = 'foo';
      expect(company.pending()).to.be.false;
    });

  });

  describe('Company#find', function () {

    var company = require('./fixtures/company');

    it('can find a company by domain', function () {
      mock
        .get('/v1/companies/domain/uber.com')
        .reply(200, company);
      return Company.find({domain: 'uber.com'})
        .then(function (company) {
          expect(company)
            .to.be.an.instanceOf(Company)
            .and.have.property('id', company.id);
        });
    });

    it('is can handle pending requests', function () {
      mock
        .get('/v1/companies/domain/uber.com')
        .reply(202);
      return Company.find({domain: 'uber.com'})
        .then(function (company) {
          expect(company.pending()).to.be.true;
        });
    });

  });

});
