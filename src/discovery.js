'use strict';

var resource = require('./resource');

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
