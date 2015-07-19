'use strict';
var version = require('../package.json').version;
var meta = require('./meta');
var Cookie = require('./cookie');
var prepare = require('./prepare');
var parse = require('./parse');

var setup = function(type) {
  var storage;
  try {
    storage = window[type];
    try {
      /*eslint-disable*/
      var test = storage['foo'];
      /*eslint-enable*/
    } catch(e) {
      storage = undefined;
    }
  } catch(e) {
    storage = undefined;
  }
  if (!storage) {
    // console.warn('Vault: ' + type + ' is not suppored. I will attempt to use Cookies instead.');
    return Cookie;
  }
  return {
    type: type,
    get: function(key, default_value) {
      if (storage[key]) {
        var keyMeta = meta.checkKeyMeta(storage, key);
        if (keyMeta) {
          return default_value;
        }
        var value = parse(storage[key]);
        return value.value || value;
      }
      return default_value;
    },
    getAndRemove: function(key) {
      var value = this.get(key);
      this.remove(key);
      return value;
    },
    getList: function() {
      var list = [];
      for (var i in storage) {
        var item = {};
        item[i] = this.get(i);
        list.push(item);
      }
      return list;
    },
    set: function(key, value, config) {
      try {
        if (type === 'sessionStorage' && config && config.expires) {
          delete config.expires;
        }
        meta.setKeyMeta(storage, key, config);
        return storage.setItem(key, prepare(value));
      } catch(e) {
        console.warn('Vault: I cannot write to localStoarge even though localStorage is supported. Perhaps you are using your browser in private mode? Here is the error: ', e);
      }
    },
    remove: function(key) {
      meta.clearKeyMeta(storage, key);
      return storage.removeItem(key);
    },
    clear: function() {
      return storage.clear();
    },
    list: function(raw) {
      var i, il = storage.length;
      if (il === 0) {
        console.log('0 items in ' + type);
        return undefined;
      }
      for (i in storage) {
        var value = raw ? parse(storage[i]) : this.get(i);
        console.log(i, '=', value);
      }
    }
  };
};
module.exports = {
  version: version,
  Local: setup('localStorage'),
  Session: setup('sessionStorage'),
  Cookie: Cookie
};
