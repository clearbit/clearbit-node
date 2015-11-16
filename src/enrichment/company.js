'use strict';

var assert   = require('assert');
var resource = require('../resource');

exports.Company = resource.create('Company', {api: 'company', version: 2})
  .extend({
    flag: function(options){
      return this.constructor.post('/companies/' + this.id + '/flag', options);
    }
  },
  {
    find: function (options) {
      options = options || {};
      assert(options.domain, 'A domain must be provided');

      return this.get('/companies/find', options);
    }
  });
