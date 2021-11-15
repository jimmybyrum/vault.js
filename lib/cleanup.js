let typesCache = [];
let running = true;
let timeout;
let intervalLength = 5000;

let hasWarned = false;
export const start = types => {
  if (!types && typesCache) {
    types = typesCache;
  } else {
    typesCache = types;
  }
  doCleanup(types);
}

function doCleanup(types) {
  types.forEach(item => {
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

export const setIntervalLength = length => {
  intervalLength = length;
}
