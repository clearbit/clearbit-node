'use strict';

var assert   = require('assert');
var resource = require('../resource');
var _        = require('lodash');

exports.Company = resource.create('Company', {api: 'company'})
  .extend({
    flag: function(options){
      return this.constructor.post('/companies/' + this.id + '/flag', options);
    }
  },
  {
    find: function (options) {
      options = options || {};
      assert(options.domain, 'A domain must be provided');

      return this.get(
        '/companies/domain/' + options.domain,
        _.omit(options, 'domain')
      );
    }
  });
