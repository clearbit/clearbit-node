## ⚠️ DEPRECATION WARNING

This package is no longer being maintained. If you're looking to integrate with Clearbit's API we recommend looking at the HTTP requests available in our documentation at [clearbit.com/docs](https://clearbit.com/docs)

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
  * `timeout` *Integer*: The timeout in milliseconds after which a socket closed error will be thrown.

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
  * `timeout` *Integer*: The timeout in milliseconds after which a socket closed error will be thrown.

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

### NameToDomain

#### `NameToDomain.find(options)` -> `Promise`
  * `name` *String*: The company name to look up **(required)**
  * `timeout` *Integer*: The timeout in milliseconds after which a socket closed error will be thrown.

```js
var NameToDomain = clearbit.NameToDomain;
NameToDomain.find({name: 'Uber'})
  .then(function (result) {
    console.log('Domain: ', result.domain);
  })
  .catch(NameToDomain.NotFoundError, function (err) {
    console.log(err); // Domain could not be found
  })
  .catch(function (err) {
    console.log('Bad/invalid request, unauthorized, Clearbit error, or failed request');
  });
```

### Prospector

#### `Prospector.search(options)` -> `Promise`
  * `domain` *String*: The domain to search for. **(required)**
  * `role` *String*: Employment role to filter by.
  * `roles` *Array[String]*: Employment roles to filter by.
  * `seniority` *String*: Employment seniority to filter by.
  * `seniorities` *Array[String]*: Employment seniorities to filter by.
  * `title` *String*: Job title to filter by.
  * `titles` *Array[String]*: Job titles to filter by.
  * `city` *String*: City to filter by.
  * `cities` *Array[String]*: Cities to filter by.
  * `state` *String*: State to filter by.
  * `states` *Array[String]*: States to filter by.
  * `country` *String*: Country to filter by.
  * `countries` *Array[String]*: Countries to filter by.
  * `name` *String*: Name of an individual to filter by.
  * `page` *Integer*: The page of results to fetch.
  * `page_size` *Integer*: The number of results per page.
  * `suppression` *String*: Set to `eu` to exclude records with country data in the EU. Set to `eu_strict` to exclude records with country data in the EU or with null country data.

```js
var Prospector = clearbit.Prospector;
Prospector.search({domain: 'clearbit.com'})
  .then(function (result) {
    console.log('Results: ', result.results);
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
