'use strict';

var expect  = require('chai').expect;
var nock    = require('nock');
var Company = require('../')('k').Company;

describe('Company', function () {

  var mock;
  before(function () {
    mock = nock('https://company.clearbit.co');
  });
  after(nock.cleanAll);
  afterEach(function () {
    mock.done();
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

    it('can handle queued requests', function () {

      mock
        .get('/v1/companies/domain/uber.com')
        .reply(202, {
          error: {
            type: 'queued'
          }
        });
      return Company.find({domain: 'uber.com'})
        .to.be.rejectedWith(Company.QueuedError);
    });

    it('can handle unknown records', function () {
      mock
        .get('/v1/companies/domain/nonexistent.co')
        .reply(404, {
          error: {
            type: 'unknown_record'
          }
        });
      return expect(Company.find({domain: 'nonexistent.co'}))
        .to.be.rejectedWith(Company.NotFoundError);
    });

  });

});
