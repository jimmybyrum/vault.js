import { start, stop, setIntervalLength, getIntervalLength } from './lib/cleanup';
import _File from './lib/file';
import _Memory from './lib/memory';
import { Config, File as F, Memory as M, Vault as V } from './types'

console.log(`Vault (${process.env.npm_package_version})`);

export const File: F = _File;
export const Memory: M = _Memory;
export const Vault: V = {
  type: '',
  version: process.env.npm_package_version,
  File: _File,
  Memory: _Memory,
  startCleanup: start,
  stopCleanup: stop,
  setIntervalLength: setIntervalLength,
  getIntervalLength: getIntervalLength,

  set: function(key: string, value: any, config: Config = {}) {
    this.remove(key);
    if (config.expires && config.expires === 'session') {
      _Memory.set(key, value, config);
    } else {
      _File.set(key, value, config);
    }
  },

  get: function(key: string) {
    const types = [
      _Memory,
      _File
    ];
    let i;
    for (i = 0; i < types.length; i++) {
      const value = types[i].get(key);
      if (value !== undefined) {
        return value;
      }
    }
  },

  list: function() {
    console.log('--== Memory ==--');
    _Memory.list();
    console.log('----------------');
    console.log('--== File ==--');
    _File.list();
    console.log('----------------');
  },

  getLists: function() {
    return {
      Memory: _Memory.getList(),
      File: _File.getList()
    };
  },

  remove: function(key: string) {
    _Memory.remove(key);
    _File.remove(key);
  },

  clear: function() {
    _Memory.clear();
    _File.clear();
  }
};
