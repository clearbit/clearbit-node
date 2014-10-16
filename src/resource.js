'use strict';

var createError  = require('create-error');
var EventEmitter = require('events').EventEmitter;
var _            = require('lodash');
var Promise      = require('bluebird');

function isQueued (err) {
  return err.type === 'queued';
}

function isUnknownRecord (err) {
  return err.type === 'unknown_record';
}

function ClearbitResource (data) {
  _.extend(this, data);
}

ClearbitResource.find = Promise.method(function (options) {
  return this.client.request(_.extend({
    api: this._options.api,
    path: this._options.template(options),
    query: _.pick(options, this._options.queryKeys)
  }, options))
  .bind(this)
  .then(function (data) {
    return new this(data);
  })
  .catch(isQueued, function () {
    throw new this.QueuedError(this._name + ' lookup queued');
  })
  .catch(isUnknownRecord, function () {
    throw new this.NotFoundError(this._name + ' not found');
  });
});

function createErrors (name) {
  return {
    NotFoundError: createError(name + 'NotFoundError'),
    QueuedError: createError(name + 'QueuedError')
  };
}

exports.create = function (name, options) {
  return function (client) {

    var Resource = function () {
      ClearbitResource.apply(this, arguments);
    };
        
    _.extend(Resource, new EventEmitter(), ClearbitResource, createErrors(name), {
      _name: name,
      _options: _.extend(options, {
        template: _.template(options.path)
      }),
      client: client
    });
  };
};
