import { Cookie, Local, Session } from './lib/browser.js';
import Memory from './lib/memory.js';
import { start, stop, setIntervalLength, getIntervalLength } from './lib/cleanup.js';
import { readFileSync } from 'fs';
const pkg = JSON.parse(readFileSync('./package.json'));

export default {
  version: pkg.version,
  Cookie: Cookie,
  Local: Local,
  Session: Session,
  Memory: Memory,

  startCleanup: start,
  stopCleanup: stop,
  setIntervalLength: setIntervalLength,
  getIntervalLength: getIntervalLength,

  set: function(key, value, config) {
    module.exports.remove(key);
    const expires = config && config.expires;
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
    const types = [
      Memory,
      Session,
      Local,
      Cookie
    ];
    let i;
    for (i = 0; i < types.length; i++) {
      const value = types[i].get(key);
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

start([Cookie, Local, Session, Memory]);
