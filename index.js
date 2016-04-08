'use strict';

var version = require('./package.json').version;

if (typeof window !== 'undefined') {
  module.exports = require('./browser');
} else {
  var conf = require('./lib/config');
  var path = require('path');
  var appDir = path.dirname(require.main.filename);
  var _file = appDir + conf.vaultFile;
  var File = require('./lib/file');
  console.log('Vault (' + version + ') File:', _file);
  module.exports = {
    version: version,
    File: File.init(_file),
    Memory: require('./lib/memory')
  };
}
