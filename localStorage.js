// wrapper for localStorage
var Storage = (function() {
    var _get = function(_type) {
        var _storage = window[_type];
        return function(_key) {
            if (_storage!==undefined) {
                var _value = _storage[_key];
                // everything in local storage is a string
                // so let's convert booleans and numbers
                // to be true booleans and numbers
                // and return those
                if (_value===null) {
                    // localStorage["foo"] returns null
                    // even if foo isn't there at all.
                    // really foo is undefined, so we're
                    // returning accordingly
                    return undefined;
                }
                if (_value==="true") {
                    return true;
                }
                if (_value==="false") {
                    return false;
                }
                if (!isNaN(_value)) {
                    return parseFloat(_value);
                }
                if (_value.indexOf && (_value.indexOf("{")===0 || _value.indexOf("[")===0) && window.JSON!==undefined) {
                    return JSON.parse(_value);
                }
                return _value;
            }
            return undefined;
        };
    };
    var _set = function(_type) {
        var _storage = window[_type];
        return function(_key, _value) {
            if (_storage!==undefined) {
                if (typeof _value==="object" && window.JSON!==undefined) {
                    _value = JSON.stringify(_value);
                }
                return _storage.setItem(_key, _value);
            }
            return undefined;
        };
    };
    var _remove = function(_type) {
        var _storage = window[_type];
        return function(_key) {
            if (_storage!==undefined) {
                return _storage.removeItem(_key);
            }
            return undefined;
        };
    };
    var _clear = function(_type) {
        var _storage = window[_type];
        return function() {
            if (_storage!==undefined) {
                _storage.clear();
            }
            return undefined; 
        };
    };
    var _list = function(_type) {
        var _storage = window[_type];
        return function() {
            if (_storage!==undefined) {
                var i, il=_storage.length;
                if (il===0) {
                    return "0 items in "+_type;
                }
                for (i in _storage) {
                    console.log(i, "=", _storage[i]);
                }
            }
            return undefined;
        };
    };
    return {
        Local: {
            get: _get("localStorage"),
            set: _set("localStorage"),
            remove: _remove("localStorage"),
            clear: _clear("localStorage"),
            list: _list("localStorage")
        },
        Session: {
            get: _get("sessionStorage"),
            set: _set("sessionStorage"),
            remove: _remove("sessionStorage"),
            clear: _clear("sessionStorage"),
            list: _list("sessionStorage")
        }
    };
}());
var local_storage = Storage.Local;
