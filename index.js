'use strict';

var version = require('./package.json').version;

if (typeof window !== 'undefined') {
  module.exports = require('./browser');
} else {
  var conf = require('./lib/config');
  var cleanup = require('./lib/cleanup');
  var path = require('path');
  var appDir = path.dirname((require.main && require.main.filename) || '.');
  var _file = appDir + conf.vaultFile;
  var File = require('./lib/file');
  var Memory = require('./lib/memory');
  console.log('Vault (' + version + ') File:', _file);
  module.exports = {
    version: version,
    startCleanup: cleanup.start,
    stopCleanup: cleanup.stop,
    setIntervalLength: cleanup.setIntervalLength,
    File: File.init(_file),
    Memory: Memory,

    set: function(key, value, config) {
      if (config && config.expires && config.expires === 'session') {
        return Memory.set(key, value, config);
      }
      return File.set(key, value, config);
    },
    get: function(key) {
      return File.get(key) || Memory.get(key);
    },
    list: function(raw) {
      console.log('--== Memory ==--');
      Memory.list(raw);
      console.log('--== File ==--');
      File.list(raw);
    },
    getLists: function() {
      return {
        Memory: Memory.getList(),
        File: File.getList()
      };
    },
    remove: function(key) {
      Memory.remove(key);
      File.remove(key);
    },
    clear: function() {
      Memory.clear();
      File.clear();
    }
  };
  cleanup.start([File, Memory]);
}
