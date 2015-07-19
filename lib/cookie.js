'use strict';
var pkg = require('../package.json');
var prepare = require('./prepare');
var parse = require('./parse');
var getExpires = require('./getExpires');

var Cookie = {
  version: pkg.version,
  type: 'cookie',
  get: function(cookie, default_value) {
    var cookies = document.cookie.split(';');
    var cl = cookies.length;
    for (var c = 0; c < cl; c++) {
      var pair = cookies[c].split('=');
      pair[0] = pair[0].replace(/^[ ]/, '');
      if (pair[0] === cookie) {
        return parse(pair[1]);
      }
    }
    return default_value;
  },
  getAndRemove: function(key, config) {
    var value = this.get(key);
    this.remove(key, config);
    return value;
  },
  getList: function() {
    var list = [];
    if (document.cookie !== '') {
      var cookies = document.cookie.split(';');
      var cl = cookies.length;
      for (var c = 0; c < cl; c++) {
        var pair = cookies[c].split('=');
        pair[0] = pair[0].replace(/^[ ]/, '');
        var item = {};
        item[pair[0]] = parse(pair[1]);
        list.push(item);
      }
    }
    return list;
  },
  set: function(key, value, config) {
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
    value = prepare(value) + cookiePath + domain + max_age + expires + secure;
    console.log('Vault: set cookie "' + key + '": ' + value);
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
    var cookies = document.cookie.split(';');
    var cl = cookies.length;
    for (var c = 0; c < cl; c++) {
      var pair = cookies[c].split('=');
      pair[0] = pair[0].replace(/^[ ]/, '');
      this.remove(pair[0]);
    }
  },
  list: function() {
    var cookies = document.cookie.split(';');
    var cl = cookies.length;
    if (document.cookie === '' || cl === 0) {
      console.log('0 cookies');
      return undefined;
    }
    for (var c = 0; c < cl; c++) {
      var pair = cookies[c].split('=');
      pair[0] = pair[0].replace(/^[ ]/, '');
      console.log(pair[0], '=', parse(pair[1]));
    }
  }
};
module.exports = Cookie;
