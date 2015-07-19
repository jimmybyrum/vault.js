'use strict';

var Vault = require('../index');
var assert = require('assert');

describe('parse', function() {

  before(function(next) {
    Vault.set('name', 'jimmy');
    Vault.set('age', 33);
    Vault.set('cities', [
      'Pittsburgh',
      'San Jose',
      'London',
      'Porvenir',
      'Cambridge',
      'San Francisco'
    ]);
    Vault.set('libs', {
      'vault.js': 'https://github.com/jimmybyrum/vault.js',
      'voice-commands.js': 'https://github.com/jimmybyrum/voice-commands.js'
    });
    Vault.set('deep', {
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
    });
    next();
  });

  describe('string', function () {
    var name = Vault.get('name');
    it('should be a typeof string', function () {
      assert.equal('string', typeof name);
    });
    it('should return a string', function () {
      assert.equal('jimmy', name);
    });
  });

  describe('number', function () {
    var age = Vault.get('age');
    it('should be a typeof number', function () {
      assert.equal('number', typeof age);
    });
    it('should return a number', function () {
      assert.equal(33, age);
    });
  });

  describe('array', function () {
    var cities = Vault.get('cities');
    it('should be a typeof object', function () {
      assert.equal('object', typeof cities);
    });
    it('should have array length', function () {
      assert.equal(6, cities.length);
    });
    it('should return an array item', function () {
      assert.equal('San Francisco', cities[5]);
    });
  });

  describe('object', function () {
    var libs = Vault.get('libs');
    it('should be a typeof object', function () {
      assert.equal('object', typeof libs);
    });
    it('should return the key', function () {
      assert.equal('vault.js', Object.keys(libs)[0]);
    });
    it('should return the value', function () {
      assert.equal('https://github.com/jimmybyrum/vault.js', libs['vault.js']);
    });
  });

  describe('deep object', function () {
    var deep = Vault.get('deep');
    it('should be a typeof object', function () {
      assert.equal('object', typeof deep);
    });
    it('should return the key', function () {
      assert.equal('pgh', Object.keys(deep.cities)[0]);
    });
    it('should return the value', function () {
      assert.equal(1758, deep.cities.pgh.founded);
    });
    it('should return a value from a nested array', function () {
      assert.equal('Penguins', deep.cities.pgh.teams[0]);
    });
  });

  describe('default_value', function () {
    var notThere = Vault.get('notThere', 'A Default Value');
    it('should be a typeof string', function () {
      assert.equal('string', typeof notThere);
    });
    it('should return the default_value', function () {
      assert.equal('A Default Value', notThere);
    });
  });

  describe('get and remove', function () {
    Vault.set('oneTimeOnly', 'only once');
    var oneTimeOnly = Vault.getAndRemove('oneTimeOnly');
    it('should be a typeof string', function () {
      assert.equal('string', typeof oneTimeOnly);
    });
    it('should return a string', function () {
      assert.equal('only once', oneTimeOnly);
    });
    it('should return undefined when called a second time', function () {
      assert.equal(undefined, Vault.get('oneTimeOnly'));
    });
  });

  describe('expires', function () {
    Vault.set('thisVarExpiresSoon', 'expiring soon', {
      expires: '+1 seconds'
    });
    var expires = Vault.get('thisVarExpiresSoon');
    it('should be a typeof string', function () {
      assert.equal('string', typeof expires);
    });
    it('should return a string', function () {
      assert.equal('expiring soon', expires);
    });
    it('should return undefined after waiting 1 second', function (done) {
      setTimeout(function() {
        assert.equal(undefined, Vault.get('thisVarExpiresSoon'));
        done();
      }, 1000);
    });
  });

});
