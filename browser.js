'use strict';
var version = require('./package.json').version;
var Cookie = require('./lib/browser').Cookie;
var Local = require('./lib/browser').Local;
var Session = require('./lib/browser').Session;
var Memory = require('./lib/memory');
var cleanup = require('./lib/cleanup');

module.exports = {
  version,
  Cookie,
  Local,
  Session,
  Memory,

  startCleanup: cleanup.start,
  stopCleanup: cleanup.stop,
  setIntervalLength: cleanup.setIntervalLength,
  getIntervalLength: cleanup.getIntervalLength,

  set(key, value, config) {
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
  get(key) {
    return Memory.get(key) || Session.get(key) || Local.get(key) || Cookie.get(key);
  },
  list(raw) {
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
  getLists() {
    return {
      Memory: Memory.getList(),
      Session: Session.getList(),
      Local: Local.getList(),
      Cookie: Cookie.getList()
    };
  },
  remove(key) {
    Memory.remove(key);
    Session.remove(key);
    Local.remove(key);
    Cookie.remove(key);
  },
  clear() {
    Memory.clear();
    Session.clear();
    Local.clear();
    Cookie.clear();
  }
};

cleanup.start([Cookie, Local, Session, Memory]);
