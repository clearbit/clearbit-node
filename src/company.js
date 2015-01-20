'use strict';

var assert   = require('assert');
var resource = require('./resource');
var _        = require('lodash');

exports.Company = resource.create('Company', {api: 'company'})
.extend({
  find: function(options){
    options = options || {};
    assert(options.domain, 'An domain must be provided');

    return this.get(
      '/companies/domain/' + options.domain,
      _.omit(options, 'domain')
    );
  }
})
.include({
  flag: function(options){
    return this.constructor.post('/companies/' + this.id + '/flag', options);
  }
});
