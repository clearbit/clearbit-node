'use strict';

var expect = require('chai').use(require('chai-as-promised')).expect;
var nock   = require('nock');
var PersonCompany = require('../')('k').PersonCompany;

describe('PersonCompany', function () {

  var mock;
  before(function () {
    mock = nock('https://person.clearbit.com');
  });
  after(nock.cleanAll);
  afterEach(function () {
    mock.done();
  });

  describe('PersonCompany#find', function () {

    var alex = require('./fixtures/person');

    it('can find a person by email', function () {
      mock
        .get('/v1/combined/email/alex@alexmaccaw.com')
        .reply(200, alex);
      return PersonCompany.find({email: 'alex@alexmaccaw.com'})
        .then(function (person) {
          expect(person)
            .to.be.an.instanceOf(PersonCompany)
            .and.have.property('id', alex.id);
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
