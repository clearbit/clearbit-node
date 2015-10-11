'use strict';

var resource = require('./resource');

exports.Prospector = resource.create('Prospector', {api: 'prospector'})
  .extend({
    getEmail: function (){
      return this.getEmailResponse().then(function(resp){
        return resp.email;
      });
    },

    getVerified: function () {
      return this.getEmailResponse().then(function(resp){
        return resp.verified;
      });
    },

    getEmailResponse: function () {
      if (this.emailResponse)
        return this.emailResponse;

      this.emailResponse = this.constructor.get(
        '/people/' + this.id + '/email'
      );

      return this.emailResponse;
    }
  }, {
    search: function (options) {
      options = options || {};

      return this.get(
        '/people/search',
        options
      );
    }
  });
