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
  assert(!!config.key, 'An API key must be provided');
  this.key = config.key;

  this.Person = require('./person').Person(this);
  this.PersonCompany = require('./person').PersonCompany(this);
  this.Company = require('./company')(this);
}

var base = 'https://%s%s.clearbit.com/v%s';
ClearbitClient.prototype.base = function (options) {
  options = _.defaults(options, {
    version: '1',
    stream: false
  });
  assert(options.api, 'An API must be specified');
  return util.format.apply(util, [
    base,
    options.api,
    options.stream ? '-stream' : '',
    options.version
  ]);
};

ClearbitClient.prototype.url = function (options) {
  _.defaults(options, {
    path: ''
  });
  return this.base(options) + options.path;
};

function generateQuery () {
  var query = _.omit(_.extend.apply(_, [{}].concat([].slice.apply(arguments))), _.isUndefined);
  return _.isEmpty(query) ? undefined : query;
}

ClearbitClient.prototype.request = function (options) {
  options = _.defaults(options, {
    method: 'get',
    query: {}
  });
  return needle.requestAsync(
    options.method,
    this.url(options),
    generateQuery({
      webhook_id: options.webhook_id
    }, options.query),
    {
      timeout: options.stream ? 60000 : 5000,
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
