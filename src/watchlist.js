'use strict';

var resource = require('./resource');

exports.Watchlist = resource.create('Watchlist', {
  api: 'watchlist'
})
.extend(null, {
  search: function(options) {
    return this.post('/search/all', options);
  }
});

exports.WatchlistIndividual = resource.create('WatchlistIndividual', {
  api: 'watchlist'
})
.extend(null, {
  search: function(options) {
    return this.post('/search/individuals', options);
  }
});

exports.WatchlistEntity = resource.create('WatchlistEntity', {
  api: 'watchlist'
})
.extend(null, {
  search: function(options) {
    return this.post('/search/entities', options);
  }
});
