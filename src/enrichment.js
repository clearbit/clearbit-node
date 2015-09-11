'use strict';

var assert   = require('assert');
var resource = require('./resource');
var _        = require('lodash');
var Company  = require('./enrichment/company');
var Person   = require('./enrichment/person');

exports.Enrichment = resource.create('Enrichment', {api: 'person'})
  .extend(null, {
    find: function(options){
      options = options || {};

      if (options.domain)
        return Company.find(options);

      assert(options.email, 'An email must be provided');

      return this.get(
        '/combined/email/' + options.email,
        _.omit(options, 'email')
      );
    },

    Company: Company,
    Person: Person
  });
