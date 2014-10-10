clearbit-node [![Build Status](https://travis-ci.org/bendrucker/clearbit-node.svg?branch=master)](https://travis-ci.org/bendrucker/clearbit-node) [![Code Climate](https://codeclimate.com/github/bendrucker/clearbit-node/badges/gpa.svg)](https://codeclimate.com/github/bendrucker/clearbit-node) [![Test Coverage](https://codeclimate.com/github/bendrucker/clearbit-node/badges/coverage.svg)](https://codeclimate.com/github/bendrucker/clearbit-node)
=============

Node library for querying the [Clearbit](https://clearbit.co) business intelligence APIs. Currently supports:

* [Person API](https://clearbit.co/docs#person-api)
* [Company API](https://clearbit.co/docs#company-api)

# Setup
```bash
$ npm install clearbit
```
```js
var clearbit = require('clearbit')('api_key');
// or 
var Client   = require('clearbit').Client;
var clearbit = new Client({key: 'api_key'});
```

## Person

#### `Person.find(options)` -> `Promise`
  * `email` *String*: The email address to look up **(required)**
  * `webhook_id` *String*: Custom identifier for the webhook request
  * `subscribe` *Boolean*: Set to `true` to subscribe to the changes
  * `company` *Boolean*: Set to `true` to include a company lookup on the email’s domain name in the response
  * `stream` *Boolean*: Set to `true` to use the [streaming API](https://clearbit.co/docs?shell#streaming) instead of webhooks 

```js
var Person = clearbit.Person;
Person.find({email: 'email@domain.com'})
  .then(function (person) {
    if (!person.pending()) {
      console.log('Name: ', person.name.fullName);
    }
  })
  .catch(Person.NotFoundError, function (err) {
    console.log(err); // Person could not be found
  })
  .catch(function (err) {
    console.log('Bad/invalid request, unauthorized, Clearbit error, or failed request');
  });
```

#### `person.pending()` -> `Boolean`
If Clearbit responds with a `202` status indicating that lookup has been queued, `person.pending` returns `true`.

## Company

#### `Company.find(options)` -> `Promise`
  * `domain` *String*: The company domain to look up **(required)**
  * `webhook_id` *String*: Custom identifier for the webhook request
  * `stream` *Boolean*: Set to `true` to use the [streaming API](https://clearbit.co/docs?shell#streaming) instead of webhooks 

```js
var Company = clearbit.Company;
Company.find({domain: 'www.uber.com'})
  .then(function (company) {
    if (!company.pending()) {
      console.log('Name: ', company.name);
    }
  })
  .catch(Company.NotFoundError, function (err) {
    console.log(err); // Company could not be found
  })
  .catch(function (err) {
    console.log('Bad/invalid request, unauthorized, Clearbit error, or failed request');
  });
```

#### `company.pending()` -> `Boolean`
If Clearbit responds with a `202` status indicating that lookup has been queued, `company.pending` returns `true`.
