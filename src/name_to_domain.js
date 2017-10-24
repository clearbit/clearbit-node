'use strict';

var resource = require('./resource');

exports.NameToDomain = resource.create('Name To Domain', { api: 'company', version: 1, })
.extend(null, {
  find: function(options) {
    return this.get('/domains/find', options);
  },
});
