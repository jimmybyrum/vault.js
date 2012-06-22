vault.js
===============

wrapper for localStorage, sessionStorage and document.cookie that sets and gets true values

#### Demo
http://jimmybyrum.github.com/vault.js/

##### Tested on:
IE7+, Chrome, Firefox, Safari, Mobile Safari, Android 2.3+

#### Usage
##### set and get
```
Vault.Session.set("foo", "bar");
Vault.Session.get("foo");
// returns "bar"

Vault.Local.set("my_array", [1,2,3,4]);
Vault.Local.get("my_array");
// [1,2,3,4]

Vault.Session.set("my_object", {
  foo: "bar",
  an_array: [1,2,3],
  year: 2012
});
Vault.Session.get("my_object");
// {
//   foo: "bar",
//   an_array: [1,2,3],
//   year: 2012
// }


Vault.Local.set("age", 33);
Vault.Local.get("age");
// returns the number 33
```

##### remove
removes an item
```
Vault.Session.remove("my_object");
Vault.Local.remove("my_array");
```

##### clear
clears all items
```
Vault.Session.clear();
Vault.Local.clear();
```

##### list
lists all items in Vault in the console
```
Vault.Session.list();
Vault.Local.list();
```

##### isSupported
returns a boolean to indicate if local and session storage are supported
```
Vault.Session.isSupported();
Vault.Local.isSupported();
```

#### TODO
- handle storage limit errors
- add support to request more storage
- handle storage events
