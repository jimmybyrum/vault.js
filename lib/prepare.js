'use strict';
module.exports = function(value) {

  // depending on how the value is set, this
  // {"name": "jimmy"}
  // might return typeof to be "string"
  // in that case, we want to force it to be an object so that the next
  // block prepares it correctly.
  if (value.indexOf && (value.indexOf('{') === 0 || value.indexOf('[') === 0)) {
    value = JSON.parse(value);
  }

  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch (e) {
      console.warn('Prepare: JSON error', e);
    }
  }

  return value;
};
