'use strict';

var expect = require('chai').expect;
var nock   = require('nock');
var Risk   = require('../')('k').Risk;

describe('Risk', function () {

  var mock;
  before(function () {
    mock = nock('https://risk.clearbit.com');
  });
  after(nock.cleanAll);
  afterEach(function () {
    mock.done();
  });

  describe('Risk#search', function () {

    var fixture = require('./fixtures/risk');

    it('can calculate risk', function () {
      mock
        .get('/v1/calculate?email=alex%40clearbit.com&ip=127.0.0.1')
        .reply(200, fixture);

      return Risk.calculate({email: 'alex@clearbit.com', ip: '127.0.0.1'})
        .then(function (response) {
          expect(response)
            .to.be.an.instanceOf(Risk)
            .and.have.deep.property('risk.score', fixture.risk.score);
        });
    });

  });

});
