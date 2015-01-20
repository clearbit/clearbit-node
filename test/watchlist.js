'use strict';

var expect  = require('chai').expect;
var nock    = require('nock');
var Watchlist = require('../')('k').Watchlist;

describe('Watchlist', function () {

  var mock;
  before(function () {
    mock = nock('https://watchlist.clearbit.com');
  });
  after(nock.cleanAll);
  afterEach(function () {
    mock.done();
  });

  describe('Watchlist#search', function () {

    var watchlist = require('./fixtures/watchlist');

    it('can search a watchlist by name', function () {
      mock
        .post('/v1/search/all')
        .reply(200, watchlist);
      return Watchlist.search({name: 'Joe'})
        .then(function (watchlist) {
          // console.log(watchlist.constructor)
          expect(watchlist[0])
            .to.be.an.instanceOf(Watchlist)
            .and.have.property('id', watchlist.id);
        });
    });

  });

});
