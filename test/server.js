#!/usr/bin/env node
'use strict';

var Vault = require('../index');

var args = {};
process.argv.forEach(function (val, index, array) {
  var parts = val.split('=');
  if (parts.length === 2) {
    args[parts[0]] = parts[1];
  }
});

if (args.name) {
  Vault.set('name', args.name, {expires: '+1 minute', path: '/account'});
}
if (args.age) {
  Vault.set('age', args.age, {expires: '+1 days'});
}
// Vault.set('data', {
//   testing: true,
//   arrays: [1, 2],
//   objects: {
//     does: ['this', 'work', 3]
//   },
//   integers: 123
// }, {expires: '+1 days'});

if (args.get) {
  console.log(Vault.get(args.get));
} else {
  Vault.list();
}

setTimeout(function() {
  process.exit(0);
}, 1000);
