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
    var _notSupported = function() {
        return undefined;
    };
    var _trim = function(_str) {
        if (!isNaN(_str)) {
            return _str;
        }
        _str = _str.replace(/^\s\s*/, '');
        var _ws = /\s/;
        var _i = _str.length;
        while (_ws.test(_str.charAt(--_i)));
        return _str.slice(0, _i + 1);
    };
    var _prepareSqlValue = function(_value) {
        if (isNaN(_value) && _value.indexOf('"')<0) {
            _value = '"' + _trim(_value) + '"';
        }
        return _value;
    };
    var _parseKeyValueList = function(_pair) {
        var _key, _fields=[], _values=[];
        for (_key in _pair) {
            if (!_key.match(/^\_/)) {
                _fields.push(_key);
                _values.push(_prepareSqlValue(_pair[_key]));
            }
        }
        return {
            fields: _fields,
            values: _values
        };
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
    var __db__ = undefined;
    var _db = {
        open: function(_name, _version, _display_name, _size) {
            __db__ = openDatabase(_name, _version, _display_name, _size);
            return __db__;
        },
        createTable: function(_name, _fields) {
            var _sql = 'CREATE TABLE IF NOT EXISTS '+_name+' ('+_fields+')';
            this.sql(_sql);
        },
        dropTable: function(_name) {
            var _sql = 'DROP TABLE '+_name;
            this.sql(_sql);
        },
        set: function(_args) {
            var _table;
            for (_table in _args) {
                var _values = _args[_table];
                var i, il=_values.length;
                for (i=0; i<il; i++) {
                    var _set = _values[i];
                    var _pairs = _parseKeyValueList(_set);
                    if (_set._where!==undefined) {
                        var _where = _parseKeyValueList(_set._where);
                        var j, jl=_pairs.fields.length, _updates=[];
                        for (j=0; j<jl; j++) {
                            _updates.push(_pairs.fields[j]+'='+_pairs.values[j]);
                        }
                        var _sql = 'UPDATE '+_table+' SET '+_updates.join(",")+' WHERE '+_where.fields+'='+_where.values;
                    } else if (_set._delete!==undefined) {
                        var _delete = _parseKeyValueList(_set._delete);
                        var _sql = 'DELETE FROM '+_table+' WHERE '+_delete.fields+'='+_delete.values;
                    } else {
                        var _sql = 'INSERT INTO '+_table+' ('+_pairs.fields+') VALUES ('+_pairs.values+')';
                    }
                    this.sql(_sql);
                }
            }
        },
        get: function(_args, _success) {
            var _sql = [];
            var _table;
            for (_table in _args) {
                var _fields = _args[_table];
                _sql.push('SELECT '+_fields+' FROM '+_table);
            }
            _sql = _sql.join(",");
            this.sql(_sql, _success);
        },
        clear: function(_table) {
            var _sql = 'DELETE * FROM '+_table;
            this.sql(_sql);
        },
        sql: function(_query, _success) {
            if (__db__===undefined) {
                console.warn("No DB open. Open with:\nVault.DB.open(_name, _version, _display_name, _size);");
                return false;
            }
            _success = _success || function() {};
            console.warn(_query);
            __db__.transaction(function(_tx) {
                return _tx.executeSql(_query, [], function(_tx, _results) {
                    _success(_results.rows);
                });
            });
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
        DB: _db,
        Cookie: _cookie
    };
}());
var local_storage = Vault.Local;
