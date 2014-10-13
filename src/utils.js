'use strict';

var createError = require('create-error');

exports.cast = function (data) {
  return new this(data);
};

exports.NotFoundError = createError('NotFoundError');
exports.QueuedError = createError('QueuedError');

exports.isUnknownRecord = function (err) {
  return err.type === 'unknown_record';
};

exports.isQueued = function (err) {
  return err.type === 'queued';
};