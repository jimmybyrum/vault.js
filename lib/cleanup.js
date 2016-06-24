'use strict';

module.exports = {
  start: start,
  stop: stop,
  setIntervalLength: setIntervalLength
};

var interval;
var intervalLength = 5000;

var hasWarned = false;
function start(types) {
  interval = setInterval(function() {
    doCleanup(types);
  }, intervalLength);
  doCleanup(types);
}

function doCleanup(types) {
  types.forEach(function(item) {
    try {
      item.getList();
    } catch (e) {
      if (!hasWarned) {
        hasWarned = true;
        console.warn('interval error', e);
      }
    }
  });
}

function stop() {
  clearInterval(interval);
}

function setIntervalLength(length) {
  intervalLength = length;
}