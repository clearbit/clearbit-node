'use strict';

var expect        = require('chai').use(require('chai-as-promised')).expect;
var nock          = require('nock');
var Person        = require('../')('k').Person;
var PersonCompany = require('../')('k').PersonCompany;

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
        .get('/v1/people/email/alex@alexmaccaw.com')
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
        .get('/v1/people/email/alex@alexmaccaw.com?subscribe=true')
        .reply(200, alex);
      return Person.find({email: 'alex@alexmaccaw.com', subscribe: true});
    });

    it('can handle queued requests', function () {
      mock
        .get('/v1/people/email/alex@alexmaccaw.com')
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
        .get('/v1/people/email/bademail@unknown.com')
        .reply(404, {
          error: {
            type: 'unknown_record'
          }
        });
      return expect(Person.find({email: 'bademail@unknown.com'}))
        .to.be.rejectedWith(Person.NotFoundError);
    });

  });

  describe('PersonCompany#find', function () {

    it('can find a person by email', function () {
      mock
        .get('/v1/combined/email/alex@alexmaccaw.com')
        .reply(200, {
          person: alex,
          company: company
        });
      return PersonCompany.find({email: 'alex@alexmaccaw.com'})
        .then(function (personCompany) {
          expect(personCompany)
            .to.be.an.instanceOf(PersonCompany)
            .and.have.include.keys('person', 'company')
            .and.have.deep.property('person.id', alex.id);
        });
    });

    it('can handle queued requests', function () {
      mock
        .get('/v1/combined/email/alex@alexmaccaw.com')
        .reply(202, {
          error: {
            type: 'queued'
          }
        });
      return expect(PersonCompany.find({email: 'alex@alexmaccaw.com'}))
        .to.be.rejectedWith(PersonCompany.QueuedError);
    });

  });

});

