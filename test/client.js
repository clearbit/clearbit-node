'use strict';

var expect         = require('chai').expect;
var ClearbitClient = require('../src/client');

describe('ClearbitClient', function () {

  it('must be called with new', function () {
    expect(ClearbitClient).to.throw(/called with new/);
  });

  it('must provide an API key', function () {
    expect(function () {
      return new ClearbitClient();
    })
    .to.throw(/API key/);
  });

  it('configures the API key', function () {
    expect(new ClearbitClient({key: 'k'})).to.have.property('key', 'k');
  });

});