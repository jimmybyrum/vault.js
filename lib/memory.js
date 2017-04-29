'use strict';

var meta = require('./meta');
var parse = require('./parse');

var cache = {};

var Memory = {
  type: 'Memory',
  get(key, default_value) {
    var keyMeta = meta.checkKeyMeta(this, key);
    if (keyMeta) {
      return default_value;
    }
    return parse(cache[key]) || default_value;
  },
  getItem(key, default_value) {
    return this.get(key, default_value);
  },
  getAndRemove(key) {
    var value = cache[key];
    delete cache[key];
    return value;
  },
  getList() {
    var list = [];
    for (var key in cache) {
      var obj = {};
      var value = this.get(key);
      if (value) {
        obj[key] = value;
        list.push(obj);
      }
    }
    return list;
  },
  set(key, value, config) {
    if (!key) {
      return console.warn('Vault: set was called with no key.', key);
    }
    cache[key] = value;
    meta.setKeyMeta(this, key, config);
    return cache[key];
  },
  setItem(key, value, config) {
    return this.set(key, value, config);
  },
  remove(key) {
    try {
      delete cache[key];
    } catch(e) {}
  },
  removeItem(key) {
    this.remove(key);
  },
  clear() {
    cache = {};
  },
  list() {
    for (var key in cache) {
      if (key !== '__vaultData') {
        console.log(key, '=', cache[key]);
      }
    }
  }
};
module.exports = Memory;
