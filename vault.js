// wrapper for localStorage, sessionStorage and document.cookie
var Vault = (function() {
    var parse = function(value) {
        // everything in local storage is a string
        // so let's convert booleans and numbers
        // to be true booleans and numbers
        // and return those
        if (value===null || value===undefined) {
            // localStorage["foo"] returns null
            // in some browsers even if
            // foo isn't there at all.
            // since foo is really undefined,
            // we are returning accordingly
            return undefined;
        }
        if (value==="true") {
            return true;
        }
        if (value==="false") {
            return false;
        }
        if (!isNaN(value)) {
            return parseFloat(value);
        }
        if (value.indexOf && (value.indexOf("{")===0 || value.indexOf("[")===0) && window.JSON!==undefined) {
            return JSON.parse(value);
        }
        return value;
    };
    var prepare = function(value) {
        if (typeof value==="object" && window.JSON!==undefined) {
            return JSON.stringify(value);
        }
        return value;
    };
    var notSupported = function() {
        return undefined;
    };
    var prepareSqlValue = function(value) {
        if (isNaN(value) && value.indexOf('"')<0) {
            value = '"' + value + '"';
        }
        return value;
    };
    var parseKeyValueList = function(pair) {
        var key, fields=[], values=[];
        for (key in pair) {
            if (!key.match(/^\_/)) {
                fields.push(key);
                values.push(prepareSqlValue(pair[key]));
            }
        }
        return {
            fields: fields,
            values: values
        };
    };
    var setup = function(type) {
        var storage;
        try {
            storage = window[type];
            try {
                var test = storage["foo"];
            } catch(e) {
                storage = undefined;
            }
        } catch(e) {
            storage = undefined;
        }
        if (storage===undefined) {
            return {
                get: notSupported,
                set: notSupported,
                remove: notSupported,
                clear: notSupported,
                list: notSupported,
                isSupported: function() { return false; }
            };
        }
        return {
            get: function(key, default_value) {
                var value = parse(storage[key]);
                if (value === undefined && default_value) {
                    return default_value;
                }
                return value;
            },
            getAndRemove: function(key) {
                var value = this.get(key);
                this.remove(key);
                return value;
            },
            getList: function() {
                var list = [];
                var i, il=storage.length;
                for (i in storage) {
                    var item = {};
                    item[i] = parse(storage[i]);
                    list.push(item);
                }
                return list;
            },
            set: function(key, value) {
                try {
                    return storage.setItem(key, prepare(value));
                } catch(e) {
                    console.warn("Can't write to local stoarge. Perhaps you're using your browser in private mode? Here's the error: ", e);
                }
            },
            remove: function(key) {
                return storage.removeItem(key);
            },
            clear: function() {
                return storage.clear();
            },
            list: function() {
                var i, il=storage.length;
                if (il===0) {
                    console.log("0 items in "+type);
                    return undefined;
                }
                for (i in storage) {
                    console.log(i, "=", parse(storage[i]));
                }
            },
            isSupported: function() { return true; }
        };
    };
    var __db__;
    var db = function() {
        if (window.openDatabase===undefined) {
            return {
                info: notSupported,
                open: notSupported,
                createTable: notSupported,
                dropTable: notSupported,
                sql: notSupported,
                get: notSupported,
                set: notSupported,
                remove: notSupported,
                clear: notSupported,
                list: notSupported,
                isSupported: function() { return false; }
            };
        }
        return {
            info: function() {
                return __db__;
            },
            open: function(name, version, display_name, size) {
                __db__ = window.openDatabase(name, version, display_name, size);
                return __db__;
            },
            create: function(tables) {
                var table;
                for (table in tables) {
                    var fields = tables[table];
                    var sql = 'CREATE TABLE IF NOT EXISTS '+table+' ('+fields+')';
                    this.sql(sql);
                }
            },
            drop: function(tables) {
                var i, il=tables.length;
                for (i=0; i<il; i++) {
                    var table = tables[i];
                    var sql = 'DROP TABLE '+table;
                    this.sql(sql);
                }
            },
            get: function(args, success) {
                var sql = [];
                var table;
                for (table in args) {
                    var fields = args[table];
                    sql.push('SELECT '+fields+' FROM '+table);
                }
                sql = sql.join(",");
                this.sql(sql, success);
            },
            set: function(args) {
                var table;
                for (table in args) {
                    var values = args[table];
                    var i, il=values.length;
                    for (i=0; i<il; i++) {
                        var set = values[i];
                        var pairs = parseKeyValueList(set);
                        var sql;
                        if (set.where!==undefined) {
                            var where = parseKeyValueList(set.where);
                            var j, jl=pairs.fields.length, updates=[];
                            for (j=0; j<jl; j++) {
                                updates.push(pairs.fields[j]+'='+pairs.values[j]);
                            }
                            sql = 'UPDATE '+table+' SET '+updates.join(",")+' WHERE '+where.fields+'='+where.values;
                            this.sql(sql);
                        } else if (set.remove!==undefined) {
                            var rm = {};
                            rm[table] = [set.remove];
                            this.remove(rm);
                        } else {
                            sql = 'INSERT INTO '+table+' ('+pairs.fields+') VALUES ('+pairs.values+')';
                            this.sql(sql);
                        }
                    }
                }
            },
            remove: function(args) {
                var table;
                for (table in args) {
                    var pairs = args[table];
                    var i, il=pairs.length;
                    for (i=0; i<il; i++) {
                        var values = pairs[i];
                        var remove = parseKeyValueList(values);
                        var sql = 'DELETE FROM '+table+' WHERE '+remove.fields+'='+remove.values;
                        this.sql(sql);
                    }
                }
            },
            clear: function(tables) {
                var i, il=tables.length;
                for (i=0; i<il; i++) {
                    var table = tables[i];
                    var sql = 'DELETE FROM '+table;
                    this.sql(sql);
                }
            },
            sql: function(query, success) {
                if (__db__===undefined) {
                    console.warn("No DB open. Open with:\nVault.DB.open(name, version, display_name, size);\nQuery: "+query);
                    return false;
                }
                success = success || function() {};
                console.log(query);
                __db__.transaction(function(tx) {
                    return tx.executeSql(query, [], function(tx, results) {
                        if (results.rows!==undefined) {
                            var i, il=results.rows.length;
                            var res = [];
                            for (i=0; i<il; i++) {
                                var row = results.rows.item(i);
                                res.push(row);
                            }
                            success(res);
                        }
                    });
                });
            },
            isSupported: function() { return true; }
        };
    };
    var cookie = {
        get: function(cookie, default_value) {
            var cookies = document.cookie.split(";");
            var c, cl=cookies.length;
            for (c=0; c<cl; c++) {
                var pair = cookies[c].split("=");
                pair[0] = pair[0].replace(/^[ ]/, "");
                if (pair[0] === cookie) {
                    return parse(pair[1]);
                }
            }
            return default_value;
        },
        getAndRemove: function(key) {
            var value = this.get(key);
            this.remove(key);
            return value;
        },
        getList: function() {
            var list = [];
            var cookies = document.cookie.split(";");
            var c, cl=cookies.length;
            for (c=0; c<cl; c++) {
                var pair = cookies[c].split("=");
                pair[0] = pair[0].replace(/^[ ]/, "");
                var item = {};
                item[pair[0]] = parse(pair[1]);
                list.push(item);
            }
            return list;
        },
        set: function(key, value, milliseconds, path) {
            var expires = "";
            if (milliseconds!==undefined) {
                var date = new Date();
                date.setMilliseconds(date.getMilliseconds()+milliseconds);
                expires = "; expires=" + date.toUTCString();
            }
            value = prepare(value) + expires + (path===undefined ? "" : "; path="+path);
            document.cookie = key + "=" + value;
        },
        remove: function(key) {
            document.cookie = key + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        },
        clear: function() {
            var cookies = document.cookie.split(";");
            var c, cl=cookies.length;
            for (c=0; c<cl; c++) {
                var pair = cookies[c].split("=");
                pair[0] = pair[0].replace(/^[ ]/, "");
                this.remove(pair[0]);
            }
        },
        list: function() {
            var cookies = document.cookie.split(";");
            var c, cl=cookies.length;
            if (cl===0) {
                console.log("No cookies set");
                return undefined;
            }
            for (c=0; c<cl; c++) {
                var pair = cookies[c].split("=");
                pair[0] = pair[0].replace(/^[ ]/, "");
                console.log(pair[0], "=", parse(pair[1]));
            }
        }
    };
    return {
        Local: setup("localStorage"),
        Session: setup("sessionStorage"),
        DB: db(),
        Cookie: cookie
    };
}());
