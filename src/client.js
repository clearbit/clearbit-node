'use strict';

var assert = require('assert');
var util   = require('util');
var _      = require('lodash');

function ClearbitClient (config) {
  config = config || {};
  assert(this instanceof ClearbitClient, 'Client must be called with new');
  assert(!!config.key, 'An API key must be provided');
  this.key = config.key;
};

var base = 'https://%s%s.clearbit.co/v%s';
ClearbitClient.prototype.base = function (options) {
  options = _.defaults(options || {}, {
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

module.exports = ClearbitClient;