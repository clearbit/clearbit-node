'use strict';

var resource = require('./resource');
var _        = require('lodash');

exports.Watchlist = resource.create('Watchlist', {
  api: 'watchlist'
}).extend({
  search: function(options) {
    return this.post('/search/all', options);
  }
})

exports.WatchlistIndividual = resource.create('WatchlistIndividual', {
  api: 'watchlist'
}).extend({
  search: function(options) {
    return this.post('/search/individuals', options);
  }
});

exports.WatchlistEntity = resource.create('WatchlistEntity', {
  api: 'watchlist'
}).extend({
  search: function(options) {
    return this.post('/search/entities', options);
  }
});
