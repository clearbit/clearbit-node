'use strict';

var createError = require('create-error');
var _           = require('lodash');

function ClearbitResource (data) {
  this.options = {};
  _.extend(this, data);
}

ClearbitResource.get = function (path, options) {
  options = _.extend({
    path:   path,
    method: 'get',
    query: extractParams(options)
  }, this.options, options);

  return this.client.request(options)
    .bind(this)
    .then(cast)
    .catch(isQueued, function () {
      throw new this.QueuedError(this.name + ' lookup queued');
    })
    .catch(isUnknownRecord, function () {
      throw new this.NotFoundError(this.name + ' not found');
    });
};

ClearbitResource.post = function (path, options) {
  options = _.extend({
    path:   path,
    method: 'post',
    json:   true,
    body:   extractParams(options)
  }, this.options, options);

  return this.client.request(options)
    .bind(this)
    .then(cast)
    .catch(isUnknownRecord, function () {
      throw new this.NotFoundError(this.name + ' not found');
    });
};

ClearbitResource.del = function (path, options) {
  options = _.extend({
    path:   path,
    method: 'delete'
  }, this.options, options);

  return this.client.request(options)
    .bind(this)
    .then(cast)
    .catch(isUnknownRecord, function () {
      throw new this.NotFoundError(this.name + ' not found');
    });
};

ClearbitResource.setVersion = function(value){
  this.options.headers = this.options.headers || {};
  this.options.headers['API-Version'] = value;
};

exports.create = function (name, options) {
  var Resource = function () {
    ClearbitResource.apply(this, arguments);
  };

  _.extend(Resource, ClearbitResource, createErrors(name), {
    name: name,
    options: options
  });

  return _.extend(function (client) {
    return _.extend(Resource, {
      client: client
    });
  },
  {
    extend: function (proto, ctor) {
      _.extend(Resource.prototype, proto);
      _.extend(Resource, ctor);
      return this;
    }
  });
};

function cast (data) {
  /* jshint validthis:true */
  return !Array.isArray(data) ? new this(data) : data.map(function (result) {
    return new this(result);
  }, this);
}

function isQueued (err) {
  return err.type === 'queued';
}

function isUnknownRecord (err) {
  return err.type === 'unknown_record';
}

function createErrors (name) {
  return {
    NotFoundError: createError(name + 'NotFoundError'),
    QueuedError: createError(name + 'QueuedError')
  };
}

function extractParams (options) {
  var params = _.omit(options || {},
    'path', 'method', 'params',
    'client', 'api', 'stream',
    'headers'
  );

  return _.isEmpty(params) ? null : params;
}
