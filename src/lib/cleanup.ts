import { Cache } from '../types';

let typesCache: Cache = [];
let running: boolean = true;
let timeout: any;
let intervalLength: number = 5000;

let hasWarned = false;
export const start = (types: any) => {
  if (!types && typesCache) {
    types = typesCache;
  } else {
    typesCache = types;
  }
  doCleanup(types);
}

function doCleanup(types: any) {
  types.forEach((item: any) => {
    try {
      item.getList();
    } catch (e) {
      if (!hasWarned) {
        hasWarned = true;
        console.warn('interval error', e);
      }
    }
  });
  if (running) {
    timeout = setTimeout(() => {
      doCleanup(types);
    }, intervalLength);
  }
}

export const stop = () => {
  running = false;
  clearTimeout(timeout);
}

export const getIntervalLength = () => {
  return intervalLength;
}

export const setIntervalLength = (length: number) => {
  intervalLength = length;
}
