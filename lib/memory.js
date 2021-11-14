import { checkKeyMeta, setKeyMeta } from './meta.js';
import parse from './parse.js';

let cache = {};

const Memory = {
  type: 'Memory',
  get: function(key, default_value) {
    const keyMeta = checkKeyMeta(this, key);
    if (keyMeta) {
      return default_value;
    }
    const cacheKey = cache[key];
    if (cacheKey === undefined) {
      return default_value;
    }
    return parse(cacheKey);
  },
  getItem: function(key, default_value) {
    return this.get(key, default_value);
  },
  getAndRemove: function(key) {
    const value = cache[key];
    delete cache[key];
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
    let key;
    for (key in cache) {
      if (key !== '__vaultData') {
        console.log(key, '=', cache[key]);
      }
    }
  }
};
export default Memory;
