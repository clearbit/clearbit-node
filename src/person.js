'use strict';

var assert   = require('assert');
var resource = require('./resource');
var _        = require('lodash');

function requireEmail (options) {
  assert(options.email, 'An email must be provided');
}

exports.Person = resource.create('Person', {
  api: 'person',
  path: '/people/email/<%= email %>',
  queryKeys: 'subscribe'
})
.on('preFind', requireEmail)
.include({
  flag: function(params, options){
    return this.client.request(_.extend({
      api: this._options.api,
      method: 'post',
      path: _.template('/people/<%= id %>/flag', this),
      query: params || {}
    }, options));
  }
});

exports.PersonCompany = resource.create('PersonCompany', {
  api: 'person',
  path: '/combined/email/<%= email %>',
  queryKeys: 'subscribe'
})
.on('preFind', requireEmail);
