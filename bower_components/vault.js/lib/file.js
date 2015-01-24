'use strict';
var conf = require('./config');
var meta = require('./meta');
var fs = require('fs');
var path = require('path');
var appDir = path.dirname();
var _file = appDir + conf.vaultFile;
var cache;
try {
  cache = fs.readFileSync(_file);
} catch(e) {
  fs.writeFileSync(_file, JSON.stringify({}, null, 2));
}
if (cache) {
  try {
    cache = JSON.parse(cache);
  } catch(e) {}
} else {
  cache = {};
}
var File = {
  type: 'File',
  save: function(callback) {
    fs.writeFileSync(_file, JSON.stringify(cache, null, 2));
  },
  get: function(key, default_value) {
    var keyMeta = meta.checkKeyMeta(this, key);
    if (keyMeta) {
      return default_value;
    }
    return cache[key] || default_value;
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
      obj[key] = cache[key];
      list.push(obj);
    }
    return list;
  },
  set: function(key, value, config) {
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
      console.log(key, '=', cache[key]);
    }
  }
};
module.exports = File;
