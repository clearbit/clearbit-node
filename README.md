clearbit-node [![Build Status](https://travis-ci.org/clearbit/clearbit-node.svg?branch=master)](https://travis-ci.org/clearbit/clearbit-node) [![Code Climate](https://codeclimate.com/github/clearbit/clearbit-node/badges/gpa.svg)](https://codeclimate.com/github/clearbit/clearbit-node) [![Test Coverage](https://codeclimate.com/github/clearbit/clearbit-node/badges/coverage.svg)](https://codeclimate.com/github/clearbit/clearbit-node)
=============

Node library for querying the [Clearbit](https://clearbit.com) business intelligence APIs. Currently supports:

* [Enrichment API](https://clearbit.com/docs#enrichment-api)
* [Discovery API](https://clearbit.com/docs#discovery-api)
* [Watchlist API](https://clearbit.com/docs#watchlist-api)

## Setup
```bash
$ npm install clearbit
```
```js
var clearbit = require('clearbit')('api_key');
// or
var Client   = require('clearbit').Client;
var clearbit = new Client({key: 'api_key'});
```

## Performing Lookups

### Person

#### `Person.find(options)` -> `Promise`
  * `email` *String*: The email address to look up **(required)**
  * `webhook_id` *String*: Custom identifier for the webhook request
  * `subscribe` *Boolean*: Set to `true` to subscribe to the changes
  * `stream` *Boolean*: Set to `true` to use the [streaming API](https://clearbit.com/docs?shell#streaming) instead of webhooks

```js
var Person = clearbit.Person;
Person.find({email: 'email@domain.com'})
  .then(function (person) {
    console.log('Name: ', person.name.fullName);
  })
  .catch(Person.QueuedError, function (err) {
    console.log(err); // Person is queued
  })
  .catch(Person.NotFoundError, function (err) {
    console.log(err); // Person could not be found
  })
  .catch(function (err) {
    console.log('Bad/invalid request, unauthorized, Clearbit error, or failed request');
  });
```

### Company

#### `Company.find(options)` -> `Promise`
  * `domain` *String*: The company domain to look up **(required)**
  * `webhook_id` *String*: Custom identifier for the webhook request
  * `stream` *Boolean*: Set to `true` to use the [streaming API](https://clearbit.com/docs?shell#streaming) instead of webhooks

```js
var Company = clearbit.Company;
Company.find({domain: 'www.uber.com'})
  .then(function (company) {
    console.log('Name: ', company.name);
  })
  .catch(Company.QueuedError, function (err) {
    console.log(err); // Company is queued
  })
  .catch(Company.NotFoundError, function (err) {
    console.log(err); // Company could not be found
  })
  .catch(function (err) {
    console.log('Bad/invalid request, unauthorized, Clearbit error, or failed request');
  });
```

### Error Handling
Lookups return [Bluebird](https://github.com/petkaantonov/bluebird) promises. Any status code >=400 will trigger an error, including lookups than do not return a result. You can easily filter out unknown records from true errors using [Bluebird's error class matching](https://github.com/petkaantonov/bluebird/blob/master/API.md#catchfunction-errorclassfunction-predicate-function-handler---promise):

```js
Person.find({email: 'notfound@example.com'})
  .catch(Person.NotFoundError, function () {
    // handle an unknown record
  })
  .catch(function () {
    // handle other errors
  });
```

### Callbacks
If you really want to use node-style callbacks, use [Bluebird's nodeify method](https://github.com/petkaantonov/bluebird/blob/master/API.md#nodeifyfunction-callback--object-options---promise):

```js
Person.find({email: 'email@domain.com'}).nodeify(function (err, person) {
  if (err) {
    // handle
  }
  else {
    // person
  }
});
```
