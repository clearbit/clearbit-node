'use strict';

var expect = require('chai').expect;
var nock   = require('nock');
var Client = require('../src/client');

describe('Person', function () {

  var client = new Client({key: 'k'});
  var Person = require('../src/person')(client);

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
      var person = new Person();
      expect(person.pending()).to.be.true;
      person.id = 'foo';
      expect(person.pending()).to.be.false;
    });

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

    it('is can handle pending requests', function () {
      mock
        .get('/v1/people/email/alex@alexmaccaw.com')
        .reply(202);
      return Person.find({email: 'alex@alexmaccaw.com'})
        .then(function (person) {
          expect(person.pending()).to.be.true;
        });
    });

  });

});
