'use strict';
if (typeof window !== 'undefined') {
  module.exports = require('./browser');
} else {
  var Redis = require('./lib/redis');
  var File = require('./lib/file');

  module.exports = {
    Redis: Redis,
    File: File,
    set: function(key, value, config) {
      if (Redis.isCapable) {
        return Redis.set(key, value, config);
      }
      return File.set(key, value, config);
    },
    get: function(key, default_value) {
      if (Redis.isCapable) {
        return Redis.get(key, default_value);
      }
      return File.get(key, default_value);
    },
    getAndRemove: function(key, default_value) {
      var value = this.get(key, default_value);
      this.remove(key);
      return value;
    },
    list: function(raw) {
      console.log('--== Redis ==--');
      Redis.list(raw);
      console.log('--== File ==--');
      File.list(raw);
    },
    getLists: function() {
      return {
        Redis: Redis.getList(),
        File: File.getList()
      };
    },
    remove: function(key) {
      Redis.remove(key);
      File.remove(key);
    },
    clear: function() {
      Redis.clear();
      File.clear();
    }
  };
}
