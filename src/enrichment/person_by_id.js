'use strict';

var assert   = require('assert');
var resource = require('../resource');

exports.PersonId = resource.create('PersonId', {api: 'prospector', version: 1})
  .extend({
  },
  {
    find: function(options){
      options = options || {};
      assert(options.id, 'An ID must be provided');

      return this.get('/people/' + options.id + '/email');
    }
  });
