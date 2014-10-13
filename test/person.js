'use strict';

var expect = require('chai').use(require('chai-as-promised')).expect;
var nock   = require('nock');
var Person = require('../')('k').Person;

describe('Person', function () {

  var mock;
  before(function () {
    mock = nock('https://person.clearbit.co');
  });
  after(nock.cleanAll);
  afterEach(function () {
    mock.done();
  });

  describe('Person#find', function () {

    var alex = require('./fixtures/person');

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

    it('can override the company setting', function () {
      mock
        .get('/v1/people/email/alex@alexmaccaw.com?company=false')
        .reply(200, alex);
      return Person.find({email: 'alex@alexmaccaw.com', company: false});
    });

    it('can handle queued requests', function () {
      mock
        .get('/v1/people/email/alex@alexmaccaw.com')
        .reply(202, {
          error: {
            type: 'queued'
          }
        });
      return Person.find({email: 'alex@alexmaccaw.com'})
        .to.be.rejectedWith(Company.QueuedError);
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

});
