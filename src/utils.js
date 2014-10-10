'use strict';

var createError = require('create-error');

exports.cast = function (data) {
  return new this(data);
};

exports.pending = function () {
  return !this.id;
};

exports.NotFoundError = createError('NotFoundError');

exports.isUnknownRecord = function (err) {
  return err.type === 'unknown_record';
};
