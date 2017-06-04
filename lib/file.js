'use strict';

var meta = require('./meta');
var fs = require('fs');

var filePath;
var cache;

var File = {
  type: 'File',
  init: function(_filePath) {
    filePath = _filePath;
    try {
      cache = fs.readFileSync(_filePath);
    } catch(e) {
      fs.writeFileSync(_filePath, JSON.stringify({}, null, 2));
    }
    if (cache) {
      try {
        cache = JSON.parse(cache);
      } catch(e) {}
    } else {
      cache = {};
    }
    return this;
  },
  save: function(callback) {
    fs.writeFileSync(filePath, JSON.stringify(cache, null, 2));
  },
  get: function(key, default_value) {
    var keyMeta = meta.checkKeyMeta(this, key);
    if (keyMeta) {
      return default_value;
    }
    var cacheKey = cache[key];
    if (cacheKey === undefined) {
      return default_value;
    }
    return cacheKey;
  },
  getItem: function(key, default_value) {
    return this.get(key, default_value);
  },
  getAndRemove: function(key) {
    var value = cache[key];
    delete cache[key];
    this.save();
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
    this.save();
    return cache[key];
  },
  setItem: function(key, value, config) {
    return this.set(key, value, config);
  },
  remove: function(key) {
    try {
      delete cache[key];
    } catch(e) {}
    this.save();
  },
  removeItem: function(key) {
    this.remove(key);
  },
  clear: function() {
    cache = {};
    this.save();
  },
  list: function() {
    for (var key in cache) {
      if (key !== '__vaultData') {
        console.log(key, '=', cache[key]);
      }
    }
  }
};
module.exports = File;
