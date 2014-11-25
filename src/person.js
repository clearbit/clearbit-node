'use strict';

var assert   = require('assert');
var resource = require('./resource');

function requireEmail (options) {
  assert(options.email, 'An email must be provided');
}

exports.Person = resource.create('Person', {
  api: 'person',
  path: '/people/email/<%= email %>',
  queryKeys: 'subscribe'
})
.on('preFind', requireEmail);

exports.PersonCompany = resource.create('PersonCompany', {
  api: 'person',
  path: '/combined/email/<%= email %>',
  queryKeys: 'subscribe'
})
.on('preFind', requireEmail);
