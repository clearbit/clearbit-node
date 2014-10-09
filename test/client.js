'use strict';

var expect         = require('chai').expect;
var ClearbitClient = require('../src/client');

describe('ClearbitClient', function () {

  var client;
  beforeEach(function () {
    client = new ClearbitClient({
      key: 'k'
    });
  });

  describe('Constructor', function () {

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

  describe('#base', function () {

    it('requires an API', function () {
      expect(client.base).to.throw(/API must be specified/);
    });

    it('can generate the default base', function () {
      expect(client.base({
        api: 'person'
      }))
      .to.equal('https://person.clearbit.co/v1');
    });

    it('can generate a streaming base', function () {
      expect(client.base({
        api: 'person',
        stream: true
      }))
      .to.equal('https://person-stream.clearbit.co/v1');
    });

    it('can set a custom version', function () {
      expect(client.base({
        api: 'person',
        version: '2'
      }))
      .to.equal('https://person.clearbit.co/v2');
    });

  });

});