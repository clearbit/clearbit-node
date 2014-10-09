'use strict';

var assert = require('assert');
var _      = require('lodash');

module.exports = function (client) {
  function Person (data) {
    _.extend(this, data);
  }

  Person.prototype.pending = function () {
    return !this.id;
  };

  Person.find = function (options) {
    assert(options && options.email, 'An email must be provided');
    return this.client.request(_.extend({
      api: 'person',
      path: '/people/email/' + options.email,
      query: _.pick(options, 'subscribe', 'company')
    }, options))
    .bind(this)
    .then(function (data) {
      return new this(data);
    });
  };

  Person.prototype.client = Person.client = client;

  return Person;
};