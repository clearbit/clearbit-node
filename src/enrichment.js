'use strict';

var assert   = require('assert');
var resource = require('./resource');
var Company  = require('./enrichment/company');
var Person   = require('./enrichment/person');

exports.Enrichment = resource.create('Enrichment', {api: 'person', version: 2})
  .extend(null, {
    find: function(options){
      options = options || {};

      if (options.domain)
        return Company.find(options);

      assert(options.email, 'An email must be provided');

      return this.get('/combined/find', options);
    },

    Company: Company,
    Person: Person
  });
