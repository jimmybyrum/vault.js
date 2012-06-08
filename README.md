storage.js
===============

wrapper for localStorage and sessionStorage that returns true values

#### Usage

##### set
```
Storage.Session.set("foo", "bar");
Storage.Local.set("my_array", [1,2,3,4]);
Storage.Session.set("my_object", {
  foo: "bar",
  an_array: [1,2,3],
  year: 2012
});
Storage.Local.set("age", 33);
```

##### get
```
Storage.Session.get("foo");
// returns the string
bar

Storage.Local.get("my_array");
// returns the array
[1,2,3,4]

Storage.Session.get("my_object");
// returns the object
{
  foo: "bar",
  an_array: [1,2,3],
  year: 2012
}

Storage.Local.get("age");
// returns the number
33
```

##### remove
```
Storage.Session.remove("my_object");
// removes my_object from sessionStorage

Storage.Local.remove("my_array");
// removes my_array from localStorage
```

##### clear
```
Storage.Session.clear();
// clears all items from sessionStorage

Storage.Local.clear();
// clears all items from localStorage
```

##### list
```
Storage.Session.clear();
// lists all items in sessionStorage in the console

Storage.Local.clear();
// lists all items in localStorage in the console
```
