// wrapper for localStorage, sessionStorage and document.cookie
var Storage = (function() {
    var _parse = function(_value) {
        // everything in local storage is a string
        // so let's convert booleans and numbers
        // to be true booleans and numbers
        // and return those
        if (_value===null || _value===undefined) {
            // localStorage["foo"] returns null
            // in some browsers even if 
            // foo isn't there at all.
            // since foo is really undefined,
            // we are returning accordingly
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
    };
    var _prepare = function(_value) {
        if (typeof _value==="object" && window.JSON!==undefined) {
            return JSON.stringify(_value);
        }
        return _value;
    };
    var _get = function(_type) {
        var _storage = window[_type];
        return function(_key) {
            if (_storage!==undefined) {
                var _value = _storage[_key];
                return _parse(_value);
            }
            return undefined;
        };
    };
    var _set = function(_type) {
        var _storage = window[_type];
        return function(_key, _value) {
            if (_storage!==undefined) {
                _storage.setItem(_key, _prepare(_value));
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
                    return "No cookies set";
                }
                for (i in _storage) {
                    console.log(i, "=", _parse(_storage[i]));
                }
            }
            return undefined;
        };
    };
    var _isSupported = function(_type) {
        var _storage = window[_type];
        return function() {
            return _storage!==undefined;
        };
    };
    var _local = {
        get: _get("localStorage"),
        set: _set("localStorage"),
        remove: _remove("localStorage"),
        clear: _clear("localStorage"),
        list: _list("localStorage"),
        isSupported: _isSupported("localStorage")
    };
    var _session = {
        get: _get("sessionStorage"),
        set: _set("sessionStorage"),
        remove: _remove("sessionStorage"),
        clear: _clear("sessionStorage"),
        list: _list("sessionStorage"),
        isSupported: _isSupported("sessionStorage")
    };
    var _cookie = {
        get: function(_cookie) {
            var _cookies = document.cookie.split(";");
            var c, cl=_cookies.length;
            for (c=0; c<cl; c++) {
                var _pair = _cookies[c].split("=");
                _pair[0] = _pair[0].replace(/^[ ]/, "");
                if (_pair[0] === _cookie) {
                    return _parse(_pair[1]);
                }
            }
            return undefined;
        },
        set: function(_key, _value, _days, _path) {
            var _expires = "";
            if (_days!==undefined) {
                var _date = new Date();
                _date.setDate(_date.getDate()+_days);
                _expires = "; expires=" + _date.toUTCString();
            }
            var _value = _prepare(_value) + _expires + (_path===undefined ? "" : "; path="+_path);
            document.cookie = _key + "=" + _value;
        },
        remove: function(_key) {
            this.set(_key, "", -1);
        },
        clear: function() {
            var _cookies = document.cookie.split(";");
            var c, cl=_cookies.length;
            for (c=0; c<cl; c++) {
                var _pair = _cookies[c].split("=");
                _pair[0] = _pair[0].replace(/^[ ]/, "");
                this.set(_pair[0], "", -1);
            }
        },
        list: function() {
            var _cookies = document.cookie.split(";");
            var c, cl=_cookies.length;
            for (c=0; c<cl; c++) {
                var _pair = _cookies[c].split("=");
                _pair[0] = _pair[0].replace(/^[ ]/, "");
                console.log(_pair[0], "=", _parse(_pair[1]));
            }
        }
    };
    return {
        Local: _local,
        Session: _session,
        Cookie: _cookie
    };
}());
