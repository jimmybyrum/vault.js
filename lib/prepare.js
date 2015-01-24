'use strict';
module.exports = function(value) {
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return value;
};
