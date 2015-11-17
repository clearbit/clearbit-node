'use strict';

var assert   = require('assert');
var resource = require('../resource');

exports.Person = resource.create('Person', {api: 'person', version: 2})
  .extend({
    flag: function(options){
      return this.constructor.post('/people/' + this.id + '/flag', options);
    }
  },
  {
    find: function(options){
      options = options || {};
      assert(options.email, 'An email must be provided');

      return this.get('/people/find', options);
    }
  });
