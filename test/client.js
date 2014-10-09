'use strict';

var expect         = require('chai').expect;
var nock           = require('nock');
var ClearbitClient = require('../src/client');
var pkg            = require('../package.json');

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
      expect(client.base.bind(client, {}))
        .to.throw(/API must be specified/);
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

  describe('#request', function () {

    var mock;
    before(function () {
      mock = nock('https://person.clearbit.co');
    });
    after(nock.restore);
    afterEach(function () {
      mock.done();
    });

    it('sends a get request to the specified endpoint', function () {
      mock
        .get('/v1/people/email/bvdrucker@gmail.com')
        .reply(202);
      return client.request({
        api: 'person',
        path: '/people/email/bvdrucker@gmail.com'
      });
    });

    it('can generate a qs', function () {
      mock
        .get('/v1/people/email/bvdrucker@gmail.com?webhook_id=123')
        .reply(202);
      return client.request({
        api: 'person',
        path: '/people/email/bvdrucker@gmail.com',
        query: {
          webhook_id: '123'
        }
      });
    });

    it('sends a basic auth header', function () {
      mock
        .get('/v1/people/email/bvdrucker@gmail.com')
        .matchHeader('Authorization', 'Basic aw==')
        .reply(202);
      return client.request({
        api: 'person',
        path: '/people/email/bvdrucker@gmail.com'
      });
    });

    it('sends a user agent', function () {
      mock
        .get('/v1/people/email/bvdrucker@gmail.com')
        .matchHeader('User-Agent', 'ClearbitNode/v' + pkg.version)
        .reply(202);
      return client.request({
        api: 'person',
        path: '/people/email/bvdrucker@gmail.com'
      });
    });

  });

});