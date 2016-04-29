'use strict';

var resource = require('./resource');

exports.Risk = resource.create('Risk', {
  api: 'risk'
})
.extend(null, {
  calculate: function(options) {
    return this.get('/calculate', options);
  },

  flag: function(options) {
    return this.post('/flag', options);
  }
});
