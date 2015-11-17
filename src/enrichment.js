'use strict';

var assert   = require('assert');
var resource = require('./resource');

exports.Enrichment = function(client) {
  return resource.create('Enrichment', {api: 'person', version: 2})
    .extend(null, {
      find: function(options){
        options = options || {};

        if (options.domain)
          return client.Company.find(options);

        assert(options.email, 'An email must be provided');

        return this.get('/combined/find', options);
      },

      Company: client.Company,
      Person: client.Person
    })(client);
};
