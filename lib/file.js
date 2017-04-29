'use strict';

var meta = require('./meta');
var fs = require('fs');

var filePath;
var cache;

var File = {
  type: 'File',
  init(_filePath) {
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
  save(callback) {
    fs.writeFileSync(filePath, JSON.stringify(cache, null, 2));
  },
  get(key, default_value) {
    var keyMeta = meta.checkKeyMeta(this, key);
    if (keyMeta) {
      return default_value;
    }
    return cache[key] || default_value;
  },
  getItem(key, default_value) {
    return this.get(key, default_value);
  },
  getAndRemove(key) {
    var value = cache[key];
    delete cache[key];
    this.save();
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
    this.save();
    return cache[key];
  },
  setItem(key, value, config) {
    return this.set(key, value, config);
  },
  remove(key) {
    try {
      delete cache[key];
    } catch(e) {}
    this.save();
  },
  removeItem(key) {
    this.remove(key);
  },
  clear() {
    cache = {};
    this.save();
  },
  list() {
    for (var key in cache) {
      if (key !== '__vaultData') {
        console.log(key, '=', cache[key]);
      }
    }
  }
};
module.exports = File;
