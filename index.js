import { start, stop, setIntervalLength, getIntervalLength } from './lib/cleanup.js';
import _File from './lib/file.js';
import _Memory from './lib/memory.js';
import _Browser from './browser.js';
import { readFileSync } from 'fs';
const pkg = JSON.parse(readFileSync(new URL('package.json', import.meta.url)));
console.log(`Vault (${pkg.version})`);

const isBrowser = typeof window !== 'undefined';

export let File = _File;
export let Memory = _Memory;
export const Browser = _Browser;

if (!isBrowser) {
  start([File, Memory]);
}

const Vault = {
  version: pkg.version,
  File: File,
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
