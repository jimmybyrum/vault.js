vault.js
===============

wrapper for localStorage, sessionStorage, document.cookie that sets and gets true values and a abstracted interface to Web SQL

#### Demo
http://jimmybyrum.github.com/vault.js/

##### Tested on:
Webkit (Safari, Chrome), Firefox, Opera, IE7+, Mobile Safari, Android 2.3+
Note that Web SQL is only supported in WebKit and Opera

#### Usage

##### Local, Session, Cookie

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

##### Web SQL

##### open
open a db
```
Vault.DB.open('testdb', '1.0', 'Test DB', 1024 * 1024);
```

##### createTable
CREATE
```
Vault.DB.create({
    users: ["id unique", "name", "age"]
});
// executes
CREATE TABLE IF NOT EXISTS users (id unique,name,age)
```

##### set
INSERT, UPDATE, DELETE data
```
Vault.DB.set({
    users: [
        {
            name: "andrea",
            age: 29
        },
        {
            name: "adriano",
            age: 31
        },
        {
            age: 33,
            _where: {
                name: "matt"
            }
        },
        {
            _delete: {
                name: "jimmy"
            }
        }
    ]
});
// executes
INSERT INTO users (name,age) VALUES ("andrea",29)
INSERT INTO users (name,age) VALUES ("adriano",31)
UPDATE users SET age=33 WHERE name="matt"
DELETE FROM users WHERE name="jimmy"
```

##### get
SELECT data
```
Vault.DB.get({
    users: ["name", "age"]
}, function(_results) {
    // returns an array of result objects
});
// executes
SELECT name,age FROM user
// returns
/*
[
    {
        age: 31,
        name: "adriano"
    },
    {
        age: 29,
        name: "andrea"
    }
]
*/
```

##### remove
DELETE rows from a table
```
Vault.DB.remove({
    users: [
        { name: "matt" },
        { age: 33 }
    ]
});
// executes
DELETE FROM users WHERE name="matt"
DELETE FROM users WHERE age=33
```

#### clear
DELETE all rows
```
Vault.DB.clear(["users"]);
// executes
DELETE FROM users
```

##### dropTable
DROP a table
```
Vault.DB.drop(["users"]);
// executes
DROP TABLE users
```

##### sql
runs any SQL statement
```
Vault.DB.sql("SELECT * FROM users WHERE age=31", function(_res) {
    console.log(_res);
});
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
