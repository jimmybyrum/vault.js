import prepare from './prepare';
import parse from './parse';
import getExpires from './getExpires';
import { Cache, Config, Cookie } from '../types';

const isBrowser = typeof window !== 'undefined';

const Cookie: Cookie = {
  type: 'cookie',
  parse: function(value: any) {
    return parse(decodeURIComponent(value));
  },
  get: function(cookie: string, default_value: any = undefined) {
    const cookies = document.cookie.split(';');
    const cl = cookies.length;
    let c;
    for (c = 0; c < cl; c++) {
      const pair = cookies[c].split('=');
      pair[0] = pair[0].replace(/^[ ]/, '');
      if (pair[0] === cookie) {
        return this.parse(pair[1]);
      }
    }
    return default_value;
  },
  getItem: function(cookie: string, default_value: any = undefined) {
    return this.get(cookie, default_value);
  },
  getAndRemove: function(key: string, config: Config) {
    const value = this.get(key);
    this.remove(key, config);
    return value;
  },
  getList: function() {
    const list = [];
    if (isBrowser && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      const cl = cookies.length;
      let c;
      for (c = 0; c < cl; c++) {
        const pair = cookies[c].split('=');
        pair[0] = pair[0].replace(/^[ ]/, '');
        const item: Cache = {};
        item[pair[0]] = this.parse(pair[1]);
        list.push(item);
      }
    }
    return list;
  },
  set: function(key: string, value: any, config: Config = {}) {
    if (!key) {
      return console.warn('Vault: set was called with no key.', key);
    }
    let expires = '';
    if (config.expires) {
      const exp = getExpires(config);
      expires = '; expires=' + exp.toUTCString();
    }
    let max_age = '';
    if (config.max_age) {
      max_age = '; max-age=' + config.max_age;
    }
    let domain = '';
    if (config.domain) {
      domain = '; domain=' + config.domain;
    }
    let cookiePath = '';
    if (config.path) {
      cookiePath = '; path=' + config.path;
    }
    const secure = (config.secure) ? '; secure' : '';
    // always encode cookie values because JSON cookie values
    // can cause problems.
    value = encodeURIComponent(prepare(value)) + cookiePath + domain + max_age + expires + secure;
    // console.log('Vault: set cookie "' + key + '": ' + value);
    document.cookie = key + '=' + value;
  },
  setItem: function(key: string, value: any, config: Config = {}) {
    return this.set(key, value, config);
  },
  remove: function(key: string, config: Config = {}) {
    config.expires = '1970-01-01T00:00:01Z';
    this.set(key, '', config);
  },
  removeItem: function(key: string, config: Config = {}) {
    this.remove(key, config);
  },
  clear: function() {
    const cookies = document.cookie.split(';');
    const cl = cookies.length;
    let c;
    for (c = 0; c < cl; c++) {
      const pair = cookies[c].split('=');
      pair[0] = pair[0].replace(/^[ ]/, '');
      this.remove(pair[0]);
    }
  },
  list: function() {
    const cookies = document.cookie.split(';');
    const cl = cookies.length;
    if (document.cookie === '' || cl === 0) {
      console.log('0 cookies');
      return undefined;
    }
    let c;
    for (c = 0; c < cl; c++) {
      const pair = cookies[c].split('=');
      pair[0] = pair[0].replace(/^[ ]/, '');
      console.log(pair[0], '=', this.parse(pair[1]));
    }
  }
};
export default Cookie;
