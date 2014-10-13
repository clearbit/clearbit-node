'use strict';

var assert  = require('assert');
var _       = require('lodash');
var Promise = require('bluebird');
var utils   = require('./utils');

module.exports = function (client) {
  function PersonCompany (data) {
    _.extend(this, data);
  }

  PersonCompany.find = Promise.method(function (options) {
    assert(options && options.email, 'An email must be provided');
    return this.client.request(_.extend({
      api: 'person',
      path: '/combined/email/' + options.email,
      query: _.pick(options, 'subscribe', 'webhook_id')
    }, options))
    .bind(this)
    .then(utils.cast)
    .catch(utils.isQueued, function () {
      throw new this.QueuedError('PersonCompany lookup queued');
    })
    .catch(utils.isUnknownRecord, function () {
      throw new this.NotFoundError('PersonCompany not found');
    });
  });

  PersonCompany.prototype.client = PersonCompany.client = client;
  PersonCompany.NotFoundError = utils.NotFoundError;
  PersonCompany.QueuedError = utils.QueuedError;

  return PersonCompany;
};
