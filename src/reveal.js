'use strict';

var resource = require('./resource');

exports.Reveal = resource.create('Reveal', {api: 'reveal', version: 1})
  .extend(null, {
    find: function (options) {
      return this.get('/companies/find', options);
    }
  });
