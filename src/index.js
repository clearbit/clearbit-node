'use strict';

var Client = require('./client');

module.exports = function (key, connectionOptions) {
  return new Client({
    key: key,
    connectionOptions: connectionOptions
  });
};

module.exports.Client = Client;
