'use strict';
var q = require('q');
var redis = require('redis');
var client = redis.createClient();
var parse = require('./parse');
var prepare = require('./prepare');
var getExpires = require('./getExpires');
// var meta = require('./meta');

client.on('error', function(err) {
  console.error('redis-connection-error', err);
});

module.exports = {
  type: 'Redis',
  get: function(key, default_value) {
    var deferred = q.defer();
    client.get(key, function(err, value) {
      if (err) {
        console.error(err);
        return deferred.reject(err);
      }
      if (value) {
        value = parse(value);
      } else {
        value = default_value;
      }
      deferred.resolve(value);
    });
    return deferred.promise;
  },
  getItem: function(key, default_value) {
    return this.get(key, default_value);
  },
  getAndRemove: function(key) {
    var value = this.get(key);
    this.remove(key);
    return value;
  },
  getList: function() {
    console.warn('TODO: getList');
  },
  set: function(key, value, config) {
    var deferred = q.defer();
    client.set(key, value, function(err) {
      if (err) {
        console.error(err);
      }
      deferred.resolve(value);
    });
    return deferred.promise;
  },
  setItem: function(key, value, config) {
    return this.set(key, value, config);
  },
  remove: function(key) {
    var deferred = q.defer();
    client.del(key, function(err) {
      if (err) {
        console.error(err);
      }
      deferred.resolve(true);
    });
    return deferred.promise;
  },
  removeItem: function(key) {
    this.remove(key);
  },
  clear: function() {
    console.warn('TODO: clear');
  },
  list: function() {
    var self = this;
    client.keys('*', function(err, keys) {
      if (err) {
        console.error(err);
      }
      keys.forEach(function(key) {
        var value = self.get(key);
        // console.log(key, '=', value);
      });
    });
  }
};
