'use strict';
var version = require('./package.json').version;
var Cookie = require('./lib/browser').Cookie;
var Local = require('./lib/browser').Local;
var Session = require('./lib/browser').Session;
var Memory = require('./lib/memory');

module.exports = {
  version: version,
  Cookie: Cookie,
  Local: Local,
  Session: Session,
  Memory: Memory,
  set: function(key, value, config) {
    if (config && config.expires) {
      return Local.set(key, value, config);
    } else {
      return Session.set(key, value, config);
    }
    return Cookie.set(key, value, config);
  },
  get: function(key) {
    return Memory.get(key) || Session.get(key) || Local.get(key) || Cookie.get(key);
  },
  list: function(raw) {
    console.log('--== Memory ==--');
    Memory.list(raw);
    console.log('--== Session ==--');
    Session.list(raw);
    console.log('--== Local ==--');
    Local.list(raw);
    console.log('--== Cookie ==--');
    Cookie.list(raw);
  },
  getLists: function() {
    return {
      Memory: Memory.getList(),
      Session: Session.getList(),
      Local: Local.getList(),
      Cookie: Cookie.getList()
    };
  },
  remove: function(key) {
    Memory.remove(key);
    Session.remove(key);
    Local.remove(key);
    Cookie.remove(key);
  },
  clear: function() {
    Memory.clear();
    Session.clear();
    Local.clear();
    Cookie.clear();
  }
};
