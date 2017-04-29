'use strict';

var meta = require('./meta');
var Cookie = require('./cookie');
var prepare = require('./prepare');
var parse = require('./parse');

var setup = type => {
  var storage;
  try {
    storage = window[type];
    var testKey = 'vault-test';
    try {
      /*eslint-disable*/
      var test = storage['foo'];
      /*eslint-enable*/
      storage.setItem(testKey, 'bar');
      storage.removeItem(testKey);
    } catch(e) {
      storage = undefined;
    }
  } catch(e) {
    storage = undefined;
  }
  if (!storage) {
    console.warn('Vault: ' + type + ' is not suppored. I will attempt to use Cookies instead.');
    return Cookie;
  }
  return {
    type,
    get(key, default_value) {
      if (storage[key]) {
        var keyMeta = meta.checkKeyMeta(storage, key);
        if (keyMeta) {
          return default_value;
        }
        var value = parse(storage[key]);
        return (value && value.value) || value;
      }
      return default_value;
    },
    getAndRemove(key) {
      var value = this.get(key);
      this.remove(key);
      return value;
    },
    getList() {
      var list = [];
      for (var i in storage) {
        var item = {};
        var value = this.get(i);
        if (value) {
          item[i] = value;
          list.push(item);
        }
      }
      return list;
    },
    set(key, value, config) {
      if (!key) {
        return console.warn('Vault: set was called with no key.', key);
      }
      try {
        // if (type === 'sessionStorage' && config && config.expires) {
        //   delete config.expires;
        // }
        meta.setKeyMeta(storage, key, config);
        return storage.setItem(key, prepare(value));
      } catch(e) {
        console.warn('Vault: I cannot write to localStoarge even though localStorage is supported. Perhaps you are using your browser in private mode? Here is the error: ', e);
      }
    },
    remove(key) {
      meta.clearKeyMeta(storage, key);
      return storage.removeItem(key);
    },
    clear() {
      return storage.clear();
    },
    list(raw) {
      var i;
      var il = storage.length;
      if (il === 0) {
        console.log('0 items in', type);
        return undefined;
      }
      for (i in storage) {
        if (i !== '__vaultData') {
          var value = raw ? parse(storage[i]) : this.get(i);
          console.log(i, '=', value);
        }
      }
    }
  };
};
module.exports = {
  Local: setup('localStorage'),
  Session: setup('sessionStorage'),
  Cookie
};
