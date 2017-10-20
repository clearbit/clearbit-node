'use strict';

var assert      = require('assert');
var util        = require('util');
var _           = require('lodash');
var Promise     = require('bluebird');
var createError = require('create-error');
var http        = require('http');
var needle      = Promise.promisifyAll(require('needle'));
var pkg         = require('../package.json');

function ClearbitClient (config) {
  config = config || {};
  assert(this instanceof ClearbitClient, 'Client must be called with new');

  this.key = config.key || process.env.CLEARBIT_KEY;
  assert(!!this.key, 'An API key must be provided');

  this.Company = require('./enrichment/company').Company(this);
  this.Person = require('./enrichment/person').Person(this);
  this.Enrichment = require('./enrichment').Enrichment(this);
  this.Discovery = require('./discovery').Discovery(this);
  this.Prospector = require('./prospector').Prospector(this);
  this.Reveal = require('./reveal').Reveal(this);
  this.Risk = require('./risk').Risk(this);
  this.NameToDomain = require('./name_to_domain').NameToDomain(this);
  this.Watchlist = require('./watchlist').Watchlist(this);
  this.WatchlistCandidate = require('./watchlist').WatchlistCandidate(this);
  this.WatchlistEntity = require('./watchlist').WatchlistEntity(this);
  this.WatchlistIndividual = require('./watchlist').WatchlistIndividual(this);
}

var ENDPOINT = 'https://%s%s.clearbit.com/v%s';

ClearbitClient.prototype.endpoint = function (options) {
  options = _.defaults(options, {
    version: '1',
    stream: false
  });

  assert(options.api, 'An API must be specified');

  return util.format(
    ENDPOINT,
    options.api,
    options.stream ? '-stream' : '',
    options.version
  );
};

ClearbitClient.prototype.url = function (options) {
  _.defaults(options, {
    path: ''
  });
  return this.endpoint(options) + options.path;
};

ClearbitClient.prototype.request = function (options) {
  options = _.defaults(options, {
    method: 'get'
  });

  var timeout = options.timeout || options.stream && 60000 || 10000;

  return needle.requestAsync(
    options.method,
    this.url(options),
    options.body || options.query,
    {
      json: options.json,
      headers: options.headers,
      timeout: timeout,
      username: this.key,
      password: '',
      user_agent: 'ClearbitNode/v' + pkg.version
    }
  )
  .bind(this)
  .spread(function (response, body) {
    if (response.statusCode === 202 || response.statusCode >= 400) {
      var message = body.error ? body.error.message : http.STATUS_CODES[response.statusCode] || 'Unknown';
      throw _.extend(new this.ClearbitError(message), {
        type: body.error ? body.error.type : 'unknown',
        body: body,
        statusCode: response.statusCode
      });
    }
    else {
      return body;
    }
  });
};

ClearbitClient.ClearbitError = ClearbitClient.prototype.ClearbitError = createError('ClearbitError');

module.exports = ClearbitClient;
