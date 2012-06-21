// wrapper for localStorage, sessionStorage and document.cookie
var Vault = (function() {
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
        if (_value.indexOf && (_value.indexOf("{")===0 || _value.indexOf("[")===0)) {
            if (window.JSON!==undefined) {
                return JSON.parse(_value);
            } else {
                return eval("(" + _value + ")");
            }
        }
        return _value;
    };
    var _prepare = function(_value) {
        if (typeof _value==="object" && window.JSON!==undefined) {
            return JSON.stringify(_value);
        }
        return _value;
    };
    var _notSupported = function() {
        return undefined;
    };
    var _setup = function(_type) {
        var _storage = window[_type];
        if (_storage===undefined) {
            return {
                get: _notSupported,
                set: _notSupported,
                remove: _notSupported,
                clear: _notSupported,
                list: _notSupported,
                isSupported: function() { return false; }
            }
        }
        return {
            get: function(_key) {
                var _value = _storage[_key];
                return _parse(_value);
            },
            set: function(_key, _value) {
                return _storage.setItem(_key, _prepare(_value));
            },
            remove: function(_key) {
                return _storage.removeItem(_key);
            },
            clear: function() {
                return _storage.clear();
            },
            list: function() {
                var i, il=_storage.length;
                if (il===0) {
                    console.log("0 items in "+_type);
                    return undefined;
                }
                for (i in _storage) {
                    console.log(i, "=", _parse(_storage[i]));
                }
            },
            isSupported: function() { return true; }
        }
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
            if (cl===0) {
                console.log("No cookies set");
                return undefined;
            }
            for (c=0; c<cl; c++) {
                var _pair = _cookies[c].split("=");
                _pair[0] = _pair[0].replace(/^[ ]/, "");
                console.log(_pair[0], "=", _parse(_pair[1]));
            }
        }
    };
    return {
        Local: _setup("localStorage"),
        Session: _setup("sessionStorage"),
        Cookie: _cookie
    };
}());
