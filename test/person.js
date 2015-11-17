'use strict';

var expect     = require('chai').use(require('chai-as-promised')).expect;
var nock       = require('nock');
var Person     = require('../')('k').Person;
var Enrichment = require('../')('k').Enrichment;

describe('Person', function () {

  var mock;
  before(function () {
    mock = nock('https://person.clearbit.com');
  });
  after(nock.cleanAll);
  afterEach(function () {
    mock.done();
  });

  var alex = require('./fixtures/person');
  var company = require('./fixtures/company');

  describe('Person#find', function () {

    it('can find a person by email', function () {
      mock
        .get('/v2/people/find?email=alex%40alexmaccaw.com')
        .reply(200, alex);
      return Person.find({email: 'alex@alexmaccaw.com'})
        .then(function (person) {
          expect(person)
            .to.be.an.instanceOf(Person)
            .and.have.property('id', alex.id);
        });
    });

    it('can subscribe to a person', function () {
      mock
        .get('/v2/people/find?email=alex%40alexmaccaw.com&subscribe=true')
        .reply(200, alex);
      return Person.find({email: 'alex@alexmaccaw.com', subscribe: true});
    });

    it('can handle queued requests', function () {
      mock
        .get('/v2/people/find?email=alex%40alexmaccaw.com')
        .reply(202, {
          error: {
            type: 'queued'
          }
        });
      return expect(Person.find({email: 'alex@alexmaccaw.com'}))
        .to.be.rejectedWith(Person.QueuedError);
    });

    it('can handle unknown records', function () {
      mock
        .get('/v2/people/find?email=bademail%40unknown.com')
        .reply(404, {
          error: {
            type: 'unknown_record'
          }
        });
      return expect(Person.find({email: 'bademail@unknown.com'}))
        .to.be.rejectedWith(Person.NotFoundError);
    });

  });

  describe('Enrichment#find', function () {

    it('can find a person by email', function () {
      mock
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

    it('can handle queued requests', function () {
      mock
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
