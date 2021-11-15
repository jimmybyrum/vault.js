import Vault from '../index.js';
import { equal } from 'assert';
import { unlinkSync } from 'fs';

function runTest(testType, key, value, opts, callback) {
  ['Memory', 'File'].forEach(type => {
    describe(type + ':' + testType, () => {
      Vault[type].set(key, value, opts);
      const returnedValue = Vault[type].get(key);
      callback(type, testType, returnedValue);
    });
  });
}

describe('parse', () => {

  after(function() {
    const vaultFile = Vault.File.getFile();
    if (vaultFile) {
      console.log(`Removing ${vaultFile}`);
      try {
        unlinkSync(vaultFile);
      } catch(e) {}
    }
  });

  const key = 'storage';
  describe('Vault.get', () => {
    Vault.remove(key);

    const memValue = 'in memory';
    const fileValue = 'in file';

    Vault.Memory.set(key, memValue);
    const returnedMemory = Vault.get(key);
    it('should get key from Memory storage', () => {
      equal(memValue, returnedMemory);
    });
    Vault.Memory.remove(key);
    
    Vault.File.set(key, fileValue);
    const returnedFile = Vault.get(key);
    it('should get key from File storage', () => {
      equal(fileValue, returnedFile);
    });
  });

  describe('Vault.remove', () => {
    Vault.remove(key);
    const returnedValue = Vault.get(key);
    it('should return nothing', () => {
      equal(undefined, returnedValue);
    });
  });

  describe('Vault.set (session)', () => {
    const value = 'session data';
    Vault.set(key, value, {
      expires: 'session'
    });
    const returnedValue = Vault.Memory.get(key);
    it('should return data from memory storage', () => {
      equal(value, returnedValue);
    });
  });

  describe('Vault.set (expires)', () => {
    const value = 'session data';
    Vault.set(key, value, {
      expires: '+1 second'
    });
    const returnedValue = Vault.File.get(key);
    it('should return data from file storage', () => {
      equal(value, returnedValue);
    });
  });

  describe('Vault.getLists', () => {
    const returnedValue = Vault.getLists();
    it('should return Memory and File storage', () => {
      const memExists = typeof returnedValue.Memory === 'object';
      const fileExists = typeof returnedValue.File === 'object';
      equal(true, memExists && fileExists);
    });
  });

  runTest('string', 'name', 'jimmy', {}, (type, testType, returnedValue) => {
    it('should be a typeof ' + testType, () => {
      equal(testType, typeof returnedValue);
    });
    it('should return a ' + testType, () => {
      equal('jimmy', returnedValue);
    });
  });

  runTest('string', 'empty-string', '', {}, (type, testType, returnedValue) => {
    it('should be an empty typeof ' + testType, () => {
      equal(testType, typeof returnedValue);
    });
    it('should return an empty ' + testType, () => {
      equal('', returnedValue);
    });
  });

  runTest('number', 'age', 33, {}, (type, testType, returnedValue) => {
    it('should be a typeof ' + testType, () => {
      equal(testType, typeof returnedValue);
    });
    it('should return a ' + testType, () => {
      equal(33, returnedValue);
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
      equal('object', typeof returnedValue);
    });
    it('should have array length', () => {
      equal(6, returnedValue.length);
    });
    it('should return an array item', () => {
      equal('San Francisco', returnedValue[5]);
    });
  });

  runTest('object', 'libs', {
    'vault.js': 'https://github.com/jimmybyrum/vault.js',
    'voice-commands.js': 'https://github.com/jimmybyrum/voice-commands.js'
  }, {}, (type, testType, returnedValue) => {
    it('should be a typeof object', () => {
      equal('object', typeof returnedValue);
    });
    it('should return the key', () => {
      equal('vault.js', Object.keys(returnedValue)[0]);
    });
    it('should return the value', () => {
      equal('https://github.com/jimmybyrum/vault.js', returnedValue['vault.js']);
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
      equal('object', typeof returnedValue);
    });
    it('should return the key', () => {
      equal('pgh', Object.keys(returnedValue.cities)[0]);
    });
    it('should return the value', () => {
      equal(1758, returnedValue.cities.pgh.founded);
    });
    it('should return a value from a nested array', () => {
      equal('Penguins', returnedValue.cities.pgh.teams[0]);
    });
  });

  runTest('default_value', 'notThere', 'A Default Value', {}, (type, testType, returnedValue) => {
    it('should be a typeof string', () => {
      equal('string', typeof returnedValue);
    });
    it('should return the default_value', () => {
      equal('A Default Value', returnedValue);
    });
  });

  runTest('get and remove', 'oneTimeOnly', 'only once', {}, (type, testType, returnedValue) => {
    it('should be a typeof string', () => {
      equal('string', typeof returnedValue);
    });
    it('should return a string', () => {
      equal('only once', returnedValue);
    });
    it('should return undefined when called a second time', () => {
      equal(undefined, Vault[type].get('returnedValue'));
    });
  });

  runTest('expires', 'thisVarExpiresSoon', 'expiring soon', {
    expires: '+1 seconds'
  }, (type, testType, returnedValue) => {
    it('should be a typeof string', () => {
      equal('string', typeof returnedValue);
    });
    it('should return a string', () => {
      equal('expiring soon', returnedValue);
    });
    it('should return undefined after waiting 1 second', done => {
      setTimeout(() => {
        equal(undefined, Vault[type].get('thisVarExpiresSoon'));
        done();
      }, 1000);
    });
  });

});
