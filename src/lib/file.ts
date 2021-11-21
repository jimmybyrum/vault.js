import path from 'path';
import { vaultData, vaultFile } from './config';
import { checkKeyMeta, setKeyMeta } from './meta';
import { readFileSync, writeFileSync } from 'fs';
import { Cache, Config, Storage } from '../types';

let filePath: string;
let cache: Cache = {};

const File: Storage = {
  type: 'File',
  init: function() {
    filePath = this.getFile();
    console.log(`Vault File: ${filePath}`);
    try {
      cache = readFileSync(filePath);
    } catch (e) {
    }
    if (cache) {
      try {
        cache = JSON.parse(cache.toString());
      } catch (e) {
      }
    } else {
      cache = {};
    }
  },
  getFile: function() {
    return path.resolve(path.dirname('.'), vaultFile);
  },
  save: function() {
    if (!filePath) {
      this.init();
    }
    writeFileSync(filePath, JSON.stringify(cache, null, 2));
  },
  get: function(key: string, default_value: any = undefined) {
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
  getItem: function(key: string, default_value: any = undefined) {
    return this.get(key, default_value);
  },
  getAndRemove: function(key: string) {
    const value = cache[key];
    delete cache[key];
    this.save();
    return value;
  },
  getList: function() {
    let list = [], key: string;
    for (key in cache) {
      let obj: Cache = {};
      obj[key] = this.get(key);
      list.push(obj);
    }
    return list;
  },
  set: function(key: string, value: any, config: Config) {
    if (!key) {
      return console.warn('Vault: set was called with no key.', key);
    }
    cache[key] = value;
    setKeyMeta(this, key, config);
    this.save();
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
    this.save();
  },
  removeItem: function(key: string) {
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
