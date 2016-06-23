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

  set: function(key, value, config) {
    // console.log('set', key, value, config);
    module.exports.remove(key);
    if (config && config.expires && config.expires === 'session') {
      Session.set(key, value, config);
    }
    Local.set(key, value, config);
  },
  get: function(key) {
    return Memory.get(key) || Session.get(key) || Local.get(key) || Cookie.get(key);
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
