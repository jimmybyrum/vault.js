'use strict';

var meta = require('./meta');
var parse = require('./parse');

var cache = {};

var Memory = {
  type: 'Memory',
  get: function(key, default_value) {
    var keyMeta = meta.checkKeyMeta(this, key);
    if (keyMeta) {
      return default_value;
    }
    var cacheKey = cache[key];
    if (cacheKey === undefined) {
      return default_value;
    }
    return parse(cacheKey);
  },
  getItem: function(key, default_value) {
    return this.get(key, default_value);
  },
  getAndRemove: function(key) {
    var value = cache[key];
    delete cache[key];
    return value;
  },
  getList: function() {
    var list = [];
    for (var key in cache) {
      var obj = {};
      var value = this.get(key);
      obj[key] = value;
      list.push(obj);
    }
    return list;
  },
  set: function(key, value, config) {
    if (!key) {
      return console.warn('Vault: set was called with no key.', key);
    }
    cache[key] = value;
    meta.setKeyMeta(this, key, config);
    return cache[key];
  },
  setItem: function(key, value, config) {
    return this.set(key, value, config);
  },
  remove: function(key) {
    try {
      delete cache[key];
    } catch(e) {}
  },
  removeItem: function(key) {
    this.remove(key);
  },
  clear: function() {
    cache = {};
  },
  list: function() {
    for (var key in cache) {
      if (key !== '__vaultData') {
        console.log(key, '=', cache[key]);
      }
    }
  }
};
module.exports = Memory;
