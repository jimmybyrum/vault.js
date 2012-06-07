// wrapper for localStorage
var local_storage = {
    get: function(_key) {
        if (typeof localStorage !== "undefined") {
            var _value = localStorage[_key];
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
            return _value;
        }
        return undefined;
    },
    set: function(_key, _value) {
        if (typeof localStorage !== "undefined") {
            return localStorage[_key] = _value;
        }
        return undefined;
    },
    remove: function(_key) {
        if (typeof localStorage !== "undefined") {
            return localStorage.removeItem(_key);
        }
        return undefined;
    },
    clear: function() {
        if (typeof localStorage !== "undefined") {
            localStorage.clear();
        }
        return undefined; 
    },
    list: function() {
        if (typeof localStorage !== "undefined") {
            var i, il=localStorage.length;
            if (il===0) {
                return "0 items in localStorage";
            }
            for (i=0; i<il; i++) {
                console.log(localStorage[i], "=", this.get(localStorage[i]));
            }
        }
        return undefined;
    }
};

