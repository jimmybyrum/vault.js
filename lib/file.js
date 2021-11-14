import { checkKeyMeta, setKeyMeta } from './meta.js';
import { vaultData } from './config.js';
import { readFileSync, writeFileSync } from 'fs';

let filePath;
let cache;

const File = {
  type: 'File',
  init: function(_filePath) {
    filePath = _filePath;
    try {
      cache = readFileSync(_filePath);
    } catch(e) {
      writeFileSync(_filePath, JSON.stringify({}, null, 2));
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
    writeFileSync(filePath, JSON.stringify(cache, null, 2));
  },
  get: function(key, default_value) {
    const keyMeta = checkKeyMeta(this, key);
    if (keyMeta) {
      return default_value;
    }
    const cacheKey = cache[key];
    if (cacheKey === undefined) {
      return default_value;
    }
    return cacheKey;
  },
  getItem: function(key, default_value) {
    return this.get(key, default_value);
  },
  getAndRemove: function(key) {
    const value = cache[key];
    delete cache[key];
    this.save();
    return value;
  },
  getList: function() {
    let list = [], key;
    for (key in cache) {
      let obj = {};
      const value = this.get(key);
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
    setKeyMeta(this, key, config);
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
    let key;
    for (key in cache) {
      if (key !== vaultData) {
        console.log(key, '=', cache[key]);
      }
    }
  }
};
export default File;
