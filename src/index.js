'use strict';

var Client = require('./client');

module.exports = function (key) {
  return new Client({
    key: key
  });
};

module.exports.Client = Client;
