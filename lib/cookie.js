'use strict';
var prepare = require('./prepare');
var parse = require('./parse');
var getExpires = require('./getExpires');

var Cookie = {
  type: 'cookie',
  parse(value) {
    return parse(decodeURIComponent(value));
  },
  get(cookie, default_value) {
    var cookies = document.cookie.split(';');
    var cl = cookies.length;
    for (var c = 0; c < cl; c++) {
      var pair = cookies[c].split('=');
      pair[0] = pair[0].replace(/^[ ]/, '');
      if (pair[0] === cookie) {
        return this.parse(pair[1]);
      }
    }
    return default_value;
  },
  getAndRemove(key, config) {
    var value = this.get(key);
    this.remove(key, config);
    return value;
  },
  getList() {
    var list = [];
    if (document.cookie !== '') {
      var cookies = document.cookie.split(';');
      var cl = cookies.length;
      for (var c = 0; c < cl; c++) {
        var pair = cookies[c].split('=');
        pair[0] = pair[0].replace(/^[ ]/, '');
        var item = {};
        item[pair[0]] = this.parse(pair[1]);
        list.push(item);
      }
    }
    return list;
  },
  set(key, value, config) {
    if (!key) {
      return console.warn('Vault: set was called with no key.', key);
    }
    var expires = '';
    if (config && config.expires) {
      var exp = getExpires(config);
      expires = '; expires=' + exp.toUTCString();
    }
    var max_age = '';
    if (config && config.max_age) {
      max_age = '; max-age=' + config.max_age;
    }
    var domain = '';
    if (config && config.domain) {
      domain = '; domain=' + config.domain;
    }
    var cookiePath = '';
    if (config && config.path) {
      cookiePath = '; path=' + config.path;
    }
    var secure = (config && config.secure) ? '; secure' : '';
    // always encode cookie values because JSON cookie values
    // can cause problems.
    value = encodeURIComponent(prepare(value)) + cookiePath + domain + max_age + expires + secure;
    // console.log('Vault: set cookie "' + key + '": ' + value);
    document.cookie = key + '=' + value;
  },
  remove(key, config) {
    if (!config) {
      config = {};
    }
    config.expires = '1970-01-01T00:00:01Z';
    this.set(key, '', config);
  },
  clear() {
    var cookies = document.cookie.split(';');
    var cl = cookies.length;
    for (var c = 0; c < cl; c++) {
      var pair = cookies[c].split('=');
      pair[0] = pair[0].replace(/^[ ]/, '');
      this.remove(pair[0]);
    }
  },
  list() {
    var cookies = document.cookie.split(';');
    var cl = cookies.length;
    if (document.cookie === '' || cl === 0) {
      console.log('0 cookies');
      return undefined;
    }
    for (var c = 0; c < cl; c++) {
      var pair = cookies[c].split('=');
      pair[0] = pair[0].replace(/^[ ]/, '');
      console.log(pair[0], '=', this.parse(pair[1]));
    }
  }
};
module.exports = Cookie;
