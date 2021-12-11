import { checkKeyMeta, setKeyMeta } from './meta';
import parse from './parse';
import { vaultData } from './config';
import { Cache, Config, Memory } from '../types';

let cache: Cache = {};

const Memory: Memory = {
  type: 'Memory',
  get: function(key: string, default_value: any = undefined) {
    const keyMeta = checkKeyMeta(this, key);
    if (keyMeta) {
      return default_value;
    }
    const cachedValue = cache[key];
    if (cachedValue === undefined) {
      return default_value;
    }
    return cachedValue;
  },
  getItem: function(key: string, default_value: any = undefined) {
    return this.get(key, default_value);
  },
  getAndRemove: function(key: string) {
    const value = cache[key];
    delete cache[key];
    return value;
  },
  getList: function() {
    const list = [];
    let key;
    for (key in cache) {
      const obj: Cache = {};
      obj[key] = this.get(key);
      list.push(obj);
    }
    return list;
  },
  set: function(key: string, value: any, config: Config) {
    if (!key) {
      return console.warn('Vault: set was called with no key.', key);
    }
    cache[key] = parse(value);
    setKeyMeta(this, key, config);
    return cache[key];
  },
  setItem: function(key: string, value: any, config: Config) {
    return this.set(key, value, config);
  },
  remove: function(key: string) {
    try {
      delete cache[key];
    } catch (e) {
    }
  },
  removeItem: function(key: string) {
    this.remove(key);
  },
  clear: function() {
    cache = {};
  },
  list: function() {
    let key;
    for (key in cache) {
      if (key !== vaultData) {
        const value = this.get(key);
        console.log('key = ', value, typeof value);
      }
    }
  }
};
export default Memory;
