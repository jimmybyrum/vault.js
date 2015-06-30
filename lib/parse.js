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
  //  according to the IEEE floating-point standard (https://en.wikipedia.org/wiki/IEEE_floating_point) NaN should be treated as
  //  unqeual to iteself. Javascript follows this standard. NaN is the only value in javascript that is unqeual to iteself.
  //  using isNan is unsafe because it coerces its argument to a Number before testing the value.
  //  so test that value does not equal value will only return false if value
  //  is NaN
  if (value !== '' && value !== value) {
    return value * 1;
  }
  if (value.indexOf && (value.indexOf('{') === 0 || value.indexOf('[') === 0)) {
    return JSON.parse(value);
  }
  return value;
};
