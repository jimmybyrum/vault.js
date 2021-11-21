import { checkKeyMeta, clearKeyMeta, setKeyMeta } from './meta';
import { vaultData } from './config';
import VaultCookie from './cookie';
import prepare from './prepare';
import parse from './parse';
import { Cache, Config, Storage } from '../types';

const setup = function(type: any) {
  // @ts-ignore
  let storage: Storage = window[type];
  try {
    const testKey = 'vault-test';
    storage.setItem(testKey, 'bar');
    storage.removeItem(testKey);
  } catch (e) {
    // storage = Cookie;
  }
  if (!storage) {
    if (typeof window !== 'undefined') {
      console.warn(`Vault: ${type} is not supported. I will attempt to use Cookies instead.`);
    }
    return Cookie;
  }
  return {
    type: type,
    get: (key: string, default_value: any = undefined) => {
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
    getItem: (key: string, default_value: any = undefined) => {
      return storage.get(key, default_value);
    },
    getAndRemove: (key: string) => {
      const value = storage.get(key);
      storage.remove(key);
      return value;
    },
    getList: () => {
      let list = [];
      let i;
      for (i in storage) {
        let item: Cache = {};
        item[i] = storage.get(i);
        list.push(item);
      }
      return list;
    },
    set: (key: string, value: any, config: Config) => {
      if (!key) {
        return console.warn('Vault: set was called with no key.', key);
      }
      try {
        // if (type === 'sessionStorage' && config && config.expires) {
        //   delete config.expires;
        // }
        setKeyMeta(storage, key, config);
        return storage.setItem(key, prepare(value));
      } catch (e) {
        console.warn('Vault: I cannot write to localStoarge even though localStorage is supported. Perhaps you are using your browser in private mode? Here is the error: ', e);
      }
    },
    setItem: (key: string, value: any, config: Config = {}) => {
      storage.set(key, value, config);
    },
    remove: (key: string) => {
      clearKeyMeta(storage, key);
      return storage.removeItem(key);
    },
    removeItem: (key: string) => {
      return storage.remove(key);
    },
    clear: () => {
      return storage.clear();
    },
    list: (raw: boolean) => {
      let i, il = storage.length;
      if (il === 0) {
        console.log('0 items in', type);
        return undefined;
      }
      for (i in storage) {
        if (i !== vaultData) {
          const value = raw ? parse(storage[i]) : storage.get(i);
          console.log(i, '=', value);
        }
      }
    }
  };
};
export const Local = setup('localStorage');
export const Session = setup('sessionStorage');
export const Cookie = VaultCookie;
