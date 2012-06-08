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