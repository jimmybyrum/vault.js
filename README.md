vault.js
===============

Wrapper for localStorage, sessionStorage, document.cookie that sets and gets true values.
Adds some cookie functionality to localStorage. For now, just expires. More coming soon.

#### Tested on:
Webkit (Safari, Chrome), Firefox, Opera, IE7+, Mobile Safari, Android 2.3+

Note that Web SQL is only supported in WebKit and Opera

### Usage

#### Local, Session, Cookie

##### Vault.set(String key, Mixed value, Object optional_config)
```
Vault.set(String key, Mixed value, Object optional_config);
```

##### rules for which storage to use
```
if config.expires exists and localStorage is supported, then
  use localStorage
else if sessionStorage is supported, then
  use sessionStorage
else
  use cookies
```
or, if you want to specify which storage to use:
```
Vault.Cookie.set(...);
Vault.Session.set(...);
Vault.Local.set(...);
```

##### optional_config
```
{
  // Cookie options. May implement for Storage in the future.
  path: "/",
  domain: ".jimmybyrum.com",
  secure: true,

  // Cookie and Local options
  expires: "2014-09-25 8:24:32 pm", // or anything that can be parsed by new Date(...)
  expires: "+3 days", // works for all time increments from milliseconds to years.
}
```

#### examples

```
Vault.set("year", 1999); // saves in sessionStorage

Vault.set("year", 1999, { expires: '1999-12-31 11:59:59 pm' }); // saves in localStorage until 11:59:59 on December 31, 1999

Vault.Session.set("foo", "bar");
Vault.Session.set("foo", "bar", {
  expires: "+6 months"
});
Vault.Local.set("my_array", [1,2,3,4]);
Vault.Cookie.set("my_object", {
  foo: "bar",
  an_array: [1,2,3],
  year: 2012
});
Vault.Local.set("age", 33);
```

##### Vault.get(String key)
Will check storage in this order: Session, Local, Cookie

To specify which storage to get from, use:
```
Vault.Cookie.get(String key);
Vault.Local.get(String key);
Vault.Session.get(String key);
```

#### examples
```
Vault.get("foo"); returns from Session, else Local, else Cookie, else undefined

Vault.Session.get("foo");
// returns "bar"
Vault.Local.get("my_array");
// [1,2,3,4]
Vault.Cookie.get("my_object");
// {
//   foo: "bar",
//   an_array: [1,2,3],
//   year: 2012
// }
Vault.Local.get("age");
// returns the number 33
```

##### remove
removes an item
```
Vault.remove("my_object"); // removes from all storage types
Vault.Session.remove("my_object");
Vault.Local.remove("my_array");
Vault.Cookie.remove("my_array");
```

##### clear
clears all items
```
Vault.clear(); // clears all storage types
Vault.Session.clear();
Vault.Local.clear();
Vault.Cookie.clear();
```

##### list
lists all items in Vault in the console
```
Vault.list(); // lists all storage types
Vault.Session.list();
Vault.Local.list();
Vault.Cookie.list();
```

#### TODO
- handle storage limit errors
- add support to request more storage
- handle storage events
