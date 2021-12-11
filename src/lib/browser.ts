import { checkKeyMeta, clearKeyMeta, setKeyMeta } from './meta';
import { vaultData } from './config';
import VaultCookie from './cookie';
import prepare from './prepare';
import parse from './parse';
import { Cache, Config, NativeStorage, Storage } from '../types';

export const Cookie = VaultCookie;

const setup = function(type: any) {
  // @ts-ignore
  const nativeStorage: NativeStorage = window[type];
  try {
    const testKey = 'vault-test';
    nativeStorage.setItem(testKey, 'bar');
    nativeStorage.removeItem(testKey);
  } catch (e) {
    console.warn(`Vault: ${type} is not supported. I will attempt to use Cookies instead.`);
    return Cookie;
  }
  const storage: Storage = {
    type: type,
    get: (key: string, default_value: any = undefined) => {
      if (nativeStorage[key] !== undefined) {
        const keyMeta = checkKeyMeta(nativeStorage, key);
        if (keyMeta) {
          return default_value;
        }
        const value = parse(nativeStorage[key]);
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
      const list = [];
      let i;
      for (i in nativeStorage) {
        const item: Cache = {};
        item[i] = nativeStorage.getItem(i);
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
        setKeyMeta(nativeStorage, key, config);
        return nativeStorage.setItem(key, prepare(value));
      } catch (e) {
        console.warn('Vault: I cannot write to localStoarge even though localStorage is supported. Perhaps you are using your browser in private mode? Here is the error: ', e);
      }
    },
    setItem: (key: string, value: any, config: Config = {}) => {
      storage.set(key, value, config);
    },
    remove: (key: string) => {
      clearKeyMeta(nativeStorage, key);
      return nativeStorage.removeItem(key);
    },
    removeItem: (key: string) => {
      return storage.remove(key);
    },
    clear: () => {
      return nativeStorage.clear();
    },
    list: (raw: boolean) => {
      const il = nativeStorage.length;
      let i;
      if (il === 0) {
        console.log('0 items in', type);
        return undefined;
      }
      let counter = 0;
      for (i in nativeStorage) {
        if (i !== vaultData && counter < il) {
          const value = raw ? parse(nativeStorage[i]) : storage.get(i);
          console.log(i, '=', value);
        }
        counter++;
      }
    }
  };
  return storage;
};
export const Local = setup('localStorage');
export const Session = setup('sessionStorage');
