'use strict';

var assert = require('assert');
var _      = require('lodash');

module.exports = function (client) {
  function Company (data) {
    _.extend(this, data);
  }

  Company.prototype.pending = function () {
    return !this.id;
  };

  Company.find = function (options) {
    assert(options && options.domain, 'A domain must be provided');
    return this.client.request(_.extend({
      api: 'company',
      path: '/companies/domain/' + options.domain
    }, options))
    .bind(this)
    .then(function (data) {
      return new this(data);
    });
  };

  Company.prototype.client = Company.client = client;

  return Company;
};
