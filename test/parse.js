'use strict';

var Vault = require('../index');
var assert = require('assert');

function runTest(testType, key, value, opts, callback) {
  ['Memory', 'File'].forEach(function(type) {
    describe(type + ':' + testType, function() {
      Vault[type].set(key, value, opts);
      var returnedValue = Vault[type].get(key);
      callback(type, testType, returnedValue);
    });
  });
}

describe('parse', function() {

  runTest('string', 'name', 'jimmy', {}, function(type, testType, returnedValue) {
    it('should be a typeof ' + testType, function() {
      assert.equal(testType, typeof returnedValue);
    });
    it('should return a ' + testType, function() {
      assert.equal('jimmy', returnedValue);
    });
  });

  runTest('number', 'age', 33, {}, function(type, testType, returnedValue) {
    it('should be a typeof ' + testType, function() {
      assert.equal(testType, typeof returnedValue);
    });
    it('should return a ' + testType, function() {
      assert.equal(33, returnedValue);
    });
  });

  runTest('array', 'cities', [
    'Pittsburgh',
    'San Jose',
    'London',
    'Porvenir',
    'Cambridge',
    'San Francisco'
  ], {}, function(type, testType, returnedValue) {
    it('should be a typeof object', function() {
      assert.equal('object', typeof returnedValue);
    });
    it('should have array length', function() {
      assert.equal(6, returnedValue.length);
    });
    it('should return an array item', function() {
      assert.equal('San Francisco', returnedValue[5]);
    });
  });

  runTest('object', 'libs', {
    'vault.js': 'https://github.com/jimmybyrum/vault.js',
    'voice-commands.js': 'https://github.com/jimmybyrum/voice-commands.js'
  }, {}, function(type, testType, returnedValue) {
    it('should be a typeof object', function() {
      assert.equal('object', typeof returnedValue);
    });
    it('should return the key', function() {
      assert.equal('vault.js', Object.keys(returnedValue)[0]);
    });
    it('should return the value', function() {
      assert.equal('https://github.com/jimmybyrum/vault.js', returnedValue['vault.js']);
    });
  });

  runTest('deep object', 'deep', {
    name: 'James',
    age: 33,
    cities: {
      pgh: {
        name: 'Pittsburgh',
        founded: 1758,
        teams: [
          'Penguins',
          'Steelers',
          'Pirates'
        ]
      }
    }
  }, {}, function(type, testType, returnedValue) {
    it('should be a typeof object', function() {
      assert.equal('object', typeof returnedValue);
    });
    it('should return the key', function() {
      assert.equal('pgh', Object.keys(returnedValue.cities)[0]);
    });
    it('should return the value', function() {
      assert.equal(1758, returnedValue.cities.pgh.founded);
    });
    it('should return a value from a nested array', function() {
      assert.equal('Penguins', returnedValue.cities.pgh.teams[0]);
    });
  });

  runTest('default_value', 'notThere', 'A Default Value', {}, function(type, testType, returnedValue) {
    it('should be a typeof string', function() {
      assert.equal('string', typeof returnedValue);
    });
    it('should return the default_value', function() {
      assert.equal('A Default Value', returnedValue);
    });
  });

  runTest('get and remove', 'oneTimeOnly', 'only once', {}, function(type, testType, returnedValue) {
    it('should be a typeof string', function() {
      assert.equal('string', typeof returnedValue);
    });
    it('should return a string', function() {
      assert.equal('only once', returnedValue);
    });
    it('should return undefined when called a second time', function() {
      assert.equal(undefined, Vault[type].get('returnedValue'));
    });
  });

  runTest('expires', 'thisVarExpiresSoon', 'expiring soon', {
    expires: '+1 seconds'
  }, function(type, testType, returnedValue) {
    it('should be a typeof string', function() {
      assert.equal('string', typeof returnedValue);
    });
    it('should return a string', function() {
      assert.equal('expiring soon', returnedValue);
    });
    it('should return undefined after waiting 1 second', function (done) {
      setTimeout(function() {
        assert.equal(undefined, Vault[type].get('thisVarExpiresSoon'));
        done();
      }, 1000);
    });
  });

});
