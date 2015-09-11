'use strict';

var assert   = require('assert');
var resource = require('./resource');
var _        = require('lodash');

exports.Discovery = resource.create('Discovery', {api: 'discovery'})
  .extend(null, {
    search: function (options) {
      options = options || {};

      return this.post(
        '/companies/search',
        options
      );
    }
  });
