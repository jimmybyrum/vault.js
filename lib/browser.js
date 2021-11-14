import { checkKeyMeta, setKeyMeta, clearKeyMeta } from './meta.js';
import VaultCookie from './cookie.js';
import prepare from './prepare.js';
import parse from './parse.js';

const setup = function(type) {
  let storage;
  try {
    storage = window[type];
    const testKey = 'vault-test';
    try {
      /*eslint-disable*/
      const test = storage['foo'];
      /*eslint-enable*/
      storage.setItem(testKey, 'bar');
      storage.removeItem(testKey);
    } catch(e) {
      storage = undefined;
    }
  } catch(e) {
    storage = undefined;
  }
  if (!storage) {
    console.warn('Vault: ' + type + ' is not suppored. I will attempt to use Cookies instead.');
    return VaultCookie;
  }
  return {
    type: type,
    get: function(key, default_value) {
      if (storage[key] !== undefined) {
        const keyMeta = checkKeyMeta(storage, key);
        if (keyMeta) {
          return default_value;
        }
        const value = parse(storage[key]);
        return (value && value.value) || value;
      }
      return default_value;
    },
    getAndRemove: function(key) {
      const value = this.get(key);
      this.remove(key);
      return value;
    },
    getList: function() {
      let list = [];
      let i;
      for (i in storage) {
        let item = {};
        const value = this.get(i);
        item[i] = value;
        list.push(item);
      }
      return list;
    },
    set: function(key, value, config) {
      if (!key) {
        return console.warn('Vault: set was called with no key.', key);
      }
      try {
        // if (type === 'sessionStorage' && config && config.expires) {
        //   delete config.expires;
        // }
        setKeyMeta(storage, key, config);
        return storage.setItem(key, prepare(value));
      } catch(e) {
        console.warn('Vault: I cannot write to localStoarge even though localStorage is supported. Perhaps you are using your browser in private mode? Here is the error: ', e);
      }
    },
    remove: function(key) {
      clearKeyMeta(storage, key);
      return storage.removeItem(key);
    },
    clear: function() {
      return storage.clear();
    },
    list: function(raw) {
      let i, il = storage.length;
      if (il === 0) {
        console.log('0 items in', type);
        return undefined;
      }
      for (i in storage) {
        if (i !== '__vaultData') {
          const value = raw ? parse(storage[i]) : this.get(i);
          console.log(i, '=', value);
        }
      }
    }
  };
};
export const Local = setup('localStorage');
export const Session = setup('sessionStorage');
export const Cookie = VaultCookie;
