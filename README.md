vault.js [![run-tests](https://github.com/jimmybyrum/vault.js/actions/workflows/run-tests.yaml/badge.svg)](https://github.com/jimmybyrum/vault.js/actions/workflows/run-tests.yaml)
===============

## Key-Value Storage of true data types for the browser and node

Vault is an API to store Key-Value pairs as true data types. It can utilize localStorage, sessionStorage, and cookies in the Browser. In node, it uses a file at the root of the project (redis support coming soon).

It handles JSON objects, arrays, booleans, numbers, and even returns undefined and null accurately.

```
npm install vault.js
```
```
bower install vault.js
```
```
<script src="//cdnjs.cloudflare.com/ajax/libs/vault.js/1.0.3/vault.min.js"></script>
```

### What's new!
 * [1.0.0] Memory Storage. Automatic cleanup (expired items removed in the background). Moves data from one storage to another if the same var is set with different config.
 * [0.1.4] Support for use server-side added- writes data to .vault.json at the root level
 * [0.1.0] localStorage and sessionStorage support the path param
 * [2.0.0] Updated for ES6 modules

### What's next?
- [ ] handle storage limit errors
- [ ] add support to request more storage
- [ ] handle storage events

### Run/Develop locally
```
git clone git@github.com:jimmybyrum/vault.js.git
cd vault.js
npm install
npm run build
```

### Usage

#### Local, Session, Cookie, File, Memory

##### Vault.set(String key, Mixed value, Object optional_config)
```
Vault.set(String key, Mixed value, Object optional_config);
```

##### rules for which storage to use
```
if node
  if config.expires exists and equals "session"
    use Memory
  else
    use File
else if config.expires exists and localStorage is supported, then
  use localStorage
else if sessionStorage is supported, then
  use sessionStorage
else
  use cookies
```
or, if you want to specify which storage to use:
```
// client side
Vault.Cookie.set(...);
Vault.Session.set(...);
Vault.Local.set(...);

// server side
Vault.File.set(...);
Vault.Memory.set(...);
```

##### optional_config
```
{
  // Cookie options.
  domain: ".jimmybyrum.com",
  secure: true,

  // Cookie and Local options
  path: "/",
  expires: "2014-09-25 8:24:32 pm", // or anything that can be parsed by new Date(...)
  expires: "+3 days", // works for all time increments from milliseconds to years.

  // File and Memory options
  expires

  // domain and local/session storage
  local/session is natively tied to the domain. Subdomain keys can only be set from that subdomain.
}
```

#### examples

```
Vault.set("year", 1999); // saves in localStorage (browser) or to a file (server)

Vault.set("year", 1999, { expires: 'session' }); // saves in sessionStorage (browser) or in Memory (server)

Vault.set("year", 1999, { expires: '1999-12-31 11:59:59 pm' }); // saves in localStorage until 11:59:59 on December 31, 1999

Vault.Session.set('foo', 'bar');
Vault.Session.set('foo', 'bar', {
  expires: '+6 months',
  path: '/examples'
});
Vault.Local.set('my_array', [1,2,3,4]);
Vault.Cookie.set('my_object', {
  foo: 'bar',
  an_array: [1,2,3],
  year: 2012
});
Vault.Local.set('age', 33);
```

##### Vault.get(String key)
Will check storage in this order: Memory, File (if node), Session, Local, Cookie

To specify which storage to get from, use:
```
Vault.Cookie.get(String key);
Vault.Local.get(String key);
Vault.Session.get(String key);
Vault.File.get(String key);
Vault.Memory.get(String key);
```

#### examples
```
Vault.get('foo'); returns from Memory, else File (if node), else Session, else Local, else Cookie, else undefined

Vault.Session.get('foo');
// returns 'bar'
Vault.Local.get('my_array');
// [1,2,3,4]
Vault.Cookie.get('my_object');
// {
//   foo: 'bar',
//   an_array: [1,2,3],
//   year: 2012
// }
Vault.Local.get('age');
// returns the number 33
```

##### remove
removes an item
```
Vault.remove('my_object'); // removes from all storage types
Vault.Session.remove('my_object');
Vault.Local.remove('my_array');
Vault.Cookie.remove('my_array');
Vault.File.remove('my_array');
Vault.Memory.remove('my_array');
```

##### clear
clears all items
```
Vault.clear(); // clears all storage types
Vault.Session.clear();
Vault.Local.clear();
Vault.Cookie.clear();
Vault.File.clear();
Vault.Memory.clear();
```

##### list
lists all items in Vault in the console
```
Vault.list(); // lists all storage types
Vault.Session.list();
Vault.Local.list();
Vault.Cookie.list();
Vault.File.list();
Vault.Memory.list();
```

### Webpack

To use Vault.js with webpack you'll need to use json-loader.

```
npm i --save json-loader
```

Then in webpack config:

```
  module: {
    loaders: [
      {test: /\.json$/, loader: "json-loader" }
    ]
  },
```

You may also want to set up an alias so your require statements are a bit cleaner:

```
  resolve: {
    alias: {
      'vault.js': 'vault.js/browser.ts'
    }
  }
```
