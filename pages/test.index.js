function runTest(testType, key, value, opts, callback) {
  ['Local', 'Session', 'Cookie'].forEach(type => {
    describe(type + ':' + testType, () => {
      Vault[type].set(key, value, opts);
      const returnedValue = Vault[type].get(key);
      callback(type, testType, returnedValue);
    });
  });
}

describe('parse', () => {

  before(() => {
    Vault.clear();
  });

  const key = 'temporaryTestKey';
  describe('Vault.get', () => {
    Vault.remove(key);
    const memValue = 'in memory';
    Vault.Memory.set(key, memValue);
    const returnedMemory = Vault.get(key);
    it('should get key from Memory storage', () => {
      chai.assert.equal(memValue, returnedMemory);
    });
    Vault.Memory.remove(key);
  });

  describe('Vault.remove', () => {
    Vault.remove(key);
    const returnedValue = Vault.get(key);
    it('should return nothing', () => {
      chai.assert.equal(undefined, returnedValue);
    });
  });

  describe('Vault.set (session)', () => {
    const value = 'session data';
    Vault.set(key, value, {
      expires: 'session'
    });
    const returnedValue = Vault.Session.get(key);
    it('should return data from session storage', () => {
      chai.assert.equal(value, returnedValue);
    });
  });

  runTest('string', 'name', 'jimmy', {}, (type, testType, returnedValue) => {
    it('should be a typeof ' + testType, () => {
      chai.assert.equal(testType, typeof returnedValue);
    });
    it('should return a ' + testType, () => {
      chai.assert.equal('jimmy', returnedValue);
    });
  });

  runTest('string', 'empty-string', '', {}, (type, testType, returnedValue) => {
    it('should be an empty typeof ' + testType, () => {
      chai.assert.equal(testType, typeof returnedValue);
    });
    it('should return an empty ' + testType, () => {
      chai.assert.equal('', returnedValue);
    });
  });

  runTest('number', 'age', 33, {}, (type, testType, returnedValue) => {
    it('should be a typeof ' + testType, () => {
      chai.assert.equal(testType, typeof returnedValue);
    });
    it('should return a ' + testType, () => {
      chai.assert.equal(33, returnedValue);
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
      chai.assert.equal('object', typeof returnedValue);
    });
    it('should have array length', () => {
      chai.assert.equal(6, returnedValue.length);
    });
    it('should return an array item', () => {
      chai.assert.equal('San Francisco', returnedValue[5]);
    });
  });

  runTest('object', 'libs', {
    'vault.js': 'https://github.com/jimmybyrum/vault.js',
    'voice-commands.js': 'https://github.com/jimmybyrum/voice-commands.js'
  }, {}, (type, testType, returnedValue) => {
    it('should be a typeof object', () => {
      chai.assert.equal('object', typeof returnedValue);
    });
    it('should return the key', () => {
      chai.assert.equal('vault.js', Object.keys(returnedValue)[0]);
    });
    it('should return the value', () => {
      chai.assert.equal('https://github.com/jimmybyrum/vault.js', returnedValue['vault.js']);
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
      chai.assert.equal('object', typeof returnedValue);
    });
    it('should return the key', () => {
      chai.assert.equal('pgh', Object.keys(returnedValue.cities)[0]);
    });
    it('should return the value', () => {
      chai.assert.equal(1758, returnedValue.cities.pgh.founded);
    });
    it('should return a value from a nested array', () => {
      chai.assert.equal('Penguins', returnedValue.cities.pgh.teams[0]);
    });
  });

  runTest('default_value', 'notThere', 'A Default Value', {}, (type, testType, returnedValue) => {
    it('should be a typeof string', () => {
      chai.assert.equal('string', typeof returnedValue);
    });
    it('should return the default_value', () => {
      chai.assert.equal('A Default Value', returnedValue);
    });
  });

  runTest('get and remove', 'oneTimeOnly', 'only once', {}, (type, testType, returnedValue) => {
    it('should be a typeof string', () => {
      chai.assert.equal('string', typeof returnedValue);
    });
    it('should return a string', () => {
      chai.assert.equal('only once', returnedValue);
    });
    it('should return undefined when called a second time', () => {
      chai.assert.equal(undefined, Vault[type].get('returnedValue'));
    });
  });

  runTest('expires', 'thisVarExpiresSoon', 'expiring soon', {
    expires: '+1 seconds'
  }, (type, testType, returnedValue) => {
    it('should be a typeof string', () => {
      chai.assert.equal('string', typeof returnedValue);
    });
    it('should return a string', () => {
      chai.assert.equal('expiring soon', returnedValue);
    });
    it('should return undefined after waiting 1 second', done => {
      setTimeout(() => {
        chai.assert.equal(undefined, Vault[type].get('thisVarExpiresSoon'));
        done();
      }, 1000);
    });
  });

});
