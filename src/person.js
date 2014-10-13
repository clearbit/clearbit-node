'use strict';

var assert  = require('assert');
var _       = require('lodash');
var Promise = require('bluebird');
var utils   = require('./utils');

module.exports = function (client) {
  function Person (data) {
    _.extend(this, data);
  }

  Person.find = Promise.method(function (options) {
    assert(options && options.email, 'An email must be provided');
    return this.client.request(_.extend({
      api: 'person',
      path: '/people/email/' + options.email,
      query: _.pick(options, 'subscribe', 'company')
    }, options))
    .bind(this)
    .then(utils.cast)
    .catch(utils.isQueued, function () {
      throw new this.QueuedError('Person lookup queued');
    })
    .catch(utils.isUnknownRecord, function () {
      throw new this.NotFoundError('Person not found');
    });
  });

  Person.prototype.client = Person.client = client;
  Person.NotFoundError = utils.NotFoundError;
  Person.QueuedError = utils.QueuedError;

  return Person;
};
