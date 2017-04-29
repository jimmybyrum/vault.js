'use strict';

module.exports = {
  start,
  stop,
  getIntervalLength,
  setIntervalLength
};

var typesCache = [];
var running = true;
var timeout;
var intervalLength = 5000;

var hasWarned = false;
function start(types) {
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

function stop() {
  running = false;
  clearTimeout(timeout);
}

function getIntervalLength() {
  return intervalLength;
}

function setIntervalLength(length) {
  intervalLength = length;
}
