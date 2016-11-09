'use strict';

var expect     = require('chai').use(require('chai-as-promised')).expect;
var nock       = require('nock');
var Person     = require('../')('k').Person;

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

    it('removes non query options from the url', function () {
      mock
        .get('/v2/people/find?email=alex%40alexmaccaw.com')
        .reply(200, alex);
      return Person.find({email: 'alex@alexmaccaw.com', timeout: 10000});
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
});
