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
    getIntervalLength: cleanup.getIntervalLength,
    File: File.init(_file),
    Memory: Memory,

    set: function(key, value, config) {
      module.exports.remove(key);
      if (config && config.expires && config.expires === 'session') {
        Memory.set(key, value, config);
      } else {
        File.set(key, value, config);
      }
    },
    get: function(key) {
      var types = [
        Memory,
        File
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
      console.log('--== File ==--');
      File.list(raw);
      console.log('----------------');
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
