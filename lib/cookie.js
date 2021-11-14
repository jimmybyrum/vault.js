import prepare from './prepare.js';
import parse from './parse.js';
import getExpires from './getExpires.js';

const isBrowser = typeof window !== 'undefined';

const Cookie = {
  type: 'cookie',
  parse: function(value) {
    return parse(decodeURIComponent(value));
  },
  get: function(cookie, default_value) {
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
  getAndRemove: function(key, config) {
    const value = this.get(key);
    this.remove(key, config);
    return value;
  },
  getList: function() {
    let list = [];
    if (isBrowser && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      const cl = cookies.length;
      let c;
      for (c = 0; c < cl; c++) {
        let pair = cookies[c].split('=');
        pair[0] = pair[0].replace(/^[ ]/, '');
        let item = {};
        item[pair[0]] = this.parse(pair[1]);
        list.push(item);
      }
    }
    return list;
  },
  set: function(key, value, config) {
    if (!key) {
      return console.warn('Vault: set was called with no key.', key);
    }
    let expires = '';
    if (config && config.expires) {
      const exp = getExpires(config);
      expires = '; expires=' + exp.toUTCString();
    }
    let max_age = '';
    if (config && config.max_age) {
      max_age = '; max-age=' + config.max_age;
    }
    let domain = '';
    if (config && config.domain) {
      domain = '; domain=' + config.domain;
    }
    let cookiePath = '';
    if (config && config.path) {
      cookiePath = '; path=' + config.path;
    }
    const secure = (config && config.secure) ? '; secure' : '';
    // always encode cookie values because JSON cookie values
    // can cause problems.
    value = encodeURIComponent(prepare(value)) + cookiePath + domain + max_age + expires + secure;
    // console.log('Vault: set cookie "' + key + '": ' + value);
    document.cookie = key + '=' + value;
  },
  remove: function(key, config) {
    if (!config) {
      config = {};
    }
    config.expires = '1970-01-01T00:00:01Z';
    this.set(key, '', config);
  },
  clear: function() {
    const cookies = document.cookie.split(';');
    const cl = cookies.length;
    let c;
    for (c = 0; c < cl; c++) {
      let pair = cookies[c].split('=');
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
