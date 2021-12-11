import { Cookie, Local, Session } from './lib/browser';
import Memory from './lib/memory';
import { start, stop, setIntervalLength, getIntervalLength } from './lib/cleanup';
import { Config } from './types';

const Vault = {
  version: process.env.npm_package_version,
  Cookie: Cookie,
  Local: Local,
  Session: Session,
  Memory: Memory,

  startCleanup: start,
  stopCleanup: stop,
  setIntervalLength: setIntervalLength,
  getIntervalLength: getIntervalLength,

  set: (key: string, value: any, config: Config) => {
    const expires = config && config.expires;
    // console.log('set', key, value, 'expires:', expires);
    switch(expires) {
      case 'page':
        Memory.set(key, value, config);
      break;
      case 'session':
        Session.set(key, value, config);
      break;
      default:
        Local.set(key, value, config);
      break;
    }
  },
  get: (key: string) => {
    const types = [
      Memory,
      Session,
      Local,
      Cookie
    ];
    let i;
    for(i = 0; i < types.length; i++) {
      const value = types[i].get(key);
      if(value !== undefined) {
        return value;
      }
    }
  },
  list: (raw: boolean) => {
    console.log('--== Memory ==--');
    Memory.list();
    console.log('----------------');
    console.log('--== Session ==--');
    Session.list(raw);
    console.log('----------------');
    console.log('--== Local ==--');
    Local.list(raw);
    console.log('----------------');
    console.log('--== Cookie ==--');
    Cookie.list();
    console.log('----------------');
  },
  getLists: () => {
    return {
      Memory: Memory.getList(),
      Session: Session.getList(),
      Local: Local.getList(),
      Cookie: Cookie.getList()
    };
  },
  remove: (key: string) => {
    Memory.remove(key);
    Session.remove(key);
    Local.remove(key);
    Cookie.remove(key);
  },
  clear: () => {
    Memory.clear();
    Session.clear();
    Local.clear();
    Cookie.clear();
  }
};

// @ts-ignore
window.Vault = Vault;
export default Vault;

start([Cookie, Local, Session, Memory]);
