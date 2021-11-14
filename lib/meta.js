import { vaultData } from './config.js';
import prepare from './prepare.js';
import parse from './parse.js';
import getExpires from './getExpires.js';

export const getData = function(storage) {
  let vaultDataDictionary = storage.getItem(vaultData);
  if (!vaultDataDictionary) {
    vaultDataDictionary = {};
  }
  if (typeof vaultDataDictionary === 'string') {
    vaultDataDictionary = JSON.parse(vaultDataDictionary);
  }
  return vaultDataDictionary;
};
export const setKeyMeta = function(storage, key, config) {
  if (key === vaultData) {
    return false;
  }
  config = config || {};
  let vaultDataDictionary = getData(storage);
  if (!vaultDataDictionary[key]) {
    vaultDataDictionary[key] = {};
  }
  if (config.expires) {
    const expires = getExpires(config);
    vaultDataDictionary[key].expires = expires && expires.valueOf();
  } else {
    delete vaultDataDictionary[key].expires;
  }
  if (config.path) {
    vaultDataDictionary[key].path = config.path;
  } else {
    delete vaultDataDictionary[key].path;
  }
  storage.setItem(vaultData, prepare(vaultDataDictionary));
};
export const getKeyMeta = function(storage, key) {
  if (key === vaultData) {
    return false;
  }
  try {
    const vaultDataDictionary = getData(storage);
    return vaultDataDictionary[key];
  } catch(e) {
    return undefined;
  }
};
export const clearKeyMeta = function(storage, key) {
  if (key === vaultData) {
    return false;
  }
  try {
    let vaultDataDictionary = getData(storage);
    delete vaultDataDictionary[key];
    storage.setItem(vaultData, prepare(vaultDataDictionary));
  } catch(e) {}
};
export const checkKeyMeta = function(storage, key) {
  if (key === vaultData) {
    return false;
  }
  try {
    const obj = parse(storage[key]);

    let keyMeta = getKeyMeta(storage, key);
    // console.warn('keyMeta:', keyMeta);
    if (keyMeta) {
      if (keyMeta.path && typeof window !== 'undefined') {
        const storagePath = window.location.pathname || window.location.path;
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
        const expired = new Date(keyMeta.expires).toString();
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
