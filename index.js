import { vaultFile } from './lib/config.js';
import { start, stop, setIntervalLength, getIntervalLength } from './lib/cleanup.js';
import path from 'path';
import File from './lib/file.js';
import _Memory from './lib/memory.js';
import VaultBrowser from './browser.js';
import { readFileSync } from 'fs';
const pkg = JSON.parse(readFileSync('./package.json'));

const isBrowser = typeof window !== 'undefined';

export let _File;
export let Memory = _Memory;

if (!isBrowser) {
  const appDir = path.dirname('.');
  const _file = appDir + vaultFile;
  console.log('Vault (' + pkg.version + ') File:', _file);
  _File = File.init(_file);
  start([File, Memory]);
}

export const Browser = VaultBrowser;

const Vault = {
  version: pkg.version,
  File: _File,
  Memory: Memory,
  startCleanup: start,
  stopCleanup: stop,
  setIntervalLength: setIntervalLength,
  getIntervalLength: getIntervalLength,
  set: _set,
  get: _get,
  list: _list,
  getLists: _getLists,
  remove: _remove,
  clear: _clear
};
export default Vault;

function _set(key, value, config) {
  _remove(key);
  if (config && config.expires && config.expires === 'session') {
    Memory.set(key, value, config);
  } else {
    File.set(key, value, config);
  }
}

function _get(key) {
  const types = [
    Memory,
    File
  ];
  let i;
  for (i = 0; i < types.length; i++) {
    const value = types[i].get(key);
    if (value !== undefined) {
      return value;
    }
  }
}

function _list(raw) {
  console.log('--== Memory ==--');
  Memory.list(raw);
  console.log('----------------');
  console.log('--== File ==--');
  File.list(raw);
  console.log('----------------');
}

function _getLists() {
  return {
    Memory: Memory.getList(),
    File: File.getList()
  };
}

function _remove(key) {
  Memory.remove(key);
  File.remove(key);
}

function _clear() {
  Memory.clear();
  File.clear();
}
