'use strict';

var Vault = require('../index');
var assert = require('assert');

function runTest(testType, key, value, opts, callback) {
  ['Memory', 'File'].forEach(type => {
    describe(type + ':' + testType, () => {
      Vault[type].set(key, value, opts);
      var returnedValue = Vault[type].get(key);
      callback(type, testType, returnedValue);
    });
  });
}

describe('parse', () => {

  runTest('string', 'name', 'jimmy', {}, (type, testType, returnedValue) => {
    it('should be a typeof ' + testType, () => {
      assert.equal(testType, typeof returnedValue);
    });
    it('should return a ' + testType, () => {
      assert.equal('jimmy', returnedValue);
    });
  });

  runTest('number', 'age', 33, {}, (type, testType, returnedValue) => {
    it('should be a typeof ' + testType, () => {
      assert.equal(testType, typeof returnedValue);
    });
    it('should return a ' + testType, () => {
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
  ], {}, (type, testType, returnedValue) => {
    it('should be a typeof object', () => {
      assert.equal('object', typeof returnedValue);
    });
    it('should have array length', () => {
      assert.equal(6, returnedValue.length);
    });
    it('should return an array item', () => {
      assert.equal('San Francisco', returnedValue[5]);
    });
  });

  runTest('object', 'libs', {
    'vault.js': 'https://github.com/jimmybyrum/vault.js',
    'voice-commands.js': 'https://github.com/jimmybyrum/voice-commands.js'
  }, {}, (type, testType, returnedValue) => {
    it('should be a typeof object', () => {
      assert.equal('object', typeof returnedValue);
    });
    it('should return the key', () => {
      assert.equal('vault.js', Object.keys(returnedValue)[0]);
    });
    it('should return the value', () => {
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
  }, {}, (type, testType, returnedValue) => {
    it('should be a typeof object', () => {
      assert.equal('object', typeof returnedValue);
    });
    it('should return the key', () => {
      assert.equal('pgh', Object.keys(returnedValue.cities)[0]);
    });
    it('should return the value', () => {
      assert.equal(1758, returnedValue.cities.pgh.founded);
    });
    it('should return a value from a nested array', () => {
      assert.equal('Penguins', returnedValue.cities.pgh.teams[0]);
    });
  });

  runTest('default_value', 'notThere', 'A Default Value', {}, (type, testType, returnedValue) => {
    it('should be a typeof string', () => {
      assert.equal('string', typeof returnedValue);
    });
    it('should return the default_value', () => {
      assert.equal('A Default Value', returnedValue);
    });
  });

  runTest('get and remove', 'oneTimeOnly', 'only once', {}, (type, testType, returnedValue) => {
    it('should be a typeof string', () => {
      assert.equal('string', typeof returnedValue);
    });
    it('should return a string', () => {
      assert.equal('only once', returnedValue);
    });
    it('should return undefined when called a second time', () => {
      assert.equal(undefined, Vault[type].get('returnedValue'));
    });
  });

  runTest('expires', 'thisVarExpiresSoon', 'expiring soon', {
    expires: '+1 seconds'
  }, (type, testType, returnedValue) => {
    it('should be a typeof string', () => {
      assert.equal('string', typeof returnedValue);
    });
    it('should return a string', () => {
      assert.equal('expiring soon', returnedValue);
    });
    it('should return undefined after waiting 1 second', done => {
      setTimeout(() => {
        assert.equal(undefined, Vault[type].get('thisVarExpiresSoon'));
        done();
      }, 1000);
    });
  });

});
