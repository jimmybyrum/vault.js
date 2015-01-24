'use strict';
module.exports = function(value) {
  // everything in local storage is a string
  // so let's convert booleans and numbers
  // to be true booleans and numbers
  // and return those
  if (value === null || value === undefined || value === 'undefined') {
    // localStorage["foo"] returns null
    // in some browsers even if
    // foo isn't there at all.
    // since foo is really undefined,
    // we are returning accordingly
    return undefined;
  }
  if (value === 'null') {
    return null;
  }
  if (value === true || value === 'true') {
    return true;
  }
  if (value === false || value === 'false') {
    return false;
  }
  // the checks for true booleans above are because
  // Chrome 34 (and perhaps other versions) return the following
  // isNaN as false even if the value being checked it true or false.
  // e.g. isNaN(true) and isNaN(false) both return false
  if (value !== '' && !isNaN(value)) {
    return value * 1;
  }
  if (value.indexOf && (value.indexOf('{') === 0 || value.indexOf('[') === 0)) {
    return JSON.parse(value);
  }
  return value;
};
