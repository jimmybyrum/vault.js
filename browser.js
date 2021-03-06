'use strict';
var version = require('./package.json').version;
var Cookie = require('./lib/browser').Cookie;
var Local = require('./lib/browser').Local;
var Session = require('./lib/browser').Session;
var Memory = require('./lib/memory');
var cleanup = require('./lib/cleanup');

module.exports = {
  version: version,
  Cookie: Cookie,
  Local: Local,
  Session: Session,
  Memory: Memory,

  startCleanup: cleanup.start,
  stopCleanup: cleanup.stop,
  setIntervalLength: cleanup.setIntervalLength,
  getIntervalLength: cleanup.getIntervalLength,

  set: function(key, value, config) {
    module.exports.remove(key);
    var expires = config && config.expires;
    // console.log('set', key, value, 'expires:', expires);
    if (expires === 'page') {
      Memory.set(key, value, config);
    } else if (expires === 'session') {
      Session.set(key, value, config);
    } else {
      Local.set(key, value, config);
    }
  },
  get: function(key) {
    var types = [
      Memory,
      Session,
      Local,
      Cookie
    ];
    for (var i = 0; i < types.length; i++) {
      var value = types[i].get(key);
      if (value !== undefined) {
        return value;
      }
    }
  },
  list: function(raw) {
    console.log('--== Memory ==--');
    Memory.list(raw);
    console.log('----------------');
    console.log('--== Session ==--');
    Session.list(raw);
    console.log('----------------');
    console.log('--== Local ==--');
    Local.list(raw);
    console.log('----------------');
    console.log('--== Cookie ==--');
    Cookie.list(raw);
    console.log('----------------');
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

cleanup.start([Cookie, Local, Session, Memory]);
