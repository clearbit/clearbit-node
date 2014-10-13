'use strict';

var expect = require('chai').use(require('chai-as-promised')).expect;
var nock   = require('nock');
var PersonCompany = require('../')('k').PersonCompany;

describe('PersonCompany', function () {

  var mock;
  before(function () {
    mock = nock('https://person.clearbit.co');
  });
  after(nock.cleanAll);
  afterEach(function () {
    mock.done();
  });

  describe('#pending', function () {

    it('identifies whether the person has an id', function () {
      var person = new PersonCompany();
      expect(person.pending()).to.be.true;
      person.id = 'foo';
      expect(person.pending()).to.be.false;
    });

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

    it('can handle pending requests', function () {
      mock
        .get('/v1/combined/email/alex@alexmaccaw.com')
        .reply(202);
      return PersonCompany.find({email: 'alex@alexmaccaw.com'})
        .then(function (person) {
          expect(person.pending()).to.be.true;
        });
    });

  });

});
