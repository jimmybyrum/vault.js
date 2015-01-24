'use strict';
var conf = require('./config');
var prepare = require('./prepare');
var parse = require('./parse');
var getExpires = require('./getExpires');

var getData = function(storage) {
  var vaultDataDictionary = storage.getItem(conf.vaultData);
  if (!vaultDataDictionary) {
    vaultDataDictionary = {};
  }
  if (typeof vaultDataDictionary === 'string') {
    vaultDataDictionary = JSON.parse(vaultDataDictionary);
  }
  return vaultDataDictionary;
};
var setKeyMeta = function(storage, key, config) {
  if (key === conf.vaultData) {
    return false;
  }
  config = config || {};
  var vaultDataDictionary = getData(storage);
  if (!vaultDataDictionary[key]) {
    vaultDataDictionary[key] = {};
  }
  if (config.expires) {
    var expires = getExpires(config);
    vaultDataDictionary[key].expires = expires && expires.valueOf();
  } else {
    delete vaultDataDictionary[key].expires;
  }
  if (config.path) {
    vaultDataDictionary[key].path = config.path;
  } else {
    delete vaultDataDictionary[key].path;
  }
  storage.setItem(conf.vaultData, prepare(vaultDataDictionary));
};
var getKeyMeta = function(storage, key) {
  if (key === conf.vaultData) {
    return false;
  }
  try {
    var vaultDataDictionary = getData(storage);
    return vaultDataDictionary[key];
  } catch(e) {
    return undefined;
  }
};
var clearKeyMeta = function(storage, key) {
  if (key === conf.vaultData) {
    return false;
  }
  try {
    var vaultDataDictionary = getData(storage);
    delete vaultDataDictionary[key];
    storage.setItem(conf.vaultData, prepare(vaultDataDictionary));
  } catch(e) {}
};
var checkKeyMeta = function(storage, key) {
  if (key === conf.vaultData) {
    return false;
  }
  try {
    var obj = parse(storage[key]);

    var keyMeta = getKeyMeta(storage, key);
    // console.warn('keyMeta:', keyMeta);
    if (keyMeta) {
      if (keyMeta.path) {
        var storagePath = window.location.pathname || window.location.path;
        if (!storagePath.match(keyMeta.path)) {
          // console.warn('Data found for ' + key + ' but paths do not match. The browser is at ' + path + ' and the key is for ' + keyMeta.path);
          return true;
        }
      }

      // TODO: deprecate obj.expires
      if (!keyMeta.expires && obj && obj.expires) {
        keyMeta.expires = obj.expires;
      }

      if (keyMeta.expires && keyMeta.expires <= new Date()) {
        var expired = new Date(keyMeta.expires).toString();
        console.log('Removing expired item: ' + key + '. It expired on: ' + expired);
        clearKeyMeta(storage, key);
        storage.removeItem(key);
        return true;
      }
    }
  } catch(e) {
    console.warn('Vault Error:', e);
  }
  return false;
};

module.exports = {
  getData: getData,
  setKeyMeta: setKeyMeta,
  getKeyMeta: getKeyMeta,
  clearKeyMeta: clearKeyMeta,
  checkKeyMeta: checkKeyMeta
};
