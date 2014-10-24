'use strict';

var assert   = require('assert');
var resource = require('./resource');

module.exports = resource.create('Company', {
  api: 'company',
  path: '/companies/domain/<%= domain %>'
})
.on('preFind', function (options) {
  assert(options.domain, 'A domain must be provided');
});
