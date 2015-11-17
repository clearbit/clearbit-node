'use strict';

var expect     = require('chai').use(require('chai-as-promised')).expect;
var nock       = require('nock');
var Enrichment = require('../')('k').Enrichment;

describe('Enrichment', function () {

  var person_mock, company_mock;
  before(function () {
    person_mock = nock('https://person.clearbit.com');
    company_mock = nock('https://company.clearbit.com');
  });
  after(nock.cleanAll);
  afterEach(function () {
    person_mock.done();
    company_mock.done();
  });

  var alex = require('./fixtures/person');
  var company = require('./fixtures/company');

  describe('Enrichment#find', function () {

    it('can find a person by email', function () {
      person_mock
        .get('/v2/combined/find?email=alex%40alexmaccaw.com')
        .reply(200, {
          person: alex,
          company: company
        });
      return Enrichment.find({email: 'alex@alexmaccaw.com'})
        .then(function (personCompany) {
          expect(personCompany)
            .to.be.an.instanceOf(Enrichment)
            .and.have.include.keys('person', 'company')
            .and.have.deep.property('person.id', alex.id);
        });
    });

    it('can find a company by domain', function () {
      company_mock
        .get('/v2/companies/find?domain=uber.com')
        .reply(200, company);
      return Enrichment.find({domain: 'uber.com'})
        .then(function (company) {
          expect(company)
            .to.be.an.instanceOf(Enrichment.Company)
            .and.have.property('id', company.id);
        });
    });

    it('can handle queued requests', function () {
      person_mock
        .get('/v2/combined/find?email=alex%40alexmaccaw.com')
        .reply(202, {
          error: {
            type: 'queued'
          }
        });
      return expect(Enrichment.find({email: 'alex@alexmaccaw.com'}))
        .to.be.rejectedWith(Enrichment.QueuedError);
    });
  });
});
