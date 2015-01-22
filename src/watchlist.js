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

exports.WatchlistCandidate = resource.create('WatchlistCandidate', {
  api: 'watchlist'
}).extend({
  destroy: function(){
    return this.constructor.del('/candidates/' + this.id);
  }
}, {
  all: function(options) {
    return this.get('/candidates', options);
  },

  create: function(options) {
    return this.post('/candidates', options);
  },

  find: function(id, options) {
    return this.get('/candidates/' + id, options);
  }
});
