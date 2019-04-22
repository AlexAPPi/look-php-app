var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("Look/Util", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var class2type = {};
    var getProto = Object.getPrototypeOf;
    var toString = class2type.toString;
    exports.toString = toString;
    var hasOwn = class2type.hasOwnProperty;
    exports.hasOwn = hasOwn;
    var fnToString = hasOwn.toString;
    exports.fnToString = fnToString;
    var ObjectFunctionString = fnToString.call(Object);
    exports.ObjectFunctionString = ObjectFunctionString;
    var isArray = Array.isArray;
    exports.isArray = isArray;
    function isUndefined(obj) { return typeof obj === "undefined"; }
    exports.isUndefined = isUndefined;
    function isFunction(obj) { return typeof obj === "function" && typeof obj.nodeType !== "number"; }
    exports.isFunction = isFunction;
    function getXhr() {
        try {
            return new ActiveXObject("Msxml2.XMLHTTP");
        }
        catch (e) {
            try {
                return new ActiveXObject("Microsoft.XMLHTTP");
            }
            catch (E) { }
        }
        if (typeof XMLHttpRequest !== 'undefined')
            return new XMLHttpRequest();
        return false;
    }
    exports.getXhr = getXhr;
    function isPlainObject(obj) {
        var proto, Ctor;
        if (!obj || toString.call(obj) !== "[object Object]") {
            return false;
        }
        proto = getProto(obj);
        if (!proto) {
            return true;
        }
        Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
        return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
    }
    exports.isPlainObject = isPlainObject;
    function isWindow(obj) { return obj !== null && obj === obj.window; }
    exports.isWindow = isWindow;
    function toType(obj) {
        if (obj === null)
            return obj + "";
        return typeof obj === "object" || typeof obj === "function" ?
            class2type[toString.call(obj)] || "object" :
            typeof obj;
    }
    exports.toType = toType;
    function isArrayLike(obj) {
        var length = !!obj && "length" in obj && obj.length, type = toType(obj);
        if (isFunction(obj) || isWindow(obj)) {
            return false;
        }
        return type === "array" || length === 0 || typeof length === "number" && length > 0 && (length - 1) in obj;
    }
    exports.isArrayLike = isArrayLike;
    function each(obj, callback) {
        if (isArrayLike(obj)) {
            var length = obj.length, i = 0;
            for (; i < length; i++)
                if (callback.call(obj[i], i, obj[i]) === false)
                    break;
        }
        else {
            var prop;
            for (prop in obj)
                if (callback.call(obj[prop], prop, obj[prop]) === false)
                    break;
        }
        return obj;
    }
    exports.each = each;
    function extend() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {}, i = 1, length = arguments.length, deep = false;
        if (typeof target === "boolean") {
            deep = target;
            target = arguments[i] || {};
            i++;
        }
        if (typeof target !== "object" && !isFunction(target)) {
            target = {};
        }
        if (i === length) {
            target = this;
            i--;
        }
        for (; i < length; i++) {
            if ((options = arguments[i]) !== null) {
                for (name in options) {
                    src = target[name];
                    copy = options[name];
                    if (target === copy) {
                        continue;
                    }
                    if (deep && copy && (isPlainObject(copy) ||
                        (copyIsArray = isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && isArray(src) ? src : [];
                        }
                        else {
                            clone = src && isPlainObject(src) ? src : {};
                        }
                        target[name] = extend(deep, clone, copy);
                    }
                    else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }
        return target;
    }
    exports.extend = extend;
    function buildParams(prefix, obj, traditional, add) {
        var name;
        if (isArray(obj)) {
            each(obj, function (i, v) {
                if (traditional || /\[\]$/.test(prefix)) {
                    add(prefix, v);
                }
                else {
                    buildParams(prefix + "[" + (typeof v === "object" && v !== null ? i : "") + "]", v, traditional, add);
                }
            });
        }
        else if (!traditional && toType(obj) === "object") {
            for (name in obj) {
                buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
            }
        }
        else {
            add(prefix, obj);
        }
    }
    exports.buildParams = buildParams;
    function param(a, traditional) {
        if (traditional === void 0) { traditional = false; }
        var prefix, s = [], add = function (key, valueOrFunction) {
            var value = isFunction(valueOrFunction) ?
                valueOrFunction() :
                valueOrFunction;
            s[s.length] = encodeURIComponent(key) + "=" +
                encodeURIComponent(value === null ? "" : value);
        };
        if (isArray(a) || (a && a.jquery && !isPlainObject(a))) {
            each(a, function () {
                add(this.name, this.value);
            });
        }
        else {
            for (prefix in a) {
                buildParams(prefix, a[prefix], traditional, add);
            }
        }
        return s.join("&");
    }
    exports.param = param;
    ;
    function map(elems, callback, arg) {
        if (arg === void 0) { arg = null; }
        var length, value, i, ret = [];
        if (isArrayLike(elems)) {
            length = elems.length;
            i = 0;
            for (; i < length; i++) {
                value = callback(elems[i], i, arg);
                if (value !== null) {
                    ret.push(value);
                }
            }
        }
        else {
            for (i in elems) {
                value = callback(elems[i], i, arg);
                if (value !== null) {
                    ret.push(value);
                }
            }
        }
        return [].concat.apply([], ret);
    }
    exports.map = map;
    function getValue(elem) {
        if (elem) {
            var ret = elem.value;
            if (typeof ret === "string") {
                return ret.replace(/\r/g, "");
            }
            return ret === null ? "" : ret;
        }
        return null;
    }
    exports.getValue = getValue;
    function setValue(elem, value) {
        var valueIsFunction = isFunction(value), val, result;
        if (elem.nodeType !== 1) {
            return;
        }
        if (valueIsFunction) {
            val = value.call(elem, val(elem));
        }
        else {
            val = value;
        }
        if (val === null) {
            result = "";
        }
        else if (typeof val === "number") {
            result += val + "";
        }
        else if (Array.isArray(val)) {
            result = map(val, function (value) {
                return value === null ? "" : value + "";
            });
        }
        elem.value = result;
    }
    exports.setValue = setValue;
    function serialize(form) {
        var serialized = {};
        for (var i = 0; i < form.elements.length; i++) {
            var field = form.elements[i];
            if (!field.name
                || field.disabled
                || field.type === 'file'
                || field.type === 'reset'
                || field.type === 'submit'
                || field.type === 'button')
                continue;
            if (field.type === 'select-multiple') {
                serialized[field.name] = [];
                for (var n = 0; n < field.options.length; n++) {
                    if (!field.options[n].selected)
                        continue;
                    serialized[field.name].push(getValue(field.options[n].value));
                }
            }
            else if (field.type === 'checkbox') {
                serialized[field.name] = field.checked;
            }
            else if (field.type !== 'radio' || field.checked) {
                serialized[field.name] = getValue(field);
            }
        }
        return param(serialized);
    }
    exports.serialize = serialize;
    function getCurrectTimeStamp() {
        return Math.round((new Date()).getTime() / 1000);
    }
    exports.getCurrectTimeStamp = getCurrectTimeStamp;
    function hex2a(hexx) {
        var hex = hexx.toString();
        var str = '';
        for (var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        return str;
    }
    exports.hex2a = hex2a;
    function a2hex(str) {
        var arr = [];
        for (var i = 0, l = str.length; i < l; i++) {
            var hex = Number(str.charCodeAt(i)).toString(16);
            arr.push(hex);
        }
        return arr.join('');
    }
    exports.a2hex = a2hex;
});
define("Look/Use/QueryData", ["require", "exports", "Look/Util"], function (require, exports, Util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var QueryMethod;
    (function (QueryMethod) {
        QueryMethod["GET"] = "GET";
        QueryMethod["PUT"] = "PUT";
        QueryMethod["POST"] = "POST";
        QueryMethod["DELETE"] = "DELETE";
    })(QueryMethod = exports.QueryMethod || (exports.QueryMethod = {}));
    var QueryData = (function () {
        function QueryData(url, data, method) {
            if (method === void 0) { method = QueryMethod.GET; }
            this.url = url;
            this.data = data;
            this.method = method;
            this.data = data || {};
        }
        QueryData.prototype.getMethod = function () {
            return this.method;
        };
        QueryData.prototype.isGet = function () { return this.getMethod() === QueryMethod.GET; };
        QueryData.prototype.isPut = function () { return this.getMethod() === QueryMethod.PUT; };
        QueryData.prototype.isPost = function () { return this.getMethod() === QueryMethod.POST; };
        QueryData.prototype.isDelete = function () { return this.getMethod() === QueryMethod.DELETE; };
        QueryData.prototype.getData = function () {
            return this.data;
        };
        QueryData.prototype.getSendData = function () {
            return Util_1.param(this.data);
        };
        QueryData.prototype.setData = function (data) {
            this.data = data;
        };
        QueryData.prototype.getDataByName = function (name) {
            return this.data[name];
        };
        QueryData.prototype.setDataByName = function (name, value) {
            this.data[name] = value;
        };
        QueryData.prototype.unsetDataByName = function (name) {
            delete this.data[name];
        };
        QueryData.prototype.hasDataByName = function (name) {
            return !Util_1.isUndefined(this.data[name]);
        };
        QueryData.prototype.getClearUrl = function () {
            return this.url;
        };
        QueryData.prototype.getUrl = function () {
            if (this.method === QueryMethod.GET) {
                var params = this.getSendData();
                if (params.length > 0) {
                    return this.url + '?' + params;
                }
            }
            return this.url;
        };
        return QueryData;
    }());
    exports.default = QueryData;
});
define("Look/Use/ErrorObject", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ErrorObject = (function (_super) {
        __extends(ErrorObject, _super);
        function ErrorObject(code, msg) {
            var _this = _super.call(this, msg) || this;
            _this.code = code;
            _this.msg = msg;
            return _this;
        }
        return ErrorObject;
    }(Error));
    exports.ErrorObject = ErrorObject;
});
define("Look/Use/ErrorQueryObject", ["require", "exports", "Look/Use/ErrorObject"], function (require, exports, ErrorObject_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ErrorQueryObject = (function (_super) {
        __extends(ErrorQueryObject, _super);
        function ErrorQueryObject(code, msg, params) {
            var _this = _super.call(this, code, msg) || this;
            _this.requestParams = params;
            return _this;
        }
        ErrorQueryObject.simulationObject = function (code, msg, data, extract) {
            if (extract === void 0) { extract = false; }
            var obj = new ErrorQueryObject(code, msg, data);
            if (extract) {
                return obj;
            }
            return { error: obj };
        };
        return ErrorQueryObject;
    }(ErrorObject_1.ErrorObject));
    exports.default = ErrorQueryObject;
    ;
});
define("Look/Waiter/Simple", ["require", "exports", "Look/Util"], function (require, exports, Util_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Simple = (function () {
        function Simple(initCallback, delay) {
            if (delay === void 0) { delay = 100; }
            this.callbacks = {};
            this.running = false;
            this.newThis = this;
            this.delay = delay;
            this.initCallback = initCallback;
            this.sleep();
        }
        Simple.prototype.getDelay = function () {
            return this.delay;
        };
        ;
        Simple.prototype.getCallbacks = function () {
            return this.callbacks;
        };
        Simple.prototype.clearCallbacks = function (eventName) {
            if (eventName) {
                if (typeof this.callbacks[eventName] === 'undefined') {
                    this.callbacks[eventName] = null;
                    this.callbacks[eventName] = [];
                }
            }
            else {
                this.callbacks = null;
                this.callbacks = {};
            }
            return this;
        };
        Simple.prototype.setBuffer = function (data) {
            this.buffer = data;
            return this;
        };
        Simple.prototype.setThis = function (nthis) {
            this.newThis = nthis;
            return this;
        };
        Simple.prototype.unsetThis = function () {
            this.newThis = this;
            return this;
        };
        ;
        Simple.prototype.on = function (eventName, callback) {
            if (typeof this.callbacks[eventName] === 'undefined' || this.callbacks[eventName] == null) {
                this.callbacks[eventName] = [];
            }
            this.callbacks[eventName].push(callback);
            return this;
        };
        ;
        Simple.prototype.callback = function (eventName, data, newThis) {
            var flag = false, calls = this.callbacks[eventName], i = 0;
            if (!newThis) {
                newThis = this.newThis;
            }
            if (Util_2.isArray(calls) && calls.length > 0) {
                for (; i < calls.length; i++) {
                    var callback = calls[i];
                    if (Util_2.isFunction(callback)) {
                        callback.call(newThis, data, this);
                        flag = true;
                    }
                }
            }
            return flag;
        };
        Simple.prototype.onInit = function (callback) {
            return this.on("init", callback);
        };
        Simple.prototype.onAbort = function (callback) {
            return this.on("abort", callback);
        };
        Simple.prototype.callbackInit = function (data) {
            if (data === void 0) { data = null; }
            this.callback("init", data);
        };
        Simple.prototype.callbackAbort = function (data) {
            if (data === void 0) { data = null; }
            this.callback("abort", data);
        };
        ;
        Simple.prototype.abort = function (data, callback) {
            if (callback === void 0) { callback = true; }
            if (this.timerBegin) {
                clearTimeout(this.timerBegin);
            }
            if (this.running && callback) {
                this.callbackAbort(data);
            }
            this.running = false;
            return this;
        };
        ;
        Simple.prototype.init = function () {
            if (!this.running) {
                if (this.timerBegin) {
                    clearTimeout(this.timerBegin);
                }
                this.running = true;
                this.initCallback.call(this);
                this.callbackInit();
            }
            return this;
        };
        ;
        Simple.prototype.sleep = function (time) {
            if (time === void 0) { time = null; }
            var self = this;
            this.abort(null, false);
            this.delay = time || this.delay;
            this.timerBegin = setTimeout(function () {
                self.init();
            }, this.delay);
            return this;
        };
        Simple.prototype.repeat = function (delay) {
            if (delay === void 0) { delay = 0; }
            this.sleep(delay);
            return this;
        };
        Simple.prototype.callbackExists = function (eventName) {
            return (typeof this.callbacks[eventName] !== 'undefined'
                && this.callbacks[eventName]
                && this.callbacks[eventName].length > 0);
        };
        return Simple;
    }());
    exports.default = Simple;
});
define("Look/Waiter/Errorable", ["require", "exports", "Look/Waiter/Simple"], function (require, exports, Simple_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Errorable = (function (_super) {
        __extends(Errorable, _super);
        function Errorable() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Errorable.prototype.onSuccess = function (callback) {
            return this.on("success", callback);
        };
        Errorable.prototype.onError = function (callback) {
            return this.on("error", callback);
        };
        Errorable.prototype.callbackSuccess = function (data, newThis) {
            return this.callback("success", data, newThis);
        };
        Errorable.prototype.callbackError = function (data, newThis) {
            return this.callback("error", data, newThis);
        };
        return Errorable;
    }(Simple_1.default));
    exports.default = Errorable;
});
define("Look/Waiter/Queryable", ["require", "exports", "Look/Waiter/Errorable"], function (require, exports, Errorable_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Queryable = (function (_super) {
        __extends(Queryable, _super);
        function Queryable() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.vCallErrorIfNotSuccess = false;
            return _this;
        }
        Queryable.prototype.callErrorIfNotSuccess = function (value) {
            if (value === void 0) { value = true; }
            this.vCallErrorIfNotSuccess = value;
            return this;
        };
        Queryable.prototype.calledErrorIfNotSuccess = function () {
            return this.vCallErrorIfNotSuccess;
        };
        Queryable.prototype.callbackStart = function (data, newThis) {
            return this.callback("start", data, newThis);
        };
        Queryable.prototype.callbackTimeout = function (data, newThis) {
            return this.callback("timeout", data, newThis);
        };
        Queryable.prototype.callbackProcess = function (data, newThis) {
            return this.callback("process", data, newThis);
        };
        Queryable.prototype.onStart = function (callback) {
            return this.on("start", callback);
        };
        Queryable.prototype.onTimeout = function (callback) {
            return this.on("timeout", callback);
        };
        Queryable.prototype.onProcess = function (callback) {
            return this.on("process", callback);
        };
        return Queryable;
    }(Errorable_1.default));
    exports.default = Queryable;
});
define("Look/Waiter/XHRable", ["require", "exports", "Look/Waiter/Queryable"], function (require, exports, Queryable_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var XHRable = (function (_super) {
        __extends(XHRable, _super);
        function XHRable() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        XHRable.prototype.onLoad = function (callback) {
            return this.on("load", callback);
        };
        XHRable.prototype.callbackLoad = function (data, newThis) {
            return this.callback("load", data, newThis);
        };
        XHRable.prototype.onLoadStart = function (callback) {
            return this.on("loadstart", callback);
        };
        XHRable.prototype.callbackLoadStart = function (data, newThis) {
            return this.callback("loadstart", data, newThis);
        };
        XHRable.prototype.onLoadEnd = function (callback) {
            return this.on("loadend", callback);
        };
        XHRable.prototype.callbackLoadEnd = function (data, newThis) {
            return this.callback("loadend", data, newThis);
        };
        XHRable.prototype.onReadyStateChange = function (callback) {
            return this.on("readystatechange", callback);
        };
        XHRable.prototype.callbackReadyStateChange = function (data, newThis) {
            return this.callback("readystatechange", data, newThis);
        };
        return XHRable;
    }(Queryable_1.default));
    exports.default = XHRable;
});
define("Look/Use/Query", ["require", "exports", "Look/Waiter/XHRable"], function (require, exports, XHRable_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Query = (function (_super) {
        __extends(Query, _super);
        function Query(queryData, delay, timeout) {
            var _this = _super.call(this, function () {
                try {
                    this.checkBeforeInit();
                    this.xhr = this.initXHR();
                }
                catch (e) {
                    var callback = this.xhr
                        && this.xhr.readyState != 0
                        && this.xhr.readyState != 4;
                    this.abort(e, callback);
                    this.callbackError(e);
                }
            }, delay) || this;
            _this.queryData = queryData;
            _this.timeout = timeout;
            return _this;
        }
        return Query;
    }(XHRable_1.default));
    exports.default = Query;
});
define("Lib/jsbn/util", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
    function int2char(n) {
        return BI_RM.charAt(n);
    }
    exports.int2char = int2char;
    function op_and(x, y) {
        return x & y;
    }
    exports.op_and = op_and;
    function op_or(x, y) {
        return x | y;
    }
    exports.op_or = op_or;
    function op_xor(x, y) {
        return x ^ y;
    }
    exports.op_xor = op_xor;
    function op_andnot(x, y) {
        return x & ~y;
    }
    exports.op_andnot = op_andnot;
    function lbit(x) {
        if (x == 0) {
            return -1;
        }
        var r = 0;
        if ((x & 0xffff) == 0) {
            x >>= 16;
            r += 16;
        }
        if ((x & 0xff) == 0) {
            x >>= 8;
            r += 8;
        }
        if ((x & 0xf) == 0) {
            x >>= 4;
            r += 4;
        }
        if ((x & 3) == 0) {
            x >>= 2;
            r += 2;
        }
        if ((x & 1) == 0) {
            ++r;
        }
        return r;
    }
    exports.lbit = lbit;
    function cbit(x) {
        var r = 0;
        while (x != 0) {
            x &= x - 1;
            ++r;
        }
        return r;
    }
    exports.cbit = cbit;
});
define("Lib/jsbn/base64", ["require", "exports", "Lib/jsbn/util"], function (require, exports, util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var b64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var b64pad = "=";
    function hex2b64(h) {
        var i;
        var c;
        var ret = "";
        for (i = 0; i + 3 <= h.length; i += 3) {
            c = parseInt(h.substring(i, i + 3), 16);
            ret += b64map.charAt(c >> 6) + b64map.charAt(c & 63);
        }
        if (i + 1 == h.length) {
            c = parseInt(h.substring(i, i + 1), 16);
            ret += b64map.charAt(c << 2);
        }
        else if (i + 2 == h.length) {
            c = parseInt(h.substring(i, i + 2), 16);
            ret += b64map.charAt(c >> 2) + b64map.charAt((c & 3) << 4);
        }
        while ((ret.length & 3) > 0) {
            ret += b64pad;
        }
        return ret;
    }
    exports.hex2b64 = hex2b64;
    function b64tohex(s) {
        var ret = "";
        var i;
        var k = 0;
        var slop = 0;
        for (i = 0; i < s.length; ++i) {
            if (s.charAt(i) == b64pad) {
                break;
            }
            var v = b64map.indexOf(s.charAt(i));
            if (v < 0) {
                continue;
            }
            if (k == 0) {
                ret += util_1.int2char(v >> 2);
                slop = v & 3;
                k = 1;
            }
            else if (k == 1) {
                ret += util_1.int2char((slop << 2) | (v >> 4));
                slop = v & 0xf;
                k = 2;
            }
            else if (k == 2) {
                ret += util_1.int2char(slop);
                ret += util_1.int2char(v >> 2);
                slop = v & 3;
                k = 3;
            }
            else {
                ret += util_1.int2char((slop << 2) | (v >> 4));
                ret += util_1.int2char(v & 0xf);
                k = 0;
            }
        }
        if (k == 1) {
            ret += util_1.int2char(slop << 2);
        }
        return ret;
    }
    exports.b64tohex = b64tohex;
    function b64toBA(s) {
        var h = b64tohex(s);
        var i;
        var a = [];
        for (i = 0; 2 * i < h.length; ++i) {
            a[i] = parseInt(h.substring(2 * i, 2 * i + 2), 16);
        }
        return a;
    }
    exports.b64toBA = b64toBA;
});
define("Lib/asn1js/hex", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var decoder;
    exports.Hex = {
        decode: function (a) {
            var i;
            if (decoder === undefined) {
                var hex = "0123456789ABCDEF";
                var ignore = " \f\n\r\t\u00A0\u2028\u2029";
                decoder = {};
                for (i = 0; i < 16; ++i) {
                    decoder[hex.charAt(i)] = i;
                }
                hex = hex.toLowerCase();
                for (i = 10; i < 16; ++i) {
                    decoder[hex.charAt(i)] = i;
                }
                for (i = 0; i < ignore.length; ++i) {
                    decoder[ignore.charAt(i)] = -1;
                }
            }
            var out = [];
            var bits = 0;
            var char_count = 0;
            for (i = 0; i < a.length; ++i) {
                var c = a.charAt(i);
                if (c == "=") {
                    break;
                }
                c = decoder[c];
                if (c == -1) {
                    continue;
                }
                if (c === undefined) {
                    throw new Error("Illegal character at offset " + i);
                }
                bits |= c;
                if (++char_count >= 2) {
                    out[out.length] = bits;
                    bits = 0;
                    char_count = 0;
                }
                else {
                    bits <<= 4;
                }
            }
            if (char_count) {
                throw new Error("Hex encoding incomplete: 4 bits missing");
            }
            return out;
        }
    };
});
define("Lib/asn1js/base64", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var decoder;
    exports.Base64 = {
        decode: function (a) {
            var i;
            if (decoder === undefined) {
                var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
                var ignore = "= \f\n\r\t\u00A0\u2028\u2029";
                decoder = Object.create(null);
                for (i = 0; i < 64; ++i) {
                    decoder[b64.charAt(i)] = i;
                }
                for (i = 0; i < ignore.length; ++i) {
                    decoder[ignore.charAt(i)] = -1;
                }
            }
            var out = [];
            var bits = 0;
            var char_count = 0;
            for (i = 0; i < a.length; ++i) {
                var c = a.charAt(i);
                if (c == "=") {
                    break;
                }
                c = decoder[c];
                if (c == -1) {
                    continue;
                }
                if (c === undefined) {
                    throw new Error("Illegal character at offset " + i);
                }
                bits |= c;
                if (++char_count >= 4) {
                    out[out.length] = (bits >> 16);
                    out[out.length] = (bits >> 8) & 0xFF;
                    out[out.length] = bits & 0xFF;
                    bits = 0;
                    char_count = 0;
                }
                else {
                    bits <<= 6;
                }
            }
            switch (char_count) {
                case 1:
                    throw new Error("Base64 encoding incomplete: at least 2 bits missing");
                case 2:
                    out[out.length] = (bits >> 10);
                    break;
                case 3:
                    out[out.length] = (bits >> 16);
                    out[out.length] = (bits >> 8) & 0xFF;
                    break;
            }
            return out;
        },
        re: /-----BEGIN [^-]+-----([A-Za-z0-9+\/=\s]+)-----END [^-]+-----|begin-base64[^\n]+\n([A-Za-z0-9+\/=\s]+)====/,
        unarmor: function (a) {
            var m = exports.Base64.re.exec(a);
            if (m) {
                if (m[1]) {
                    a = m[1];
                }
                else if (m[2]) {
                    a = m[2];
                }
                else {
                    throw new Error("RegExp out of sync");
                }
            }
            return exports.Base64.decode(a);
        }
    };
});
define("Lib/asn1js/int10", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var max = 10000000000000;
    var Int10 = (function () {
        function Int10(value) {
            this.buf = [+value || 0];
        }
        Int10.prototype.mulAdd = function (m, c) {
            var b = this.buf;
            var l = b.length;
            var i;
            var t;
            for (i = 0; i < l; ++i) {
                t = b[i] * m + c;
                if (t < max) {
                    c = 0;
                }
                else {
                    c = 0 | (t / max);
                    t -= c * max;
                }
                b[i] = t;
            }
            if (c > 0) {
                b[i] = c;
            }
        };
        Int10.prototype.sub = function (c) {
            var b = this.buf;
            var l = b.length;
            var i;
            var t;
            for (i = 0; i < l; ++i) {
                t = b[i] - c;
                if (t < 0) {
                    t += max;
                    c = 1;
                }
                else {
                    c = 0;
                }
                b[i] = t;
            }
            while (b[b.length - 1] === 0) {
                b.pop();
            }
        };
        Int10.prototype.toString = function (base) {
            if ((base || 10) != 10) {
                throw new Error("only base 10 is supported");
            }
            var b = this.buf;
            var s = b[b.length - 1].toString();
            for (var i = b.length - 2; i >= 0; --i) {
                s += (max + b[i]).toString().substring(1);
            }
            return s;
        };
        Int10.prototype.valueOf = function () {
            var b = this.buf;
            var v = 0;
            for (var i = b.length - 1; i >= 0; --i) {
                v = v * max + b[i];
            }
            return v;
        };
        Int10.prototype.simplify = function () {
            var b = this.buf;
            return (b.length == 1) ? b[0] : this;
        };
        return Int10;
    }());
    exports.Int10 = Int10;
});
define("Lib/asn1js/asn1", ["require", "exports", "Lib/asn1js/int10"], function (require, exports, int10_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ellipsis = "\u2026";
    var reTimeS = /^(\d\d)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([01]\d|2[0-3])(?:([0-5]\d)(?:([0-5]\d)(?:[.,](\d{1,3}))?)?)?(Z|[-+](?:[0]\d|1[0-2])([0-5]\d)?)?$/;
    var reTimeL = /^(\d\d\d\d)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([01]\d|2[0-3])(?:([0-5]\d)(?:([0-5]\d)(?:[.,](\d{1,3}))?)?)?(Z|[-+](?:[0]\d|1[0-2])([0-5]\d)?)?$/;
    function stringCut(str, len) {
        if (str.length > len) {
            str = str.substring(0, len) + ellipsis;
        }
        return str;
    }
    var Stream = (function () {
        function Stream(enc, pos) {
            this.hexDigits = "0123456789ABCDEF";
            if (enc instanceof Stream) {
                this.enc = enc.enc;
                this.pos = enc.pos;
            }
            else {
                this.enc = enc;
                this.pos = pos;
            }
        }
        Stream.prototype.get = function (pos) {
            if (pos === undefined) {
                pos = this.pos++;
            }
            if (pos >= this.enc.length) {
                throw new Error("Requesting byte offset " + pos + " on a stream of length " + this.enc.length);
            }
            return ("string" === typeof this.enc) ? this.enc.charCodeAt(pos) : this.enc[pos];
        };
        Stream.prototype.hexByte = function (b) {
            return this.hexDigits.charAt((b >> 4) & 0xF) + this.hexDigits.charAt(b & 0xF);
        };
        Stream.prototype.hexDump = function (start, end, raw) {
            var s = "";
            for (var i = start; i < end; ++i) {
                s += this.hexByte(this.get(i));
                if (raw !== true) {
                    switch (i & 0xF) {
                        case 0x7:
                            s += "  ";
                            break;
                        case 0xF:
                            s += "\n";
                            break;
                        default:
                            s += " ";
                    }
                }
            }
            return s;
        };
        Stream.prototype.isASCII = function (start, end) {
            for (var i = start; i < end; ++i) {
                var c = this.get(i);
                if (c < 32 || c > 176) {
                    return false;
                }
            }
            return true;
        };
        Stream.prototype.parseStringISO = function (start, end) {
            var s = "";
            for (var i = start; i < end; ++i) {
                s += String.fromCharCode(this.get(i));
            }
            return s;
        };
        Stream.prototype.parseStringUTF = function (start, end) {
            var s = "";
            for (var i = start; i < end;) {
                var c = this.get(i++);
                if (c < 128) {
                    s += String.fromCharCode(c);
                }
                else if ((c > 191) && (c < 224)) {
                    s += String.fromCharCode(((c & 0x1F) << 6) | (this.get(i++) & 0x3F));
                }
                else {
                    s += String.fromCharCode(((c & 0x0F) << 12) | ((this.get(i++) & 0x3F) << 6) | (this.get(i++) & 0x3F));
                }
            }
            return s;
        };
        Stream.prototype.parseStringBMP = function (start, end) {
            var str = "";
            var hi;
            var lo;
            for (var i = start; i < end;) {
                hi = this.get(i++);
                lo = this.get(i++);
                str += String.fromCharCode((hi << 8) | lo);
            }
            return str;
        };
        Stream.prototype.parseTime = function (start, end, shortYear) {
            var s = this.parseStringISO(start, end);
            var m = (shortYear ? reTimeS : reTimeL).exec(s);
            if (!m) {
                return "Unrecognized time: " + s;
            }
            if (shortYear) {
                m[1] = +m[1];
                m[1] += (+m[1] < 70) ? 2000 : 1900;
            }
            s = m[1] + "-" + m[2] + "-" + m[3] + " " + m[4];
            if (m[5]) {
                s += ":" + m[5];
                if (m[6]) {
                    s += ":" + m[6];
                    if (m[7]) {
                        s += "." + m[7];
                    }
                }
            }
            if (m[8]) {
                s += " UTC";
                if (m[8] != "Z") {
                    s += m[8];
                    if (m[9]) {
                        s += ":" + m[9];
                    }
                }
            }
            return s;
        };
        Stream.prototype.parseInteger = function (start, end) {
            var v = this.get(start);
            var neg = (v > 127);
            var pad = neg ? 255 : 0;
            var len;
            var s = "";
            while (v == pad && ++start < end) {
                v = this.get(start);
            }
            len = end - start;
            if (len === 0) {
                return neg ? -1 : 0;
            }
            if (len > 4) {
                s = v;
                len <<= 3;
                while (((+s ^ pad) & 0x80) == 0) {
                    s = +s << 1;
                    --len;
                }
                s = "(" + len + " bit)\n";
            }
            if (neg) {
                v = v - 256;
            }
            var n = new int10_1.Int10(v);
            for (var i = start + 1; i < end; ++i) {
                n.mulAdd(256, this.get(i));
            }
            return s + n.toString();
        };
        Stream.prototype.parseBitString = function (start, end, maxLength) {
            var unusedBit = this.get(start);
            var lenBit = ((end - start - 1) << 3) - unusedBit;
            var intro = "(" + lenBit + " bit)\n";
            var s = "";
            for (var i = start + 1; i < end; ++i) {
                var b = this.get(i);
                var skip = (i == end - 1) ? unusedBit : 0;
                for (var j = 7; j >= skip; --j) {
                    s += (b >> j) & 1 ? "1" : "0";
                }
                if (s.length > maxLength) {
                    return intro + stringCut(s, maxLength);
                }
            }
            return intro + s;
        };
        Stream.prototype.parseOctetString = function (start, end, maxLength) {
            if (this.isASCII(start, end)) {
                return stringCut(this.parseStringISO(start, end), maxLength);
            }
            var len = end - start;
            var s = "(" + len + " byte)\n";
            maxLength /= 2;
            if (len > maxLength) {
                end = start + maxLength;
            }
            for (var i = start; i < end; ++i) {
                s += this.hexByte(this.get(i));
            }
            if (len > maxLength) {
                s += ellipsis;
            }
            return s;
        };
        Stream.prototype.parseOID = function (start, end, maxLength) {
            var s = "";
            var n = new int10_1.Int10();
            var bits = 0;
            for (var i = start; i < end; ++i) {
                var v = this.get(i);
                n.mulAdd(128, v & 0x7F);
                bits += 7;
                if (!(v & 0x80)) {
                    if (s === "") {
                        n = n.simplify();
                        if (n instanceof int10_1.Int10) {
                            n.sub(80);
                            s = "2." + n.toString();
                        }
                        else {
                            var m = n < 80 ? n < 40 ? 0 : 1 : 2;
                            s = m + "." + (n - m * 40);
                        }
                    }
                    else {
                        s += "." + n.toString();
                    }
                    if (s.length > maxLength) {
                        return stringCut(s, maxLength);
                    }
                    n = new int10_1.Int10();
                    bits = 0;
                }
            }
            if (bits > 0) {
                s += ".incomplete";
            }
            return s;
        };
        return Stream;
    }());
    exports.Stream = Stream;
    var ASN1 = (function () {
        function ASN1(stream, header, length, tag, sub) {
            if (!(tag instanceof ASN1Tag)) {
                throw new Error("Invalid tag value.");
            }
            this.stream = stream;
            this.header = header;
            this.length = length;
            this.tag = tag;
            this.sub = sub;
        }
        ASN1.prototype.typeName = function () {
            switch (this.tag.tagClass) {
                case 0:
                    switch (this.tag.tagNumber) {
                        case 0x00:
                            return "EOC";
                        case 0x01:
                            return "BOOLEAN";
                        case 0x02:
                            return "INTEGER";
                        case 0x03:
                            return "BIT_STRING";
                        case 0x04:
                            return "OCTET_STRING";
                        case 0x05:
                            return "NULL";
                        case 0x06:
                            return "OBJECT_IDENTIFIER";
                        case 0x07:
                            return "ObjectDescriptor";
                        case 0x08:
                            return "EXTERNAL";
                        case 0x09:
                            return "REAL";
                        case 0x0A:
                            return "ENUMERATED";
                        case 0x0B:
                            return "EMBEDDED_PDV";
                        case 0x0C:
                            return "UTF8String";
                        case 0x10:
                            return "SEQUENCE";
                        case 0x11:
                            return "SET";
                        case 0x12:
                            return "NumericString";
                        case 0x13:
                            return "PrintableString";
                        case 0x14:
                            return "TeletexString";
                        case 0x15:
                            return "VideotexString";
                        case 0x16:
                            return "IA5String";
                        case 0x17:
                            return "UTCTime";
                        case 0x18:
                            return "GeneralizedTime";
                        case 0x19:
                            return "GraphicString";
                        case 0x1A:
                            return "VisibleString";
                        case 0x1B:
                            return "GeneralString";
                        case 0x1C:
                            return "UniversalString";
                        case 0x1E:
                            return "BMPString";
                    }
                    return "Universal_" + this.tag.tagNumber.toString();
                case 1:
                    return "Application_" + this.tag.tagNumber.toString();
                case 2:
                    return "[" + this.tag.tagNumber.toString() + "]";
                case 3:
                    return "Private_" + this.tag.tagNumber.toString();
            }
            return null;
        };
        ASN1.prototype.content = function (maxLength) {
            if (this.tag === undefined) {
                return null;
            }
            if (maxLength === undefined) {
                maxLength = Infinity;
            }
            var content = this.posContent();
            var len = Math.abs(this.length);
            if (!this.tag.isUniversal()) {
                if (this.sub !== null) {
                    return "(" + this.sub.length + " elem)";
                }
                return this.stream.parseOctetString(content, content + len, maxLength);
            }
            switch (this.tag.tagNumber) {
                case 0x01:
                    return (this.stream.get(content) === 0) ? "false" : "true";
                case 0x02:
                    return this.stream.parseInteger(content, content + len);
                case 0x03:
                    return this.sub ? "(" + this.sub.length + " elem)" :
                        this.stream.parseBitString(content, content + len, maxLength);
                case 0x04:
                    return this.sub ? "(" + this.sub.length + " elem)" :
                        this.stream.parseOctetString(content, content + len, maxLength);
                case 0x06:
                    return this.stream.parseOID(content, content + len, maxLength);
                case 0x10:
                case 0x11:
                    if (this.sub !== null) {
                        return "(" + this.sub.length + " elem)";
                    }
                    else {
                        return "(no elem)";
                    }
                case 0x0C:
                    return stringCut(this.stream.parseStringUTF(content, content + len), maxLength);
                case 0x12:
                case 0x13:
                case 0x14:
                case 0x15:
                case 0x16:
                case 0x1A:
                    return stringCut(this.stream.parseStringISO(content, content + len), maxLength);
                case 0x1E:
                    return stringCut(this.stream.parseStringBMP(content, content + len), maxLength);
                case 0x17:
                case 0x18:
                    return this.stream.parseTime(content, content + len, (this.tag.tagNumber == 0x17));
            }
            return null;
        };
        ASN1.prototype.toString = function () {
            return this.typeName() + "@" + this.stream.pos + "[header:" + this.header + ",length:" + this.length + ",sub:" + ((this.sub === null) ? "null" : this.sub.length) + "]";
        };
        ASN1.prototype.toPrettyString = function (indent) {
            if (indent === undefined) {
                indent = "";
            }
            var s = indent + this.typeName() + " @" + this.stream.pos;
            if (this.length >= 0) {
                s += "+";
            }
            s += this.length;
            if (this.tag.tagConstructed) {
                s += " (constructed)";
            }
            else if ((this.tag.isUniversal() && ((this.tag.tagNumber == 0x03) || (this.tag.tagNumber == 0x04))) && (this.sub !== null)) {
                s += " (encapsulates)";
            }
            s += "\n";
            if (this.sub !== null) {
                indent += "  ";
                for (var i = 0, max = this.sub.length; i < max; ++i) {
                    s += this.sub[i].toPrettyString(indent);
                }
            }
            return s;
        };
        ASN1.prototype.posStart = function () {
            return this.stream.pos;
        };
        ASN1.prototype.posContent = function () {
            return this.stream.pos + this.header;
        };
        ASN1.prototype.posEnd = function () {
            return this.stream.pos + this.header + Math.abs(this.length);
        };
        ASN1.prototype.toHexString = function () {
            return this.stream.hexDump(this.posStart(), this.posEnd(), true);
        };
        ASN1.decodeLength = function (stream) {
            var buf = stream.get();
            var len = buf & 0x7F;
            if (len == buf) {
                return len;
            }
            if (len > 6) {
                throw new Error("Length over 48 bits not supported at position " + (stream.pos - 1));
            }
            if (len === 0) {
                return null;
            }
            buf = 0;
            for (var i = 0; i < len; ++i) {
                buf = (buf * 256) + stream.get();
            }
            return buf;
        };
        ASN1.prototype.getHexStringValue = function () {
            var hexString = this.toHexString();
            var offset = this.header * 2;
            var length = this.length * 2;
            return hexString.substr(offset, length);
        };
        ASN1.decode = function (str) {
            var stream;
            if (!(str instanceof Stream)) {
                stream = new Stream(str, 0);
            }
            else {
                stream = str;
            }
            var streamStart = new Stream(stream);
            var tag = new ASN1Tag(stream);
            var len = ASN1.decodeLength(stream);
            var start = stream.pos;
            var header = start - streamStart.pos;
            var sub = null;
            var getSub = function () {
                var ret = [];
                if (len !== null) {
                    var end = start + len;
                    while (stream.pos < end) {
                        ret[ret.length] = ASN1.decode(stream);
                    }
                    if (stream.pos != end) {
                        throw new Error("Content size is not correct for container starting at offset " + start);
                    }
                }
                else {
                    try {
                        for (;;) {
                            var s = ASN1.decode(stream);
                            if (s.tag.isEOC()) {
                                break;
                            }
                            ret[ret.length] = s;
                        }
                        len = start - stream.pos;
                    }
                    catch (e) {
                        throw new Error("Exception while decoding undefined length content: " + e);
                    }
                }
                return ret;
            };
            if (tag.tagConstructed) {
                sub = getSub();
            }
            else if (tag.isUniversal() && ((tag.tagNumber == 0x03) || (tag.tagNumber == 0x04))) {
                try {
                    if (tag.tagNumber == 0x03) {
                        if (stream.get() != 0) {
                            throw new Error("BIT STRINGs with unused bits cannot encapsulate.");
                        }
                    }
                    sub = getSub();
                    for (var i = 0; i < sub.length; ++i) {
                        if (sub[i].tag.isEOC()) {
                            throw new Error("EOC is not supposed to be actual content.");
                        }
                    }
                }
                catch (e) {
                    sub = null;
                }
            }
            if (sub === null) {
                if (len === null) {
                    throw new Error("We can't skip over an invalid tag with undefined length at offset " + start);
                }
                stream.pos = start + Math.abs(len);
            }
            return new ASN1(streamStart, header, len, tag, sub);
        };
        return ASN1;
    }());
    exports.ASN1 = ASN1;
    var ASN1Tag = (function () {
        function ASN1Tag(stream) {
            var buf = stream.get();
            this.tagClass = buf >> 6;
            this.tagConstructed = ((buf & 0x20) !== 0);
            this.tagNumber = buf & 0x1F;
            if (this.tagNumber == 0x1F) {
                var n = new int10_1.Int10();
                do {
                    buf = stream.get();
                    n.mulAdd(128, buf & 0x7F);
                } while (buf & 0x80);
                this.tagNumber = n.simplify();
            }
        }
        ASN1Tag.prototype.isUniversal = function () {
            return this.tagClass === 0x00;
        };
        ASN1Tag.prototype.isEOC = function () {
            return this.tagClass === 0x00 && this.tagNumber === 0x00;
        };
        return ASN1Tag;
    }());
    exports.ASN1Tag = ASN1Tag;
});
define("Lib/jsbn/prng4", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Arcfour = (function () {
        function Arcfour() {
            this.i = 0;
            this.j = 0;
            this.S = [];
        }
        Arcfour.prototype.init = function (key) {
            var i;
            var j;
            var t;
            for (i = 0; i < 256; ++i) {
                this.S[i] = i;
            }
            j = 0;
            for (i = 0; i < 256; ++i) {
                j = (j + this.S[i] + key[i % key.length]) & 255;
                t = this.S[i];
                this.S[i] = this.S[j];
                this.S[j] = t;
            }
            this.i = 0;
            this.j = 0;
        };
        Arcfour.prototype.next = function () {
            var t;
            this.i = (this.i + 1) & 255;
            this.j = (this.j + this.S[this.i]) & 255;
            t = this.S[this.i];
            this.S[this.i] = this.S[this.j];
            this.S[this.j] = t;
            return this.S[(t + this.S[this.i]) & 255];
        };
        return Arcfour;
    }());
    exports.Arcfour = Arcfour;
    function prng_newstate() {
        return new Arcfour();
    }
    exports.prng_newstate = prng_newstate;
    exports.rng_psize = 256;
});
define("Lib/jsbn/rng", ["require", "exports", "Lib/jsbn/prng4"], function (require, exports, prng4_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var rng_state;
    var rng_pool = null;
    var rng_pptr;
    if (rng_pool == null) {
        rng_pool = [];
        rng_pptr = 0;
        var t = void 0;
        if (window.crypto && window.crypto.getRandomValues) {
            var z = new Uint32Array(256);
            window.crypto.getRandomValues(z);
            for (t = 0; t < z.length; ++t) {
                rng_pool[rng_pptr++] = z[t] & 255;
            }
        }
        var onMouseMoveListener_1 = function (ev) {
            this.count = this.count || 0;
            if (this.count >= 256 || rng_pptr >= prng4_1.rng_psize) {
                if (window.removeEventListener) {
                    window.removeEventListener("mousemove", onMouseMoveListener_1, false);
                }
                else if (window.detachEvent) {
                    window.detachEvent("onmousemove", onMouseMoveListener_1);
                }
                return;
            }
            try {
                var mouseCoordinates = ev.x + ev.y;
                rng_pool[rng_pptr++] = mouseCoordinates & 255;
                this.count += 1;
            }
            catch (e) {
            }
        };
        if (window.addEventListener) {
            window.addEventListener("mousemove", onMouseMoveListener_1, false);
        }
        else if (window.attachEvent) {
            window.attachEvent("onmousemove", onMouseMoveListener_1);
        }
    }
    function rng_get_byte() {
        if (rng_state == null) {
            rng_state = prng4_1.prng_newstate();
            while (rng_pptr < prng4_1.rng_psize) {
                var random = Math.floor(65536 * Math.random());
                rng_pool[rng_pptr++] = random & 255;
            }
            rng_state.init(rng_pool);
            for (rng_pptr = 0; rng_pptr < rng_pool.length; ++rng_pptr) {
                rng_pool[rng_pptr] = 0;
            }
            rng_pptr = 0;
        }
        return rng_state.next();
    }
    var SecureRandom = (function () {
        function SecureRandom() {
        }
        SecureRandom.prototype.nextBytes = function (ba) {
            for (var i = 0; i < ba.length; ++i) {
                ba[i] = rng_get_byte();
            }
        };
        return SecureRandom;
    }());
    exports.SecureRandom = SecureRandom;
});
define("Lib/jsbn/jsbn", ["require", "exports", "Lib/jsbn/util"], function (require, exports, util_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dbits;
    var canary = 0xdeadbeefcafe;
    var j_lm = ((canary & 0xffffff) == 0xefcafe);
    var lowprimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997];
    var lplim = (1 << 26) / lowprimes[lowprimes.length - 1];
    var BigInteger = (function () {
        function BigInteger(a, b, c) {
            if (a != null) {
                if ("number" == typeof a) {
                    this.fromNumber(a, b, c);
                }
                else if (b == null && "string" != typeof a) {
                    this.fromString(a, 256);
                }
                else {
                    this.fromString(a, b);
                }
            }
        }
        BigInteger.prototype.toString = function (b) {
            if (this.s < 0) {
                return "-" + this.negate().toString(b);
            }
            var k;
            if (b == 16) {
                k = 4;
            }
            else if (b == 8) {
                k = 3;
            }
            else if (b == 2) {
                k = 1;
            }
            else if (b == 32) {
                k = 5;
            }
            else if (b == 4) {
                k = 2;
            }
            else {
                return this.toRadix(b);
            }
            var km = (1 << k) - 1;
            var d;
            var m = false;
            var r = "";
            var i = this.t;
            var p = this.DB - (i * this.DB) % k;
            if (i-- > 0) {
                if (p < this.DB && (d = this[i] >> p) > 0) {
                    m = true;
                    r = util_2.int2char(d);
                }
                while (i >= 0) {
                    if (p < k) {
                        d = (this[i] & ((1 << p) - 1)) << (k - p);
                        d |= this[--i] >> (p += this.DB - k);
                    }
                    else {
                        d = (this[i] >> (p -= k)) & km;
                        if (p <= 0) {
                            p += this.DB;
                            --i;
                        }
                    }
                    if (d > 0) {
                        m = true;
                    }
                    if (m) {
                        r += util_2.int2char(d);
                    }
                }
            }
            return m ? r : "0";
        };
        BigInteger.prototype.negate = function () {
            var r = nbi();
            BigInteger.ZERO.subTo(this, r);
            return r;
        };
        BigInteger.prototype.abs = function () {
            return (this.s < 0) ? this.negate() : this;
        };
        BigInteger.prototype.compareTo = function (a) {
            var r = this.s - a.s;
            if (r != 0) {
                return r;
            }
            var i = this.t;
            r = i - a.t;
            if (r != 0) {
                return (this.s < 0) ? -r : r;
            }
            while (--i >= 0) {
                if ((r = this[i] - a[i]) != 0) {
                    return r;
                }
            }
            return 0;
        };
        BigInteger.prototype.bitLength = function () {
            if (this.t <= 0) {
                return 0;
            }
            return this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ (this.s & this.DM));
        };
        BigInteger.prototype.mod = function (a) {
            var r = nbi();
            this.abs().divRemTo(a, null, r);
            if (this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) {
                a.subTo(r, r);
            }
            return r;
        };
        BigInteger.prototype.modPowInt = function (e, m) {
            var z;
            if (e < 256 || m.isEven()) {
                z = new Classic(m);
            }
            else {
                z = new Montgomery(m);
            }
            return this.exp(e, z);
        };
        BigInteger.prototype.clone = function () {
            var r = nbi();
            this.copyTo(r);
            return r;
        };
        BigInteger.prototype.intValue = function () {
            if (this.s < 0) {
                if (this.t == 1) {
                    return this[0] - this.DV;
                }
                else if (this.t == 0) {
                    return -1;
                }
            }
            else if (this.t == 1) {
                return this[0];
            }
            else if (this.t == 0) {
                return 0;
            }
            return ((this[1] & ((1 << (32 - this.DB)) - 1)) << this.DB) | this[0];
        };
        BigInteger.prototype.byteValue = function () {
            return (this.t == 0) ? this.s : (this[0] << 24) >> 24;
        };
        BigInteger.prototype.shortValue = function () {
            return (this.t == 0) ? this.s : (this[0] << 16) >> 16;
        };
        BigInteger.prototype.signum = function () {
            if (this.s < 0) {
                return -1;
            }
            else if (this.t <= 0 || (this.t == 1 && this[0] <= 0)) {
                return 0;
            }
            else {
                return 1;
            }
        };
        BigInteger.prototype.toByteArray = function () {
            var i = this.t;
            var r = [];
            r[0] = this.s;
            var p = this.DB - (i * this.DB) % 8;
            var d;
            var k = 0;
            if (i-- > 0) {
                if (p < this.DB && (d = this[i] >> p) != (this.s & this.DM) >> p) {
                    r[k++] = d | (this.s << (this.DB - p));
                }
                while (i >= 0) {
                    if (p < 8) {
                        d = (this[i] & ((1 << p) - 1)) << (8 - p);
                        d |= this[--i] >> (p += this.DB - 8);
                    }
                    else {
                        d = (this[i] >> (p -= 8)) & 0xff;
                        if (p <= 0) {
                            p += this.DB;
                            --i;
                        }
                    }
                    if ((d & 0x80) != 0) {
                        d |= -256;
                    }
                    if (k == 0 && (this.s & 0x80) != (d & 0x80)) {
                        ++k;
                    }
                    if (k > 0 || d != this.s) {
                        r[k++] = d;
                    }
                }
            }
            return r;
        };
        BigInteger.prototype.equals = function (a) {
            return (this.compareTo(a) == 0);
        };
        BigInteger.prototype.min = function (a) {
            return (this.compareTo(a) < 0) ? this : a;
        };
        BigInteger.prototype.max = function (a) {
            return (this.compareTo(a) > 0) ? this : a;
        };
        BigInteger.prototype.and = function (a) {
            var r = nbi();
            this.bitwiseTo(a, util_2.op_and, r);
            return r;
        };
        BigInteger.prototype.or = function (a) {
            var r = nbi();
            this.bitwiseTo(a, util_2.op_or, r);
            return r;
        };
        BigInteger.prototype.xor = function (a) {
            var r = nbi();
            this.bitwiseTo(a, util_2.op_xor, r);
            return r;
        };
        BigInteger.prototype.andNot = function (a) {
            var r = nbi();
            this.bitwiseTo(a, util_2.op_andnot, r);
            return r;
        };
        BigInteger.prototype.not = function () {
            var r = nbi();
            for (var i = 0; i < this.t; ++i) {
                r[i] = this.DM & ~this[i];
            }
            r.t = this.t;
            r.s = ~this.s;
            return r;
        };
        BigInteger.prototype.shiftLeft = function (n) {
            var r = nbi();
            if (n < 0) {
                this.rShiftTo(-n, r);
            }
            else {
                this.lShiftTo(n, r);
            }
            return r;
        };
        BigInteger.prototype.shiftRight = function (n) {
            var r = nbi();
            if (n < 0) {
                this.lShiftTo(-n, r);
            }
            else {
                this.rShiftTo(n, r);
            }
            return r;
        };
        BigInteger.prototype.getLowestSetBit = function () {
            for (var i = 0; i < this.t; ++i) {
                if (this[i] != 0) {
                    return i * this.DB + util_2.lbit(this[i]);
                }
            }
            if (this.s < 0) {
                return this.t * this.DB;
            }
            return -1;
        };
        BigInteger.prototype.bitCount = function () {
            var r = 0;
            var x = this.s & this.DM;
            for (var i = 0; i < this.t; ++i) {
                r += util_2.cbit(this[i] ^ x);
            }
            return r;
        };
        BigInteger.prototype.testBit = function (n) {
            var j = Math.floor(n / this.DB);
            if (j >= this.t) {
                return (this.s != 0);
            }
            return ((this[j] & (1 << (n % this.DB))) != 0);
        };
        BigInteger.prototype.setBit = function (n) {
            return this.changeBit(n, util_2.op_or);
        };
        BigInteger.prototype.clearBit = function (n) {
            return this.changeBit(n, util_2.op_andnot);
        };
        BigInteger.prototype.flipBit = function (n) {
            return this.changeBit(n, util_2.op_xor);
        };
        BigInteger.prototype.add = function (a) {
            var r = nbi();
            this.addTo(a, r);
            return r;
        };
        BigInteger.prototype.subtract = function (a) {
            var r = nbi();
            this.subTo(a, r);
            return r;
        };
        BigInteger.prototype.multiply = function (a) {
            var r = nbi();
            this.multiplyTo(a, r);
            return r;
        };
        BigInteger.prototype.divide = function (a) {
            var r = nbi();
            this.divRemTo(a, r, null);
            return r;
        };
        BigInteger.prototype.remainder = function (a) {
            var r = nbi();
            this.divRemTo(a, null, r);
            return r;
        };
        BigInteger.prototype.divideAndRemainder = function (a) {
            var q = nbi();
            var r = nbi();
            this.divRemTo(a, q, r);
            return [q, r];
        };
        BigInteger.prototype.modPow = function (e, m) {
            var i = e.bitLength();
            var k;
            var r = nbv(1);
            var z;
            if (i <= 0) {
                return r;
            }
            else if (i < 18) {
                k = 1;
            }
            else if (i < 48) {
                k = 3;
            }
            else if (i < 144) {
                k = 4;
            }
            else if (i < 768) {
                k = 5;
            }
            else {
                k = 6;
            }
            if (i < 8) {
                z = new Classic(m);
            }
            else if (m.isEven()) {
                z = new Barrett(m);
            }
            else {
                z = new Montgomery(m);
            }
            var g = [];
            var n = 3;
            var k1 = k - 1;
            var km = (1 << k) - 1;
            g[1] = z.convert(this);
            if (k > 1) {
                var g2 = nbi();
                z.sqrTo(g[1], g2);
                while (n <= km) {
                    g[n] = nbi();
                    z.mulTo(g2, g[n - 2], g[n]);
                    n += 2;
                }
            }
            var j = e.t - 1;
            var w;
            var is1 = true;
            var r2 = nbi();
            var t;
            i = nbits(e[j]) - 1;
            while (j >= 0) {
                if (i >= k1) {
                    w = (e[j] >> (i - k1)) & km;
                }
                else {
                    w = (e[j] & ((1 << (i + 1)) - 1)) << (k1 - i);
                    if (j > 0) {
                        w |= e[j - 1] >> (this.DB + i - k1);
                    }
                }
                n = k;
                while ((w & 1) == 0) {
                    w >>= 1;
                    --n;
                }
                if ((i -= n) < 0) {
                    i += this.DB;
                    --j;
                }
                if (is1) {
                    g[w].copyTo(r);
                    is1 = false;
                }
                else {
                    while (n > 1) {
                        z.sqrTo(r, r2);
                        z.sqrTo(r2, r);
                        n -= 2;
                    }
                    if (n > 0) {
                        z.sqrTo(r, r2);
                    }
                    else {
                        t = r;
                        r = r2;
                        r2 = t;
                    }
                    z.mulTo(r2, g[w], r);
                }
                while (j >= 0 && (e[j] & (1 << i)) == 0) {
                    z.sqrTo(r, r2);
                    t = r;
                    r = r2;
                    r2 = t;
                    if (--i < 0) {
                        i = this.DB - 1;
                        --j;
                    }
                }
            }
            return z.revert(r);
        };
        BigInteger.prototype.modInverse = function (m) {
            var ac = m.isEven();
            if ((this.isEven() && ac) || m.signum() == 0) {
                return BigInteger.ZERO;
            }
            var u = m.clone();
            var v = this.clone();
            var a = nbv(1);
            var b = nbv(0);
            var c = nbv(0);
            var d = nbv(1);
            while (u.signum() != 0) {
                while (u.isEven()) {
                    u.rShiftTo(1, u);
                    if (ac) {
                        if (!a.isEven() || !b.isEven()) {
                            a.addTo(this, a);
                            b.subTo(m, b);
                        }
                        a.rShiftTo(1, a);
                    }
                    else if (!b.isEven()) {
                        b.subTo(m, b);
                    }
                    b.rShiftTo(1, b);
                }
                while (v.isEven()) {
                    v.rShiftTo(1, v);
                    if (ac) {
                        if (!c.isEven() || !d.isEven()) {
                            c.addTo(this, c);
                            d.subTo(m, d);
                        }
                        c.rShiftTo(1, c);
                    }
                    else if (!d.isEven()) {
                        d.subTo(m, d);
                    }
                    d.rShiftTo(1, d);
                }
                if (u.compareTo(v) >= 0) {
                    u.subTo(v, u);
                    if (ac) {
                        a.subTo(c, a);
                    }
                    b.subTo(d, b);
                }
                else {
                    v.subTo(u, v);
                    if (ac) {
                        c.subTo(a, c);
                    }
                    d.subTo(b, d);
                }
            }
            if (v.compareTo(BigInteger.ONE) != 0) {
                return BigInteger.ZERO;
            }
            if (d.compareTo(m) >= 0) {
                return d.subtract(m);
            }
            if (d.signum() < 0) {
                d.addTo(m, d);
            }
            else {
                return d;
            }
            if (d.signum() < 0) {
                return d.add(m);
            }
            else {
                return d;
            }
        };
        BigInteger.prototype.pow = function (e) {
            return this.exp(e, new NullExp());
        };
        BigInteger.prototype.gcd = function (a) {
            var x = (this.s < 0) ? this.negate() : this.clone();
            var y = (a.s < 0) ? a.negate() : a.clone();
            if (x.compareTo(y) < 0) {
                var t = x;
                x = y;
                y = t;
            }
            var i = x.getLowestSetBit();
            var g = y.getLowestSetBit();
            if (g < 0) {
                return x;
            }
            if (i < g) {
                g = i;
            }
            if (g > 0) {
                x.rShiftTo(g, x);
                y.rShiftTo(g, y);
            }
            while (x.signum() > 0) {
                if ((i = x.getLowestSetBit()) > 0) {
                    x.rShiftTo(i, x);
                }
                if ((i = y.getLowestSetBit()) > 0) {
                    y.rShiftTo(i, y);
                }
                if (x.compareTo(y) >= 0) {
                    x.subTo(y, x);
                    x.rShiftTo(1, x);
                }
                else {
                    y.subTo(x, y);
                    y.rShiftTo(1, y);
                }
            }
            if (g > 0) {
                y.lShiftTo(g, y);
            }
            return y;
        };
        BigInteger.prototype.isProbablePrime = function (t) {
            var i;
            var x = this.abs();
            if (x.t == 1 && x[0] <= lowprimes[lowprimes.length - 1]) {
                for (i = 0; i < lowprimes.length; ++i) {
                    if (x[0] == lowprimes[i]) {
                        return true;
                    }
                }
                return false;
            }
            if (x.isEven()) {
                return false;
            }
            i = 1;
            while (i < lowprimes.length) {
                var m = lowprimes[i];
                var j = i + 1;
                while (j < lowprimes.length && m < lplim) {
                    m *= lowprimes[j++];
                }
                m = x.modInt(m);
                while (i < j) {
                    if (m % lowprimes[i++] == 0) {
                        return false;
                    }
                }
            }
            return x.millerRabin(t);
        };
        BigInteger.prototype.copyTo = function (r) {
            for (var i = this.t - 1; i >= 0; --i) {
                r[i] = this[i];
            }
            r.t = this.t;
            r.s = this.s;
        };
        BigInteger.prototype.fromInt = function (x) {
            this.t = 1;
            this.s = (x < 0) ? -1 : 0;
            if (x > 0) {
                this[0] = x;
            }
            else if (x < -1) {
                this[0] = x + this.DV;
            }
            else {
                this.t = 0;
            }
        };
        BigInteger.prototype.fromString = function (s, b) {
            var k;
            if (b == 16) {
                k = 4;
            }
            else if (b == 8) {
                k = 3;
            }
            else if (b == 256) {
                k = 8;
            }
            else if (b == 2) {
                k = 1;
            }
            else if (b == 32) {
                k = 5;
            }
            else if (b == 4) {
                k = 2;
            }
            else {
                this.fromRadix(s, b);
                return;
            }
            this.t = 0;
            this.s = 0;
            var i = s.length;
            var mi = false;
            var sh = 0;
            while (--i >= 0) {
                var x = (k == 8) ? (+s[i]) & 0xff : intAt(s, i);
                if (x < 0) {
                    if (s.charAt(i) == "-") {
                        mi = true;
                    }
                    continue;
                }
                mi = false;
                if (sh == 0) {
                    this[this.t++] = x;
                }
                else if (sh + k > this.DB) {
                    this[this.t - 1] |= (x & ((1 << (this.DB - sh)) - 1)) << sh;
                    this[this.t++] = (x >> (this.DB - sh));
                }
                else {
                    this[this.t - 1] |= x << sh;
                }
                sh += k;
                if (sh >= this.DB) {
                    sh -= this.DB;
                }
            }
            if (k == 8 && ((+s[0]) & 0x80) != 0) {
                this.s = -1;
                if (sh > 0) {
                    this[this.t - 1] |= ((1 << (this.DB - sh)) - 1) << sh;
                }
            }
            this.clamp();
            if (mi) {
                BigInteger.ZERO.subTo(this, this);
            }
        };
        BigInteger.prototype.clamp = function () {
            var c = this.s & this.DM;
            while (this.t > 0 && this[this.t - 1] == c) {
                --this.t;
            }
        };
        BigInteger.prototype.dlShiftTo = function (n, r) {
            var i;
            for (i = this.t - 1; i >= 0; --i) {
                r[i + n] = this[i];
            }
            for (i = n - 1; i >= 0; --i) {
                r[i] = 0;
            }
            r.t = this.t + n;
            r.s = this.s;
        };
        BigInteger.prototype.drShiftTo = function (n, r) {
            for (var i = n; i < this.t; ++i) {
                r[i - n] = this[i];
            }
            r.t = Math.max(this.t - n, 0);
            r.s = this.s;
        };
        BigInteger.prototype.lShiftTo = function (n, r) {
            var bs = n % this.DB;
            var cbs = this.DB - bs;
            var bm = (1 << cbs) - 1;
            var ds = Math.floor(n / this.DB);
            var c = (this.s << bs) & this.DM;
            for (var i = this.t - 1; i >= 0; --i) {
                r[i + ds + 1] = (this[i] >> cbs) | c;
                c = (this[i] & bm) << bs;
            }
            for (var i = ds - 1; i >= 0; --i) {
                r[i] = 0;
            }
            r[ds] = c;
            r.t = this.t + ds + 1;
            r.s = this.s;
            r.clamp();
        };
        BigInteger.prototype.rShiftTo = function (n, r) {
            r.s = this.s;
            var ds = Math.floor(n / this.DB);
            if (ds >= this.t) {
                r.t = 0;
                return;
            }
            var bs = n % this.DB;
            var cbs = this.DB - bs;
            var bm = (1 << bs) - 1;
            r[0] = this[ds] >> bs;
            for (var i = ds + 1; i < this.t; ++i) {
                r[i - ds - 1] |= (this[i] & bm) << cbs;
                r[i - ds] = this[i] >> bs;
            }
            if (bs > 0) {
                r[this.t - ds - 1] |= (this.s & bm) << cbs;
            }
            r.t = this.t - ds;
            r.clamp();
        };
        BigInteger.prototype.subTo = function (a, r) {
            var i = 0;
            var c = 0;
            var m = Math.min(a.t, this.t);
            while (i < m) {
                c += this[i] - a[i];
                r[i++] = c & this.DM;
                c >>= this.DB;
            }
            if (a.t < this.t) {
                c -= a.s;
                while (i < this.t) {
                    c += this[i];
                    r[i++] = c & this.DM;
                    c >>= this.DB;
                }
                c += this.s;
            }
            else {
                c += this.s;
                while (i < a.t) {
                    c -= a[i];
                    r[i++] = c & this.DM;
                    c >>= this.DB;
                }
                c -= a.s;
            }
            r.s = (c < 0) ? -1 : 0;
            if (c < -1) {
                r[i++] = this.DV + c;
            }
            else if (c > 0) {
                r[i++] = c;
            }
            r.t = i;
            r.clamp();
        };
        BigInteger.prototype.multiplyTo = function (a, r) {
            var x = this.abs();
            var y = a.abs();
            var i = x.t;
            r.t = i + y.t;
            while (--i >= 0) {
                r[i] = 0;
            }
            for (i = 0; i < y.t; ++i) {
                r[i + x.t] = x.am(0, y[i], r, i, 0, x.t);
            }
            r.s = 0;
            r.clamp();
            if (this.s != a.s) {
                BigInteger.ZERO.subTo(r, r);
            }
        };
        BigInteger.prototype.squareTo = function (r) {
            var x = this.abs();
            var i = r.t = 2 * x.t;
            while (--i >= 0) {
                r[i] = 0;
            }
            for (i = 0; i < x.t - 1; ++i) {
                var c = x.am(i, x[i], r, 2 * i, 0, 1);
                if ((r[i + x.t] += x.am(i + 1, 2 * x[i], r, 2 * i + 1, c, x.t - i - 1)) >= x.DV) {
                    r[i + x.t] -= x.DV;
                    r[i + x.t + 1] = 1;
                }
            }
            if (r.t > 0) {
                r[r.t - 1] += x.am(i, x[i], r, 2 * i, 0, 1);
            }
            r.s = 0;
            r.clamp();
        };
        BigInteger.prototype.divRemTo = function (m, q, r) {
            var pm = m.abs();
            if (pm.t <= 0) {
                return;
            }
            var pt = this.abs();
            if (pt.t < pm.t) {
                if (q != null) {
                    q.fromInt(0);
                }
                if (r != null) {
                    this.copyTo(r);
                }
                return;
            }
            if (r == null) {
                r = nbi();
            }
            var y = nbi();
            var ts = this.s;
            var ms = m.s;
            var nsh = this.DB - nbits(pm[pm.t - 1]);
            if (nsh > 0) {
                pm.lShiftTo(nsh, y);
                pt.lShiftTo(nsh, r);
            }
            else {
                pm.copyTo(y);
                pt.copyTo(r);
            }
            var ys = y.t;
            var y0 = y[ys - 1];
            if (y0 == 0) {
                return;
            }
            var yt = y0 * (1 << this.F1) + ((ys > 1) ? y[ys - 2] >> this.F2 : 0);
            var d1 = this.FV / yt;
            var d2 = (1 << this.F1) / yt;
            var e = 1 << this.F2;
            var i = r.t;
            var j = i - ys;
            var t = (q == null) ? nbi() : q;
            y.dlShiftTo(j, t);
            if (r.compareTo(t) >= 0) {
                r[r.t++] = 1;
                r.subTo(t, r);
            }
            BigInteger.ONE.dlShiftTo(ys, t);
            t.subTo(y, y);
            while (y.t < ys) {
                y[y.t++] = 0;
            }
            while (--j >= 0) {
                var qd = (r[--i] == y0) ? this.DM : Math.floor(r[i] * d1 + (r[i - 1] + e) * d2);
                if ((r[i] += y.am(0, qd, r, j, 0, ys)) < qd) {
                    y.dlShiftTo(j, t);
                    r.subTo(t, r);
                    while (r[i] < --qd) {
                        r.subTo(t, r);
                    }
                }
            }
            if (q != null) {
                r.drShiftTo(ys, q);
                if (ts != ms) {
                    BigInteger.ZERO.subTo(q, q);
                }
            }
            r.t = ys;
            r.clamp();
            if (nsh > 0) {
                r.rShiftTo(nsh, r);
            }
            if (ts < 0) {
                BigInteger.ZERO.subTo(r, r);
            }
        };
        BigInteger.prototype.invDigit = function () {
            if (this.t < 1) {
                return 0;
            }
            var x = this[0];
            if ((x & 1) == 0) {
                return 0;
            }
            var y = x & 3;
            y = (y * (2 - (x & 0xf) * y)) & 0xf;
            y = (y * (2 - (x & 0xff) * y)) & 0xff;
            y = (y * (2 - (((x & 0xffff) * y) & 0xffff))) & 0xffff;
            y = (y * (2 - x * y % this.DV)) % this.DV;
            return (y > 0) ? this.DV - y : -y;
        };
        BigInteger.prototype.isEven = function () {
            return ((this.t > 0) ? (this[0] & 1) : this.s) == 0;
        };
        BigInteger.prototype.exp = function (e, z) {
            if (e > 0xffffffff || e < 1) {
                return BigInteger.ONE;
            }
            var r = nbi();
            var r2 = nbi();
            var g = z.convert(this);
            var i = nbits(e) - 1;
            g.copyTo(r);
            while (--i >= 0) {
                z.sqrTo(r, r2);
                if ((e & (1 << i)) > 0) {
                    z.mulTo(r2, g, r);
                }
                else {
                    var t = r;
                    r = r2;
                    r2 = t;
                }
            }
            return z.revert(r);
        };
        BigInteger.prototype.chunkSize = function (r) {
            return Math.floor(Math.LN2 * this.DB / Math.log(r));
        };
        BigInteger.prototype.toRadix = function (b) {
            if (b == null) {
                b = 10;
            }
            if (this.signum() == 0 || b < 2 || b > 36) {
                return "0";
            }
            var cs = this.chunkSize(b);
            var a = Math.pow(b, cs);
            var d = nbv(a);
            var y = nbi();
            var z = nbi();
            var r = "";
            this.divRemTo(d, y, z);
            while (y.signum() > 0) {
                r = (a + z.intValue()).toString(b).substr(1) + r;
                y.divRemTo(d, y, z);
            }
            return z.intValue().toString(b) + r;
        };
        BigInteger.prototype.fromRadix = function (s, b) {
            this.fromInt(0);
            if (b == null) {
                b = 10;
            }
            var cs = this.chunkSize(b);
            var d = Math.pow(b, cs);
            var mi = false;
            var j = 0;
            var w = 0;
            for (var i = 0; i < s.length; ++i) {
                var x = intAt(s, i);
                if (x < 0) {
                    if (s.charAt(i) == "-" && this.signum() == 0) {
                        mi = true;
                    }
                    continue;
                }
                w = b * w + x;
                if (++j >= cs) {
                    this.dMultiply(d);
                    this.dAddOffset(w, 0);
                    j = 0;
                    w = 0;
                }
            }
            if (j > 0) {
                this.dMultiply(Math.pow(b, j));
                this.dAddOffset(w, 0);
            }
            if (mi) {
                BigInteger.ZERO.subTo(this, this);
            }
        };
        BigInteger.prototype.fromNumber = function (a, b, c) {
            if ("number" == typeof b) {
                if (a < 2) {
                    this.fromInt(1);
                }
                else {
                    this.fromNumber(a, c);
                    if (!this.testBit(a - 1)) {
                        this.bitwiseTo(BigInteger.ONE.shiftLeft(a - 1), util_2.op_or, this);
                    }
                    if (this.isEven()) {
                        this.dAddOffset(1, 0);
                    }
                    while (!this.isProbablePrime(b)) {
                        this.dAddOffset(2, 0);
                        if (this.bitLength() > a) {
                            this.subTo(BigInteger.ONE.shiftLeft(a - 1), this);
                        }
                    }
                }
            }
            else {
                var x = [];
                var t = a & 7;
                x.length = (a >> 3) + 1;
                b.nextBytes(x);
                if (t > 0) {
                    x[0] &= ((1 << t) - 1);
                }
                else {
                    x[0] = 0;
                }
                this.fromString(x, 256);
            }
        };
        BigInteger.prototype.bitwiseTo = function (a, op, r) {
            var i;
            var f;
            var m = Math.min(a.t, this.t);
            for (i = 0; i < m; ++i) {
                r[i] = op(this[i], a[i]);
            }
            if (a.t < this.t) {
                f = a.s & this.DM;
                for (i = m; i < this.t; ++i) {
                    r[i] = op(this[i], f);
                }
                r.t = this.t;
            }
            else {
                f = this.s & this.DM;
                for (i = m; i < a.t; ++i) {
                    r[i] = op(f, a[i]);
                }
                r.t = a.t;
            }
            r.s = op(this.s, a.s);
            r.clamp();
        };
        BigInteger.prototype.changeBit = function (n, op) {
            var r = BigInteger.ONE.shiftLeft(n);
            this.bitwiseTo(r, op, r);
            return r;
        };
        BigInteger.prototype.addTo = function (a, r) {
            var i = 0;
            var c = 0;
            var m = Math.min(a.t, this.t);
            while (i < m) {
                c += this[i] + a[i];
                r[i++] = c & this.DM;
                c >>= this.DB;
            }
            if (a.t < this.t) {
                c += a.s;
                while (i < this.t) {
                    c += this[i];
                    r[i++] = c & this.DM;
                    c >>= this.DB;
                }
                c += this.s;
            }
            else {
                c += this.s;
                while (i < a.t) {
                    c += a[i];
                    r[i++] = c & this.DM;
                    c >>= this.DB;
                }
                c += a.s;
            }
            r.s = (c < 0) ? -1 : 0;
            if (c > 0) {
                r[i++] = c;
            }
            else if (c < -1) {
                r[i++] = this.DV + c;
            }
            r.t = i;
            r.clamp();
        };
        BigInteger.prototype.dMultiply = function (n) {
            this[this.t] = this.am(0, n - 1, this, 0, 0, this.t);
            ++this.t;
            this.clamp();
        };
        BigInteger.prototype.dAddOffset = function (n, w) {
            if (n == 0) {
                return;
            }
            while (this.t <= w) {
                this[this.t++] = 0;
            }
            this[w] += n;
            while (this[w] >= this.DV) {
                this[w] -= this.DV;
                if (++w >= this.t) {
                    this[this.t++] = 0;
                }
                ++this[w];
            }
        };
        BigInteger.prototype.multiplyLowerTo = function (a, n, r) {
            var i = Math.min(this.t + a.t, n);
            r.s = 0;
            r.t = i;
            while (i > 0) {
                r[--i] = 0;
            }
            for (var j = r.t - this.t; i < j; ++i) {
                r[i + this.t] = this.am(0, a[i], r, i, 0, this.t);
            }
            for (var j = Math.min(a.t, n); i < j; ++i) {
                this.am(0, a[i], r, i, 0, n - i);
            }
            r.clamp();
        };
        BigInteger.prototype.multiplyUpperTo = function (a, n, r) {
            --n;
            var i = r.t = this.t + a.t - n;
            r.s = 0;
            while (--i >= 0) {
                r[i] = 0;
            }
            for (i = Math.max(n - this.t, 0); i < a.t; ++i) {
                r[this.t + i - n] = this.am(n - i, a[i], r, 0, 0, this.t + i - n);
            }
            r.clamp();
            r.drShiftTo(1, r);
        };
        BigInteger.prototype.modInt = function (n) {
            if (n <= 0) {
                return 0;
            }
            var d = this.DV % n;
            var r = (this.s < 0) ? n - 1 : 0;
            if (this.t > 0) {
                if (d == 0) {
                    r = this[0] % n;
                }
                else {
                    for (var i = this.t - 1; i >= 0; --i) {
                        r = (d * r + this[i]) % n;
                    }
                }
            }
            return r;
        };
        BigInteger.prototype.millerRabin = function (t) {
            var n1 = this.subtract(BigInteger.ONE);
            var k = n1.getLowestSetBit();
            if (k <= 0) {
                return false;
            }
            var r = n1.shiftRight(k);
            t = (t + 1) >> 1;
            if (t > lowprimes.length) {
                t = lowprimes.length;
            }
            var a = nbi();
            for (var i = 0; i < t; ++i) {
                a.fromInt(lowprimes[Math.floor(Math.random() * lowprimes.length)]);
                var y = a.modPow(r, this);
                if (y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {
                    var j = 1;
                    while (j++ < k && y.compareTo(n1) != 0) {
                        y = y.modPowInt(2, this);
                        if (y.compareTo(BigInteger.ONE) == 0) {
                            return false;
                        }
                    }
                    if (y.compareTo(n1) != 0) {
                        return false;
                    }
                }
            }
            return true;
        };
        BigInteger.prototype.square = function () {
            var r = nbi();
            this.squareTo(r);
            return r;
        };
        BigInteger.prototype.gcda = function (a, callback) {
            var x = (this.s < 0) ? this.negate() : this.clone();
            var y = (a.s < 0) ? a.negate() : a.clone();
            if (x.compareTo(y) < 0) {
                var t = x;
                x = y;
                y = t;
            }
            var i = x.getLowestSetBit();
            var g = y.getLowestSetBit();
            if (g < 0) {
                callback(x);
                return;
            }
            if (i < g) {
                g = i;
            }
            if (g > 0) {
                x.rShiftTo(g, x);
                y.rShiftTo(g, y);
            }
            var gcda1 = function () {
                if ((i = x.getLowestSetBit()) > 0) {
                    x.rShiftTo(i, x);
                }
                if ((i = y.getLowestSetBit()) > 0) {
                    y.rShiftTo(i, y);
                }
                if (x.compareTo(y) >= 0) {
                    x.subTo(y, x);
                    x.rShiftTo(1, x);
                }
                else {
                    y.subTo(x, y);
                    y.rShiftTo(1, y);
                }
                if (!(x.signum() > 0)) {
                    if (g > 0) {
                        y.lShiftTo(g, y);
                    }
                    setTimeout(function () { callback(y); }, 0);
                }
                else {
                    setTimeout(gcda1, 0);
                }
            };
            setTimeout(gcda1, 10);
        };
        BigInteger.prototype.fromNumberAsync = function (a, b, c, callback) {
            if ("number" == typeof b) {
                if (a < 2) {
                    this.fromInt(1);
                }
                else {
                    this.fromNumber(a, c);
                    if (!this.testBit(a - 1)) {
                        this.bitwiseTo(BigInteger.ONE.shiftLeft(a - 1), util_2.op_or, this);
                    }
                    if (this.isEven()) {
                        this.dAddOffset(1, 0);
                    }
                    var bnp_1 = this;
                    var bnpfn1_1 = function () {
                        bnp_1.dAddOffset(2, 0);
                        if (bnp_1.bitLength() > a) {
                            bnp_1.subTo(BigInteger.ONE.shiftLeft(a - 1), bnp_1);
                        }
                        if (bnp_1.isProbablePrime(b)) {
                            setTimeout(function () { callback(); }, 0);
                        }
                        else {
                            setTimeout(bnpfn1_1, 0);
                        }
                    };
                    setTimeout(bnpfn1_1, 0);
                }
            }
            else {
                var x = [];
                var t = a & 7;
                x.length = (a >> 3) + 1;
                b.nextBytes(x);
                if (t > 0) {
                    x[0] &= ((1 << t) - 1);
                }
                else {
                    x[0] = 0;
                }
                this.fromString(x, 256);
            }
        };
        return BigInteger;
    }());
    exports.BigInteger = BigInteger;
    var NullExp = (function () {
        function NullExp() {
        }
        NullExp.prototype.convert = function (x) {
            return x;
        };
        NullExp.prototype.revert = function (x) {
            return x;
        };
        NullExp.prototype.mulTo = function (x, y, r) {
            x.multiplyTo(y, r);
        };
        NullExp.prototype.sqrTo = function (x, r) {
            x.squareTo(r);
        };
        return NullExp;
    }());
    var Classic = (function () {
        function Classic(m) {
            this.m = m;
        }
        Classic.prototype.convert = function (x) {
            if (x.s < 0 || x.compareTo(this.m) >= 0) {
                return x.mod(this.m);
            }
            else {
                return x;
            }
        };
        Classic.prototype.revert = function (x) {
            return x;
        };
        Classic.prototype.reduce = function (x) {
            x.divRemTo(this.m, null, x);
        };
        Classic.prototype.mulTo = function (x, y, r) {
            x.multiplyTo(y, r);
            this.reduce(r);
        };
        Classic.prototype.sqrTo = function (x, r) {
            x.squareTo(r);
            this.reduce(r);
        };
        return Classic;
    }());
    var Montgomery = (function () {
        function Montgomery(m) {
            this.m = m;
            this.mp = m.invDigit();
            this.mpl = this.mp & 0x7fff;
            this.mph = this.mp >> 15;
            this.um = (1 << (m.DB - 15)) - 1;
            this.mt2 = 2 * m.t;
        }
        Montgomery.prototype.convert = function (x) {
            var r = nbi();
            x.abs().dlShiftTo(this.m.t, r);
            r.divRemTo(this.m, null, r);
            if (x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) {
                this.m.subTo(r, r);
            }
            return r;
        };
        Montgomery.prototype.revert = function (x) {
            var r = nbi();
            x.copyTo(r);
            this.reduce(r);
            return r;
        };
        Montgomery.prototype.reduce = function (x) {
            while (x.t <= this.mt2) {
                x[x.t++] = 0;
            }
            for (var i = 0; i < this.m.t; ++i) {
                var j = x[i] & 0x7fff;
                var u0 = (j * this.mpl + (((j * this.mph + (x[i] >> 15) * this.mpl) & this.um) << 15)) & x.DM;
                j = i + this.m.t;
                x[j] += this.m.am(0, u0, x, i, 0, this.m.t);
                while (x[j] >= x.DV) {
                    x[j] -= x.DV;
                    x[++j]++;
                }
            }
            x.clamp();
            x.drShiftTo(this.m.t, x);
            if (x.compareTo(this.m) >= 0) {
                x.subTo(this.m, x);
            }
        };
        Montgomery.prototype.mulTo = function (x, y, r) {
            x.multiplyTo(y, r);
            this.reduce(r);
        };
        Montgomery.prototype.sqrTo = function (x, r) {
            x.squareTo(r);
            this.reduce(r);
        };
        return Montgomery;
    }());
    var Barrett = (function () {
        function Barrett(m) {
            this.m = m;
            this.r2 = nbi();
            this.q3 = nbi();
            BigInteger.ONE.dlShiftTo(2 * m.t, this.r2);
            this.mu = this.r2.divide(m);
        }
        Barrett.prototype.convert = function (x) {
            if (x.s < 0 || x.t > 2 * this.m.t) {
                return x.mod(this.m);
            }
            else if (x.compareTo(this.m) < 0) {
                return x;
            }
            else {
                var r = nbi();
                x.copyTo(r);
                this.reduce(r);
                return r;
            }
        };
        Barrett.prototype.revert = function (x) {
            return x;
        };
        Barrett.prototype.reduce = function (x) {
            x.drShiftTo(this.m.t - 1, this.r2);
            if (x.t > this.m.t + 1) {
                x.t = this.m.t + 1;
                x.clamp();
            }
            this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3);
            this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2);
            while (x.compareTo(this.r2) < 0) {
                x.dAddOffset(1, this.m.t + 1);
            }
            x.subTo(this.r2, x);
            while (x.compareTo(this.m) >= 0) {
                x.subTo(this.m, x);
            }
        };
        Barrett.prototype.mulTo = function (x, y, r) {
            x.multiplyTo(y, r);
            this.reduce(r);
        };
        Barrett.prototype.sqrTo = function (x, r) {
            x.squareTo(r);
            this.reduce(r);
        };
        return Barrett;
    }());
    function nbi() { return new BigInteger(null); }
    exports.nbi = nbi;
    function parseBigInt(str, r) {
        return new BigInteger(str, r);
    }
    exports.parseBigInt = parseBigInt;
    function am1(i, x, w, j, c, n) {
        while (--n >= 0) {
            var v = x * this[i++] + w[j] + c;
            c = Math.floor(v / 0x4000000);
            w[j++] = v & 0x3ffffff;
        }
        return c;
    }
    function am2(i, x, w, j, c, n) {
        var xl = x & 0x7fff;
        var xh = x >> 15;
        while (--n >= 0) {
            var l = this[i] & 0x7fff;
            var h = this[i++] >> 15;
            var m = xh * l + h * xl;
            l = xl * l + ((m & 0x7fff) << 15) + w[j] + (c & 0x3fffffff);
            c = (l >>> 30) + (m >>> 15) + xh * h + (c >>> 30);
            w[j++] = l & 0x3fffffff;
        }
        return c;
    }
    function am3(i, x, w, j, c, n) {
        var xl = x & 0x3fff;
        var xh = x >> 14;
        while (--n >= 0) {
            var l = this[i] & 0x3fff;
            var h = this[i++] >> 14;
            var m = xh * l + h * xl;
            l = xl * l + ((m & 0x3fff) << 14) + w[j] + c;
            c = (l >> 28) + (m >> 14) + xh * h;
            w[j++] = l & 0xfffffff;
        }
        return c;
    }
    if (j_lm && (navigator.appName == "Microsoft Internet Explorer")) {
        BigInteger.prototype.am = am2;
        dbits = 30;
    }
    else if (j_lm && (navigator.appName != "Netscape")) {
        BigInteger.prototype.am = am1;
        dbits = 26;
    }
    else {
        BigInteger.prototype.am = am3;
        dbits = 28;
    }
    BigInteger.prototype.DB = dbits;
    BigInteger.prototype.DM = ((1 << dbits) - 1);
    BigInteger.prototype.DV = (1 << dbits);
    var BI_FP = 52;
    BigInteger.prototype.FV = Math.pow(2, BI_FP);
    BigInteger.prototype.F1 = BI_FP - dbits;
    BigInteger.prototype.F2 = 2 * dbits - BI_FP;
    var BI_RC = [];
    var rr;
    var vv;
    rr = "0".charCodeAt(0);
    for (vv = 0; vv <= 9; ++vv) {
        BI_RC[rr++] = vv;
    }
    rr = "a".charCodeAt(0);
    for (vv = 10; vv < 36; ++vv) {
        BI_RC[rr++] = vv;
    }
    rr = "A".charCodeAt(0);
    for (vv = 10; vv < 36; ++vv) {
        BI_RC[rr++] = vv;
    }
    function intAt(s, i) {
        var c = BI_RC[s.charCodeAt(i)];
        return (c == null) ? -1 : c;
    }
    exports.intAt = intAt;
    function nbv(i) {
        var r = nbi();
        r.fromInt(i);
        return r;
    }
    exports.nbv = nbv;
    function nbits(x) {
        var r = 1;
        var t;
        if ((t = x >>> 16) != 0) {
            x = t;
            r += 16;
        }
        if ((t = x >> 8) != 0) {
            x = t;
            r += 8;
        }
        if ((t = x >> 4) != 0) {
            x = t;
            r += 4;
        }
        if ((t = x >> 2) != 0) {
            x = t;
            r += 2;
        }
        if ((t = x >> 1) != 0) {
            x = t;
            r += 1;
        }
        return r;
    }
    exports.nbits = nbits;
    BigInteger.ZERO = nbv(0);
    BigInteger.ONE = nbv(1);
});
define("Lib/jsbn/rsa", ["require", "exports", "Lib/jsbn/jsbn", "Lib/jsbn/rng"], function (require, exports, jsbn_1, rng_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function pkcs1pad1(s, n) {
        if (n < s.length + 22) {
            console.error("Message too long for RSA");
            return null;
        }
        var len = n - s.length - 6;
        var filler = "";
        for (var f = 0; f < len; f += 2) {
            filler += "ff";
        }
        var m = "0001" + filler + "00" + s;
        return jsbn_1.parseBigInt(m, 16);
    }
    function pkcs1pad2(s, n) {
        if (n < s.length + 11) {
            console.error("Message too long for RSA");
            return null;
        }
        var ba = [];
        var i = s.length - 1;
        while (i >= 0 && n > 0) {
            var c = s.charCodeAt(i--);
            if (c < 128) {
                ba[--n] = c;
            }
            else if ((c > 127) && (c < 2048)) {
                ba[--n] = (c & 63) | 128;
                ba[--n] = (c >> 6) | 192;
            }
            else {
                ba[--n] = (c & 63) | 128;
                ba[--n] = ((c >> 6) & 63) | 128;
                ba[--n] = (c >> 12) | 224;
            }
        }
        ba[--n] = 0;
        var rng = new rng_1.SecureRandom();
        var x = [];
        while (n > 2) {
            x[0] = 0;
            while (x[0] == 0) {
                rng.nextBytes(x);
            }
            ba[--n] = x[0];
        }
        ba[--n] = 2;
        ba[--n] = 0;
        return new jsbn_1.BigInteger(ba);
    }
    var RSAKey = (function () {
        function RSAKey() {
            this.n = null;
            this.e = 0;
            this.d = null;
            this.p = null;
            this.q = null;
            this.dmp1 = null;
            this.dmq1 = null;
            this.coeff = null;
        }
        RSAKey.prototype.doPublic = function (x) {
            return x.modPowInt(this.e, this.n);
        };
        RSAKey.prototype.doPrivate = function (x) {
            if (this.p == null || this.q == null) {
                return x.modPow(this.d, this.n);
            }
            var xp = x.mod(this.p).modPow(this.dmp1, this.p);
            var xq = x.mod(this.q).modPow(this.dmq1, this.q);
            while (xp.compareTo(xq) < 0) {
                xp = xp.add(this.p);
            }
            return xp.subtract(xq).multiply(this.coeff).mod(this.p).multiply(this.q).add(xq);
        };
        RSAKey.prototype.setPublic = function (N, E) {
            if (N != null && E != null && N.length > 0 && E.length > 0) {
                this.n = jsbn_1.parseBigInt(N, 16);
                this.e = parseInt(E, 16);
            }
            else {
                console.error("Invalid RSA public key");
            }
        };
        RSAKey.prototype.encrypt = function (text) {
            var m = pkcs1pad2(text, (this.n.bitLength() + 7) >> 3);
            if (m == null) {
                return null;
            }
            var c = this.doPublic(m);
            if (c == null) {
                return null;
            }
            var h = c.toString(16);
            if ((h.length & 1) == 0) {
                return h;
            }
            else {
                return "0" + h;
            }
        };
        RSAKey.prototype.setPrivate = function (N, E, D) {
            if (N != null && E != null && N.length > 0 && E.length > 0) {
                this.n = jsbn_1.parseBigInt(N, 16);
                this.e = parseInt(E, 16);
                this.d = jsbn_1.parseBigInt(D, 16);
            }
            else {
                console.error("Invalid RSA private key");
            }
        };
        RSAKey.prototype.setPrivateEx = function (N, E, D, P, Q, DP, DQ, C) {
            if (N != null && E != null && N.length > 0 && E.length > 0) {
                this.n = jsbn_1.parseBigInt(N, 16);
                this.e = parseInt(E, 16);
                this.d = jsbn_1.parseBigInt(D, 16);
                this.p = jsbn_1.parseBigInt(P, 16);
                this.q = jsbn_1.parseBigInt(Q, 16);
                this.dmp1 = jsbn_1.parseBigInt(DP, 16);
                this.dmq1 = jsbn_1.parseBigInt(DQ, 16);
                this.coeff = jsbn_1.parseBigInt(C, 16);
            }
            else {
                console.error("Invalid RSA private key");
            }
        };
        RSAKey.prototype.generate = function (B, E) {
            var rng = new rng_1.SecureRandom();
            var qs = B >> 1;
            this.e = parseInt(E, 16);
            var ee = new jsbn_1.BigInteger(E, 16);
            for (;;) {
                for (;;) {
                    this.p = new jsbn_1.BigInteger(B - qs, 1, rng);
                    if (this.p.subtract(jsbn_1.BigInteger.ONE).gcd(ee).compareTo(jsbn_1.BigInteger.ONE) == 0 && this.p.isProbablePrime(10)) {
                        break;
                    }
                }
                for (;;) {
                    this.q = new jsbn_1.BigInteger(qs, 1, rng);
                    if (this.q.subtract(jsbn_1.BigInteger.ONE).gcd(ee).compareTo(jsbn_1.BigInteger.ONE) == 0 && this.q.isProbablePrime(10)) {
                        break;
                    }
                }
                if (this.p.compareTo(this.q) <= 0) {
                    var t = this.p;
                    this.p = this.q;
                    this.q = t;
                }
                var p1 = this.p.subtract(jsbn_1.BigInteger.ONE);
                var q1 = this.q.subtract(jsbn_1.BigInteger.ONE);
                var phi = p1.multiply(q1);
                if (phi.gcd(ee).compareTo(jsbn_1.BigInteger.ONE) == 0) {
                    this.n = this.p.multiply(this.q);
                    this.d = ee.modInverse(phi);
                    this.dmp1 = this.d.mod(p1);
                    this.dmq1 = this.d.mod(q1);
                    this.coeff = this.q.modInverse(this.p);
                    break;
                }
            }
        };
        RSAKey.prototype.decrypt = function (ctext) {
            var c = jsbn_1.parseBigInt(ctext, 16);
            var m = this.doPrivate(c);
            if (m == null) {
                return null;
            }
            return pkcs1unpad2(m, (this.n.bitLength() + 7) >> 3);
        };
        RSAKey.prototype.generateAsync = function (B, E, callback) {
            var rng = new rng_1.SecureRandom();
            var qs = B >> 1;
            this.e = parseInt(E, 16);
            var ee = new jsbn_1.BigInteger(E, 16);
            var rsa = this;
            var loop1 = function () {
                var loop4 = function () {
                    if (rsa.p.compareTo(rsa.q) <= 0) {
                        var t = rsa.p;
                        rsa.p = rsa.q;
                        rsa.q = t;
                    }
                    var p1 = rsa.p.subtract(jsbn_1.BigInteger.ONE);
                    var q1 = rsa.q.subtract(jsbn_1.BigInteger.ONE);
                    var phi = p1.multiply(q1);
                    if (phi.gcd(ee).compareTo(jsbn_1.BigInteger.ONE) == 0) {
                        rsa.n = rsa.p.multiply(rsa.q);
                        rsa.d = ee.modInverse(phi);
                        rsa.dmp1 = rsa.d.mod(p1);
                        rsa.dmq1 = rsa.d.mod(q1);
                        rsa.coeff = rsa.q.modInverse(rsa.p);
                        setTimeout(function () { callback(); }, 0);
                    }
                    else {
                        setTimeout(loop1, 0);
                    }
                };
                var loop3 = function () {
                    rsa.q = jsbn_1.nbi();
                    rsa.q.fromNumberAsync(qs, 1, rng, function () {
                        rsa.q.subtract(jsbn_1.BigInteger.ONE).gcda(ee, function (r) {
                            if (r.compareTo(jsbn_1.BigInteger.ONE) == 0 && rsa.q.isProbablePrime(10)) {
                                setTimeout(loop4, 0);
                            }
                            else {
                                setTimeout(loop3, 0);
                            }
                        });
                    });
                };
                var loop2 = function () {
                    rsa.p = jsbn_1.nbi();
                    rsa.p.fromNumberAsync(B - qs, 1, rng, function () {
                        rsa.p.subtract(jsbn_1.BigInteger.ONE).gcda(ee, function (r) {
                            if (r.compareTo(jsbn_1.BigInteger.ONE) == 0 && rsa.p.isProbablePrime(10)) {
                                setTimeout(loop3, 0);
                            }
                            else {
                                setTimeout(loop2, 0);
                            }
                        });
                    });
                };
                setTimeout(loop2, 0);
            };
            setTimeout(loop1, 0);
        };
        RSAKey.prototype.sign = function (text, digestMethod, digestName) {
            var header = getDigestHeader(digestName);
            var digest = header + digestMethod(text).toString();
            var m = pkcs1pad1(digest, this.n.bitLength() / 4);
            if (m == null) {
                return null;
            }
            var c = this.doPrivate(m);
            if (c == null) {
                return null;
            }
            var h = c.toString(16);
            if ((h.length & 1) == 0) {
                return h;
            }
            else {
                return "0" + h;
            }
        };
        RSAKey.prototype.verify = function (text, signature, digestMethod) {
            var c = jsbn_1.parseBigInt(signature, 16);
            var m = this.doPublic(c);
            if (m == null) {
                return null;
            }
            var unpadded = m.toString(16).replace(/^1f+00/, "");
            var digest = removeDigestHeader(unpadded);
            return digest == digestMethod(text).toString();
        };
        return RSAKey;
    }());
    exports.RSAKey = RSAKey;
    function pkcs1unpad2(d, n) {
        var b = d.toByteArray();
        var i = 0;
        while (i < b.length && b[i] == 0) {
            ++i;
        }
        if (b.length - i != n - 1 || b[i] != 2) {
            return null;
        }
        ++i;
        while (b[i] != 0) {
            if (++i >= b.length) {
                return null;
            }
        }
        var ret = "";
        while (++i < b.length) {
            var c = b[i] & 255;
            if (c < 128) {
                ret += String.fromCharCode(c);
            }
            else if ((c > 191) && (c < 224)) {
                ret += String.fromCharCode(((c & 31) << 6) | (b[i + 1] & 63));
                ++i;
            }
            else {
                ret += String.fromCharCode(((c & 15) << 12) | ((b[i + 1] & 63) << 6) | (b[i + 2] & 63));
                i += 2;
            }
        }
        return ret;
    }
    var DIGEST_HEADERS = {
        md2: "3020300c06082a864886f70d020205000410",
        md5: "3020300c06082a864886f70d020505000410",
        sha1: "3021300906052b0e03021a05000414",
        sha224: "302d300d06096086480165030402040500041c",
        sha256: "3031300d060960864801650304020105000420",
        sha384: "3041300d060960864801650304020205000430",
        sha512: "3051300d060960864801650304020305000440",
        ripemd160: "3021300906052b2403020105000414",
    };
    function getDigestHeader(name) {
        return DIGEST_HEADERS[name] || "";
    }
    function removeDigestHeader(str) {
        for (var name_1 in DIGEST_HEADERS) {
            if (DIGEST_HEADERS.hasOwnProperty(name_1)) {
                var header = DIGEST_HEADERS[name_1];
                var len = header.length;
                if (str.substr(0, len) == header) {
                    return str.substr(len);
                }
            }
        }
        return str;
    }
});
define("Lib/jsencrypt/JSEncryptRSAKey", ["require", "exports", "Lib/jsbn/base64", "Lib/asn1js/hex", "Lib/asn1js/base64", "Lib/asn1js/asn1", "Lib/jsbn/rsa", "Lib/jsbn/jsbn", "../jsrsasign/asn1-1.0"], function (require, exports, base64_1, hex_1, base64_2, asn1_1, rsa_1, jsbn_2, asn1_1_0_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var JSEncryptRSAKey = (function (_super) {
        __extends(JSEncryptRSAKey, _super);
        function JSEncryptRSAKey(key) {
            var _this = _super.call(this) || this;
            if (key) {
                if (typeof key === "string") {
                    _this.parseKey(key);
                }
                else if (JSEncryptRSAKey.hasPrivateKeyProperty(key) ||
                    JSEncryptRSAKey.hasPublicKeyProperty(key)) {
                    _this.parsePropertiesFrom(key);
                }
            }
            return _this;
        }
        JSEncryptRSAKey.prototype.parseKey = function (pem) {
            try {
                var modulus = 0;
                var public_exponent = 0;
                var reHex = /^\s*(?:[0-9A-Fa-f][0-9A-Fa-f]\s*)+$/;
                var der = reHex.test(pem) ? hex_1.Hex.decode(pem) : base64_2.Base64.unarmor(pem);
                var asn1 = asn1_1.ASN1.decode(der);
                if (asn1.sub.length === 3) {
                    asn1 = asn1.sub[2].sub[0];
                }
                if (asn1.sub.length === 9) {
                    modulus = asn1.sub[1].getHexStringValue();
                    this.n = jsbn_2.parseBigInt(modulus, 16);
                    public_exponent = asn1.sub[2].getHexStringValue();
                    this.e = parseInt(public_exponent, 16);
                    var private_exponent = asn1.sub[3].getHexStringValue();
                    this.d = jsbn_2.parseBigInt(private_exponent, 16);
                    var prime1 = asn1.sub[4].getHexStringValue();
                    this.p = jsbn_2.parseBigInt(prime1, 16);
                    var prime2 = asn1.sub[5].getHexStringValue();
                    this.q = jsbn_2.parseBigInt(prime2, 16);
                    var exponent1 = asn1.sub[6].getHexStringValue();
                    this.dmp1 = jsbn_2.parseBigInt(exponent1, 16);
                    var exponent2 = asn1.sub[7].getHexStringValue();
                    this.dmq1 = jsbn_2.parseBigInt(exponent2, 16);
                    var coefficient = asn1.sub[8].getHexStringValue();
                    this.coeff = jsbn_2.parseBigInt(coefficient, 16);
                }
                else if (asn1.sub.length === 2) {
                    var bit_string = asn1.sub[1];
                    var sequence = bit_string.sub[0];
                    modulus = sequence.sub[0].getHexStringValue();
                    this.n = jsbn_2.parseBigInt(modulus, 16);
                    public_exponent = sequence.sub[1].getHexStringValue();
                    this.e = parseInt(public_exponent, 16);
                }
                else {
                    return false;
                }
                return true;
            }
            catch (ex) {
                return false;
            }
        };
        JSEncryptRSAKey.prototype.getPrivateBaseKey = function () {
            var options = {
                array: [
                    new asn1_1_0_1.KJUR.asn1.DERInteger({ int: 0 }),
                    new asn1_1_0_1.KJUR.asn1.DERInteger({ bigint: this.n }),
                    new asn1_1_0_1.KJUR.asn1.DERInteger({ int: this.e }),
                    new asn1_1_0_1.KJUR.asn1.DERInteger({ bigint: this.d }),
                    new asn1_1_0_1.KJUR.asn1.DERInteger({ bigint: this.p }),
                    new asn1_1_0_1.KJUR.asn1.DERInteger({ bigint: this.q }),
                    new asn1_1_0_1.KJUR.asn1.DERInteger({ bigint: this.dmp1 }),
                    new asn1_1_0_1.KJUR.asn1.DERInteger({ bigint: this.dmq1 }),
                    new asn1_1_0_1.KJUR.asn1.DERInteger({ bigint: this.coeff })
                ]
            };
            var seq = new asn1_1_0_1.KJUR.asn1.DERSequence(options);
            return seq.getEncodedHex();
        };
        JSEncryptRSAKey.prototype.getPrivateBaseKeyB64 = function () {
            return base64_1.hex2b64(this.getPrivateBaseKey());
        };
        JSEncryptRSAKey.prototype.getPublicBaseKey = function () {
            var first_sequence = new asn1_1_0_1.KJUR.asn1.DERSequence({
                array: [
                    new asn1_1_0_1.KJUR.asn1.DERObjectIdentifier({ oid: "1.2.840.113549.1.1.1" }),
                    new asn1_1_0_1.KJUR.asn1.DERNull()
                ]
            });
            var second_sequence = new asn1_1_0_1.KJUR.asn1.DERSequence({
                array: [
                    new asn1_1_0_1.KJUR.asn1.DERInteger({ bigint: this.n }),
                    new asn1_1_0_1.KJUR.asn1.DERInteger({ int: this.e })
                ]
            });
            var bit_string = new asn1_1_0_1.KJUR.asn1.DERBitString({
                hex: "00" + second_sequence.getEncodedHex()
            });
            var seq = new asn1_1_0_1.KJUR.asn1.DERSequence({
                array: [
                    first_sequence,
                    bit_string
                ]
            });
            return seq.getEncodedHex();
        };
        JSEncryptRSAKey.prototype.getPublicBaseKeyB64 = function () {
            return base64_1.hex2b64(this.getPublicBaseKey());
        };
        JSEncryptRSAKey.wordwrap = function (str, width) {
            width = width || 64;
            if (!str) {
                return str;
            }
            var regex = "(.{1," + width + "})( +|$\n?)|(.{1," + width + "})";
            return str.match(RegExp(regex, "g")).join("\n");
        };
        JSEncryptRSAKey.prototype.getPrivateKey = function () {
            var key = "-----BEGIN RSA PRIVATE KEY-----\n";
            key += JSEncryptRSAKey.wordwrap(this.getPrivateBaseKeyB64()) + "\n";
            key += "-----END RSA PRIVATE KEY-----";
            return key;
        };
        JSEncryptRSAKey.prototype.getPublicKey = function () {
            var key = "-----BEGIN PUBLIC KEY-----\n";
            key += JSEncryptRSAKey.wordwrap(this.getPublicBaseKeyB64()) + "\n";
            key += "-----END PUBLIC KEY-----";
            return key;
        };
        JSEncryptRSAKey.hasPublicKeyProperty = function (obj) {
            obj = obj || {};
            return (obj.hasOwnProperty("n") &&
                obj.hasOwnProperty("e"));
        };
        JSEncryptRSAKey.hasPrivateKeyProperty = function (obj) {
            obj = obj || {};
            return (obj.hasOwnProperty("n") &&
                obj.hasOwnProperty("e") &&
                obj.hasOwnProperty("d") &&
                obj.hasOwnProperty("p") &&
                obj.hasOwnProperty("q") &&
                obj.hasOwnProperty("dmp1") &&
                obj.hasOwnProperty("dmq1") &&
                obj.hasOwnProperty("coeff"));
        };
        JSEncryptRSAKey.prototype.parsePropertiesFrom = function (obj) {
            this.n = obj.n;
            this.e = obj.e;
            if (obj.hasOwnProperty("d")) {
                this.d = obj.d;
                this.p = obj.p;
                this.q = obj.q;
                this.dmp1 = obj.dmp1;
                this.dmq1 = obj.dmq1;
                this.coeff = obj.coeff;
            }
        };
        return JSEncryptRSAKey;
    }(rsa_1.RSAKey));
    exports.JSEncryptRSAKey = JSEncryptRSAKey;
});
define("Look/API/Token", ["require", "exports", "Lib/jsencrypt/JSEncryptRSAKey", "Look/Util", "Look/Use/ErrorQueryObject"], function (require, exports, JSEncryptRSAKey_1, Util_3, ErrorQueryObject_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BadTokenCode = 70001;
    exports.TokenExpired = 70002;
    exports.NoAccessToken = 70003;
    var Token = (function () {
        function Token(accessToken, expiresIn, publicKey, privateKey) {
            if (publicKey) {
                publicKey = Util_3.hex2a(publicKey);
                this.publicKey = new JSEncryptRSAKey_1.JSEncryptRSAKey(publicKey);
            }
            if (privateKey) {
                privateKey = Util_3.hex2a(privateKey);
                this.privateKey = new JSEncryptRSAKey_1.JSEncryptRSAKey(privateKey);
            }
            this.accessToken = accessToken;
            this.expiresIn = expiresIn;
        }
        Token.prototype.isExpired = function () {
            if (this.expiresIn === 0) {
                return false;
            }
            return Util_3.getCurrectTimeStamp() > this.expiresIn;
        };
        Token.prototype.supportSendProtectedData = function () {
            return typeof this.publicKey !== 'undefined';
        };
        Token.prototype.supportGetProtectedData = function () {
            return typeof this.privateKey !== 'undefined';
        };
        Token.getBadTokenError = function (params) {
            return new ErrorQueryObject_1.default(exports.BadTokenCode, 'token is not valid', params);
        };
        Token.getExpiredTokenError = function (params) {
            return new ErrorQueryObject_1.default(exports.TokenExpired, 'expired token', params);
        };
        Token.getAccessTokenError = function (params) {
            return new ErrorQueryObject_1.default(exports.NoAccessToken, 'token does not have an access signature for this request', params);
        };
        return Token;
    }());
    exports.Token = Token;
    exports.default = Token;
});
define("Look/API/Request", ["require", "exports", "Look/Util", "Look/Use/QueryData", "Look/Use/ErrorQueryObject", "Look/Use/QueryData", "Look/Use/Query", "Look/API/Token"], function (require, exports, Util_4, QueryData_1, ErrorQueryObject_2, QueryData_2, Query_1, Token_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RequestMethod = QueryData_1.QueryMethod;
    exports.ErrorRequestObject = ErrorQueryObject_2.default;
    exports.accessTokenArgName = 'accessToken';
    exports.accessTokenHeaderName = 'X-Look-Access-Token';
    exports.protectedDataArgName = 'protectedData';
    exports.protectedDataHeaderName = 'X-Look-Protected-Data';
    var ErrorRequestCode;
    (function (ErrorRequestCode) {
        ErrorRequestCode[ErrorRequestCode["Unknow"] = 800000] = "Unknow";
        ErrorRequestCode[ErrorRequestCode["XHRFail"] = 800001] = "XHRFail";
        ErrorRequestCode[ErrorRequestCode["Timeout"] = 800002] = "Timeout";
        ErrorRequestCode[ErrorRequestCode["Abort"] = 800003] = "Abort";
        ErrorRequestCode[ErrorRequestCode["NotJson"] = 800004] = "NotJson";
        ErrorRequestCode[ErrorRequestCode["TokenNotTunnel"] = 800005] = "TokenNotTunnel";
        ErrorRequestCode[ErrorRequestCode["ProtectedDataFail"] = 800005] = "ProtectedDataFail";
        ErrorRequestCode[ErrorRequestCode["MethodOrFunctionFail"] = 800006] = "MethodOrFunctionFail";
    })(ErrorRequestCode = exports.ErrorRequestCode || (exports.ErrorRequestCode = {}));
    var RequestData = (function (_super) {
        __extends(RequestData, _super);
        function RequestData(apiUrl, apiClass, apiMethod, token, data, tunnel, method) {
            if (data === void 0) { data = {}; }
            if (tunnel === void 0) { tunnel = false; }
            var _this = _super.call(this, apiUrl + apiClass + '.' + apiMethod, data, method) || this;
            _this.apiUrl = apiUrl;
            _this.apiClass = apiClass;
            _this.apiMethod = apiMethod;
            _this.token = token;
            _this.data = data;
            _this.tunnel = tunnel;
            return _this;
        }
        return RequestData;
    }(QueryData_2.default));
    exports.RequestData = RequestData;
    exports.NameChecker = /^[a-z]+$/i;
    var RequestAnsParam = (function () {
        function RequestAnsParam(key, value) {
            this.key = key;
            this.value = value;
        }
        return RequestAnsParam;
    }());
    exports.RequestAnsParam = RequestAnsParam;
    var RequestAnsParamList = (function (_super) {
        __extends(RequestAnsParamList, _super);
        function RequestAnsParamList() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return RequestAnsParamList;
    }(Array));
    exports.RequestAnsParamList = RequestAnsParamList;
    var Request = (function (_super) {
        __extends(Request, _super);
        function Request(queryData, delay, timeout) {
            var _this = _super.call(this, queryData, delay, timeout) || this;
            _this.queryData = queryData;
            return _this;
        }
        Request.prototype.convertParamsToAns = function (params) {
            var list = new RequestAnsParamList(), i;
            for (i in params) {
                if (params.hasOwnProperty(i)) {
                    var item = new RequestAnsParam(i, params[i]);
                    list.push(item);
                }
            }
            return list;
        };
        Request.prototype.initXHR = function () {
            var self = this, headers = {}, xhr = Util_4.getXhr(), queryData = self.queryData, params = queryData.getData();
            if (!xhr) {
                throw new ErrorQueryObject_2.default(ErrorRequestCode.XHRFail, 'Failed to initialize xhr', params);
            }
            if (queryData.tunnel) {
                if (!queryData.token
                    || !queryData.token.supportSendProtectedData()) {
                    throw new ErrorQueryObject_2.default(ErrorRequestCode.TokenNotTunnel, 'Token does not support tunnel technology', params);
                }
                if (queryData.hasDataByName(exports.accessTokenArgName)) {
                    headers[exports.accessTokenHeaderName] = queryData.getDataByName(exports.accessTokenArgName);
                    queryData.unsetDataByName(exports.accessTokenArgName);
                }
                else {
                    headers[exports.accessTokenHeaderName] = queryData.token.accessToken;
                }
                var encryptData = JSON.stringify(queryData.getData());
                var protectedData = queryData.token.publicKey.encrypt(encryptData);
                if (protectedData == null) {
                    throw new ErrorQueryObject_2.default(ErrorRequestCode.TokenNotTunnel, 'Could not encrypt data', params);
                }
                headers[exports.protectedDataHeaderName] = protectedData;
                queryData.setData({});
            }
            else if (!params[exports.accessTokenArgName] && queryData.token) {
                queryData.setDataByName(exports.accessTokenArgName, queryData.token.accessToken);
            }
            queryData.setDataByName('__ts', Util_4.getCurrectTimeStamp());
            params = queryData.getData();
            xhr.open(queryData.getMethod(), queryData.getUrl(), true);
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            var accept = false;
            for (var name in headers) {
                if (headers.hasOwnProperty(name)) {
                    xhr.setRequestHeader(name, headers[name]);
                    accept = true;
                }
            }
            if (accept) {
                xhr.setRequestHeader("Accept", "text/xml");
            }
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.setRequestHeader("Cache-Control", "no-cache");
            var callFromChange = false;
            var abortFromWaiter = false;
            xhr.onreadystatechange = function () {
                self.callbackReadyStateChange(xhr);
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        var result = self.responceHandler(xhr, params);
                        if (!result) {
                            callFromChange = true;
                        }
                    }
                    else {
                        callFromChange = true;
                        self.callbackError(new ErrorQueryObject_2.default(xhr.status, xhr.responseText, params));
                    }
                }
            };
            xhr.onerror = function () {
                if (!callFromChange) {
                    self.callbackError(new ErrorQueryObject_2.default(xhr.status, xhr.responseText, params));
                }
            };
            self.onAbort(function () {
                abortFromWaiter = true;
                xhr.abort();
            });
            xhr.onabort = function () {
                if (abortFromWaiter) {
                    if (self.calledErrorIfNotSuccess()) {
                        self.callbackError(new ErrorQueryObject_2.default(ErrorRequestCode.Abort, 'Abort', params));
                    }
                    else {
                        self.callbackAbort();
                    }
                }
            };
            xhr.ontimeout = function () {
                var error = new ErrorQueryObject_2.default(ErrorRequestCode.Timeout, 'Timeout', params);
                if (self.calledErrorIfNotSuccess())
                    self.callbackError(error);
                else
                    self.callbackTimeout(error);
            };
            xhr.onprogress = function (event) { self.callbackProcess(event); };
            if (self.timeout) {
                xhr.timeout = self.timeout;
            }
            if (queryData.isGet()) {
                xhr.send();
            }
            else {
                xhr.send(queryData.getSendData());
            }
            self.callbackStart();
            return xhr;
        };
        Request.prototype.responceHandler = function (xhr, data) {
            var ans, error;
            try {
                ans = JSON.parse(xhr.responseText);
            }
            catch (e) {
                error = new ErrorQueryObject_2.default(ErrorRequestCode.NotJson, xhr.responseText, data);
                this.callbackError(error);
                return false;
            }
            if (typeof ans.response !== 'undefined') {
                this.callbackSuccess(ans.response);
                return true;
            }
            if (ans.error) {
                error = new ErrorQueryObject_2.default(ans.error.error_code, ans.error.error_msg, ans.error.request_params);
            }
            if (!error) {
                error = new ErrorQueryObject_2.default(ErrorRequestCode.Unknow, xhr.responseText, data);
            }
            this.callbackError(error);
            return false;
        };
        Request.prototype.checkBeforeInit = function () {
            var origin = this.queryData.getData();
            var params = this.convertParamsToAns(origin);
            if (this.queryData.token && this.queryData.token.isExpired()) {
                throw Token_1.default.getExpiredTokenError(params);
            }
            if (this.queryData.tunnel && (!this.queryData.token || !this.queryData.token.supportSendProtectedData())) {
                throw Token_1.default.getBadTokenError(params);
            }
            if (!exports.NameChecker.test(this.queryData.apiClass)
                || !exports.NameChecker.test(this.queryData.apiMethod)) {
                throw new ErrorQueryObject_2.default(500, 'в имени метода или функции присудствуют запрещенные символы', params);
            }
            return true;
        };
        return Request;
    }(Query_1.default));
    exports.Request = Request;
    exports.default = Request;
});
define("Lib/Md5", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Md5 = (function () {
        function Md5() {
            this._state = new Int32Array(4);
            this._buffer = new ArrayBuffer(68);
            this._buffer8 = new Uint8Array(this._buffer, 0, 68);
            this._buffer32 = new Uint32Array(this._buffer, 0, 17);
            this.start();
        }
        Md5.hashStr = function (str, raw) {
            if (raw === void 0) { raw = false; }
            return this.onePassHasher
                .start()
                .appendStr(str)
                .end(raw);
        };
        Md5.hashAsciiStr = function (str, raw) {
            if (raw === void 0) { raw = false; }
            return this.onePassHasher
                .start()
                .appendAsciiStr(str)
                .end(raw);
        };
        Md5._hex = function (x) {
            var hc = Md5.hexChars;
            var ho = Md5.hexOut;
            var n;
            var offset;
            var j;
            var i;
            for (i = 0; i < 4; i += 1) {
                offset = i * 8;
                n = x[i];
                for (j = 0; j < 8; j += 2) {
                    ho[offset + 1 + j] = hc.charAt(n & 0x0F);
                    n >>>= 4;
                    ho[offset + 0 + j] = hc.charAt(n & 0x0F);
                    n >>>= 4;
                }
            }
            return ho.join('');
        };
        Md5._md5cycle = function (x, k) {
            var a = x[0];
            var b = x[1];
            var c = x[2];
            var d = x[3];
            a += (b & c | ~b & d) + k[0] - 680876936 | 0;
            a = (a << 7 | a >>> 25) + b | 0;
            d += (a & b | ~a & c) + k[1] - 389564586 | 0;
            d = (d << 12 | d >>> 20) + a | 0;
            c += (d & a | ~d & b) + k[2] + 606105819 | 0;
            c = (c << 17 | c >>> 15) + d | 0;
            b += (c & d | ~c & a) + k[3] - 1044525330 | 0;
            b = (b << 22 | b >>> 10) + c | 0;
            a += (b & c | ~b & d) + k[4] - 176418897 | 0;
            a = (a << 7 | a >>> 25) + b | 0;
            d += (a & b | ~a & c) + k[5] + 1200080426 | 0;
            d = (d << 12 | d >>> 20) + a | 0;
            c += (d & a | ~d & b) + k[6] - 1473231341 | 0;
            c = (c << 17 | c >>> 15) + d | 0;
            b += (c & d | ~c & a) + k[7] - 45705983 | 0;
            b = (b << 22 | b >>> 10) + c | 0;
            a += (b & c | ~b & d) + k[8] + 1770035416 | 0;
            a = (a << 7 | a >>> 25) + b | 0;
            d += (a & b | ~a & c) + k[9] - 1958414417 | 0;
            d = (d << 12 | d >>> 20) + a | 0;
            c += (d & a | ~d & b) + k[10] - 42063 | 0;
            c = (c << 17 | c >>> 15) + d | 0;
            b += (c & d | ~c & a) + k[11] - 1990404162 | 0;
            b = (b << 22 | b >>> 10) + c | 0;
            a += (b & c | ~b & d) + k[12] + 1804603682 | 0;
            a = (a << 7 | a >>> 25) + b | 0;
            d += (a & b | ~a & c) + k[13] - 40341101 | 0;
            d = (d << 12 | d >>> 20) + a | 0;
            c += (d & a | ~d & b) + k[14] - 1502002290 | 0;
            c = (c << 17 | c >>> 15) + d | 0;
            b += (c & d | ~c & a) + k[15] + 1236535329 | 0;
            b = (b << 22 | b >>> 10) + c | 0;
            a += (b & d | c & ~d) + k[1] - 165796510 | 0;
            a = (a << 5 | a >>> 27) + b | 0;
            d += (a & c | b & ~c) + k[6] - 1069501632 | 0;
            d = (d << 9 | d >>> 23) + a | 0;
            c += (d & b | a & ~b) + k[11] + 643717713 | 0;
            c = (c << 14 | c >>> 18) + d | 0;
            b += (c & a | d & ~a) + k[0] - 373897302 | 0;
            b = (b << 20 | b >>> 12) + c | 0;
            a += (b & d | c & ~d) + k[5] - 701558691 | 0;
            a = (a << 5 | a >>> 27) + b | 0;
            d += (a & c | b & ~c) + k[10] + 38016083 | 0;
            d = (d << 9 | d >>> 23) + a | 0;
            c += (d & b | a & ~b) + k[15] - 660478335 | 0;
            c = (c << 14 | c >>> 18) + d | 0;
            b += (c & a | d & ~a) + k[4] - 405537848 | 0;
            b = (b << 20 | b >>> 12) + c | 0;
            a += (b & d | c & ~d) + k[9] + 568446438 | 0;
            a = (a << 5 | a >>> 27) + b | 0;
            d += (a & c | b & ~c) + k[14] - 1019803690 | 0;
            d = (d << 9 | d >>> 23) + a | 0;
            c += (d & b | a & ~b) + k[3] - 187363961 | 0;
            c = (c << 14 | c >>> 18) + d | 0;
            b += (c & a | d & ~a) + k[8] + 1163531501 | 0;
            b = (b << 20 | b >>> 12) + c | 0;
            a += (b & d | c & ~d) + k[13] - 1444681467 | 0;
            a = (a << 5 | a >>> 27) + b | 0;
            d += (a & c | b & ~c) + k[2] - 51403784 | 0;
            d = (d << 9 | d >>> 23) + a | 0;
            c += (d & b | a & ~b) + k[7] + 1735328473 | 0;
            c = (c << 14 | c >>> 18) + d | 0;
            b += (c & a | d & ~a) + k[12] - 1926607734 | 0;
            b = (b << 20 | b >>> 12) + c | 0;
            a += (b ^ c ^ d) + k[5] - 378558 | 0;
            a = (a << 4 | a >>> 28) + b | 0;
            d += (a ^ b ^ c) + k[8] - 2022574463 | 0;
            d = (d << 11 | d >>> 21) + a | 0;
            c += (d ^ a ^ b) + k[11] + 1839030562 | 0;
            c = (c << 16 | c >>> 16) + d | 0;
            b += (c ^ d ^ a) + k[14] - 35309556 | 0;
            b = (b << 23 | b >>> 9) + c | 0;
            a += (b ^ c ^ d) + k[1] - 1530992060 | 0;
            a = (a << 4 | a >>> 28) + b | 0;
            d += (a ^ b ^ c) + k[4] + 1272893353 | 0;
            d = (d << 11 | d >>> 21) + a | 0;
            c += (d ^ a ^ b) + k[7] - 155497632 | 0;
            c = (c << 16 | c >>> 16) + d | 0;
            b += (c ^ d ^ a) + k[10] - 1094730640 | 0;
            b = (b << 23 | b >>> 9) + c | 0;
            a += (b ^ c ^ d) + k[13] + 681279174 | 0;
            a = (a << 4 | a >>> 28) + b | 0;
            d += (a ^ b ^ c) + k[0] - 358537222 | 0;
            d = (d << 11 | d >>> 21) + a | 0;
            c += (d ^ a ^ b) + k[3] - 722521979 | 0;
            c = (c << 16 | c >>> 16) + d | 0;
            b += (c ^ d ^ a) + k[6] + 76029189 | 0;
            b = (b << 23 | b >>> 9) + c | 0;
            a += (b ^ c ^ d) + k[9] - 640364487 | 0;
            a = (a << 4 | a >>> 28) + b | 0;
            d += (a ^ b ^ c) + k[12] - 421815835 | 0;
            d = (d << 11 | d >>> 21) + a | 0;
            c += (d ^ a ^ b) + k[15] + 530742520 | 0;
            c = (c << 16 | c >>> 16) + d | 0;
            b += (c ^ d ^ a) + k[2] - 995338651 | 0;
            b = (b << 23 | b >>> 9) + c | 0;
            a += (c ^ (b | ~d)) + k[0] - 198630844 | 0;
            a = (a << 6 | a >>> 26) + b | 0;
            d += (b ^ (a | ~c)) + k[7] + 1126891415 | 0;
            d = (d << 10 | d >>> 22) + a | 0;
            c += (a ^ (d | ~b)) + k[14] - 1416354905 | 0;
            c = (c << 15 | c >>> 17) + d | 0;
            b += (d ^ (c | ~a)) + k[5] - 57434055 | 0;
            b = (b << 21 | b >>> 11) + c | 0;
            a += (c ^ (b | ~d)) + k[12] + 1700485571 | 0;
            a = (a << 6 | a >>> 26) + b | 0;
            d += (b ^ (a | ~c)) + k[3] - 1894986606 | 0;
            d = (d << 10 | d >>> 22) + a | 0;
            c += (a ^ (d | ~b)) + k[10] - 1051523 | 0;
            c = (c << 15 | c >>> 17) + d | 0;
            b += (d ^ (c | ~a)) + k[1] - 2054922799 | 0;
            b = (b << 21 | b >>> 11) + c | 0;
            a += (c ^ (b | ~d)) + k[8] + 1873313359 | 0;
            a = (a << 6 | a >>> 26) + b | 0;
            d += (b ^ (a | ~c)) + k[15] - 30611744 | 0;
            d = (d << 10 | d >>> 22) + a | 0;
            c += (a ^ (d | ~b)) + k[6] - 1560198380 | 0;
            c = (c << 15 | c >>> 17) + d | 0;
            b += (d ^ (c | ~a)) + k[13] + 1309151649 | 0;
            b = (b << 21 | b >>> 11) + c | 0;
            a += (c ^ (b | ~d)) + k[4] - 145523070 | 0;
            a = (a << 6 | a >>> 26) + b | 0;
            d += (b ^ (a | ~c)) + k[11] - 1120210379 | 0;
            d = (d << 10 | d >>> 22) + a | 0;
            c += (a ^ (d | ~b)) + k[2] + 718787259 | 0;
            c = (c << 15 | c >>> 17) + d | 0;
            b += (d ^ (c | ~a)) + k[9] - 343485551 | 0;
            b = (b << 21 | b >>> 11) + c | 0;
            x[0] = a + x[0] | 0;
            x[1] = b + x[1] | 0;
            x[2] = c + x[2] | 0;
            x[3] = d + x[3] | 0;
        };
        Md5.prototype.start = function () {
            this._dataLength = 0;
            this._bufferLength = 0;
            this._state.set(Md5.stateIdentity);
            return this;
        };
        Md5.prototype.appendStr = function (str) {
            var buf8 = this._buffer8;
            var buf32 = this._buffer32;
            var bufLen = this._bufferLength;
            var code;
            var i;
            for (i = 0; i < str.length; i += 1) {
                code = str.charCodeAt(i);
                if (code < 128) {
                    buf8[bufLen++] = code;
                }
                else if (code < 0x800) {
                    buf8[bufLen++] = (code >>> 6) + 0xC0;
                    buf8[bufLen++] = code & 0x3F | 0x80;
                }
                else if (code < 0xD800 || code > 0xDBFF) {
                    buf8[bufLen++] = (code >>> 12) + 0xE0;
                    buf8[bufLen++] = (code >>> 6 & 0x3F) | 0x80;
                    buf8[bufLen++] = (code & 0x3F) | 0x80;
                }
                else {
                    code = ((code - 0xD800) * 0x400) + (str.charCodeAt(++i) - 0xDC00) + 0x10000;
                    if (code > 0x10FFFF) {
                        throw new Error('Unicode standard supports code points up to U+10FFFF');
                    }
                    buf8[bufLen++] = (code >>> 18) + 0xF0;
                    buf8[bufLen++] = (code >>> 12 & 0x3F) | 0x80;
                    buf8[bufLen++] = (code >>> 6 & 0x3F) | 0x80;
                    buf8[bufLen++] = (code & 0x3F) | 0x80;
                }
                if (bufLen >= 64) {
                    this._dataLength += 64;
                    Md5._md5cycle(this._state, buf32);
                    bufLen -= 64;
                    buf32[0] = buf32[16];
                }
            }
            this._bufferLength = bufLen;
            return this;
        };
        Md5.prototype.appendAsciiStr = function (str) {
            var buf8 = this._buffer8;
            var buf32 = this._buffer32;
            var bufLen = this._bufferLength;
            var i;
            var j = 0;
            for (;;) {
                i = Math.min(str.length - j, 64 - bufLen);
                while (i--) {
                    buf8[bufLen++] = str.charCodeAt(j++);
                }
                if (bufLen < 64) {
                    break;
                }
                this._dataLength += 64;
                Md5._md5cycle(this._state, buf32);
                bufLen = 0;
            }
            this._bufferLength = bufLen;
            return this;
        };
        Md5.prototype.appendByteArray = function (input) {
            var buf8 = this._buffer8;
            var buf32 = this._buffer32;
            var bufLen = this._bufferLength;
            var i;
            var j = 0;
            for (;;) {
                i = Math.min(input.length - j, 64 - bufLen);
                while (i--) {
                    buf8[bufLen++] = input[j++];
                }
                if (bufLen < 64) {
                    break;
                }
                this._dataLength += 64;
                Md5._md5cycle(this._state, buf32);
                bufLen = 0;
            }
            this._bufferLength = bufLen;
            return this;
        };
        Md5.prototype.getState = function () {
            var self = this;
            var s = self._state;
            return {
                buffer: String.fromCharCode.apply(null, self._buffer8),
                buflen: self._bufferLength,
                length: self._dataLength,
                state: [s[0], s[1], s[2], s[3]]
            };
        };
        Md5.prototype.setState = function (state) {
            var buf = state.buffer;
            var x = state.state;
            var s = this._state;
            var i;
            this._dataLength = state.length;
            this._bufferLength = state.buflen;
            s[0] = x[0];
            s[1] = x[1];
            s[2] = x[2];
            s[3] = x[3];
            for (i = 0; i < buf.length; i += 1) {
                this._buffer8[i] = buf.charCodeAt(i);
            }
        };
        Md5.prototype.end = function (raw) {
            if (raw === void 0) { raw = false; }
            var bufLen = this._bufferLength;
            var buf8 = this._buffer8;
            var buf32 = this._buffer32;
            var i = (bufLen >> 2) + 1;
            var dataBitsLen;
            this._dataLength += bufLen;
            buf8[bufLen] = 0x80;
            buf8[bufLen + 1] = buf8[bufLen + 2] = buf8[bufLen + 3] = 0;
            buf32.set(Md5.buffer32Identity.subarray(i), i);
            if (bufLen > 55) {
                Md5._md5cycle(this._state, buf32);
                buf32.set(Md5.buffer32Identity);
            }
            dataBitsLen = this._dataLength * 8;
            if (dataBitsLen <= 0xFFFFFFFF) {
                buf32[14] = dataBitsLen;
            }
            else {
                var matches = dataBitsLen.toString(16).match(/(.*?)(.{0,8})$/);
                if (matches === null) {
                    return null;
                }
                var lo = parseInt(matches[2], 16);
                var hi = parseInt(matches[1], 16) || 0;
                buf32[14] = lo;
                buf32[15] = hi;
            }
            Md5._md5cycle(this._state, buf32);
            return raw ? this._state : Md5._hex(this._state);
        };
        Md5.stateIdentity = new Int32Array([1732584193, -271733879, -1732584194, 271733878]);
        Md5.buffer32Identity = new Int32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        Md5.hexChars = '0123456789abcdef';
        Md5.hexOut = [];
        Md5.onePassHasher = new Md5();
        return Md5;
    }());
    exports.default = Md5;
});
define("Look/API/Session", ["require", "exports", "Look/API/Request", "Look/Waiter/Queryable", "Lib/Md5", "Look/API/Token"], function (require, exports, Request_1, Queryable_2, Md5_1, Token_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.apiSessionClass = 'Session';
    exports.apiOpenSessionMethod = 'open';
    var Session = (function () {
        function Session(login, pass) {
            this.token = null;
            this.apiUrl = '/api/';
            this.login = login;
            this.signature = Md5_1.default.hashStr(pass + login).toString();
        }
        Session.prototype.getApiServerUrl = function () {
            return this.apiUrl;
        };
        Session.prototype.setApiServerUrl = function (url) {
            this.apiUrl = url;
            return this;
        };
        Session.prototype.isExpired = function () {
            return this.token && this.token.isExpired();
        };
        Session.prototype.open = function (expires, delay, timeout) {
            if (expires === void 0) { expires = 0; }
            var self = this;
            var data = {
                login: self.login,
                signature: self.signature,
                expires: expires
            };
            var requestData = new Request_1.RequestData(self.apiUrl, exports.apiSessionClass, exports.apiOpenSessionMethod, self.token, data, false, Request_1.RequestMethod.GET);
            return new Queryable_2.default(function () {
                var requestWaiter = this;
                var request = new Request_1.Request(requestData, delay, timeout);
                request
                    .onAbort(function (data) { requestWaiter.callbackAbort(data); })
                    .onStart(function (data) { requestWaiter.callbackStart(data); })
                    .onTimeout(function (data) { requestWaiter.callbackError(data); })
                    .onError(function (err) { requestWaiter.callbackError(err); })
                    .onSuccess(function (data) {
                    self.token = new Token_2.Token(data.access_token, data.expires_in, data.public_key, data.private_key);
                    requestWaiter.callbackSuccess(self);
                });
            }, delay);
        };
        Session.prototype.get = function (method, data, tunnel, requestMethod) {
            if (tunnel === void 0) { tunnel = false; }
            if (requestMethod === void 0) { requestMethod = Request_1.RequestMethod.GET; }
            var classAndMethod = method.split('.');
            if (classAndMethod.length != 2) {
                throw new Error('bad class or method name');
            }
            return new Request_1.Request(new Request_1.RequestData(this.apiUrl, classAndMethod[0], classAndMethod[1], this.token, data, tunnel, requestMethod));
        };
        return Session;
    }());
    exports.Session = Session;
    exports.default = Session;
});
define("main", ["require", "exports", "Look/Use/QueryData", "Look/API/Session"], function (require, exports, QueryData_3, Session_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var session = new Session_1.default('user', 'pass');
    session.open(10)
        .onError(function (data) {
        this.repeat(2000);
    })
        .onSuccess(function () {
        var value1 = 'hello test';
        var value2 = 'hello is 2';
        session.get('Tunnel.checkTunnelTokenIn', { data1: value1, data2: value2 }, true, QueryData_3.QueryMethod.POST)
            .onSuccess(function (data) {
            console.log(data);
        }).onError(function (data) {
            console.log(data);
        });
        session.get('Tunnel.checkTunnelTokenOut')
            .onSuccess(function (data) {
            console.log(session.token.privateKey.decrypt(data));
        });
        setTimeout(function () {
            session.get('Tunnel.checkTunnelTokenIn', { data: value1 }, true, QueryData_3.QueryMethod.POST)
                .onSuccess(function (data) {
                console.log(data);
            }).onError(function (data) {
                console.log(data);
            });
        }, 11000);
    });
});
define("Lib/JSEncrypt/JSEncrypt", ["require", "exports", "Lib/jsbn/base64", "Lib/jsencrypt/JSEncryptRSAKey"], function (require, exports, base64_3, JSEncryptRSAKey_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var JSEncrypt = (function () {
        function JSEncrypt(options) {
            options = options || {};
            this.default_key_size = parseInt(options.default_key_size, 10) || 1024;
            this.default_public_exponent = options.default_public_exponent || "010001";
            this.log = options.log || false;
            this.key = null;
        }
        JSEncrypt.prototype.setKey = function (key) {
            if (this.log && this.key) {
                console.warn("A key was already set, overriding existing.");
            }
            this.key = new JSEncryptRSAKey_2.JSEncryptRSAKey(key);
        };
        JSEncrypt.prototype.setPrivateKey = function (privkey) {
            this.setKey(privkey);
        };
        JSEncrypt.prototype.setPublicKey = function (pubkey) {
            this.setKey(pubkey);
        };
        JSEncrypt.prototype.decrypt = function (str) {
            try {
                return this.getKey().decrypt(base64_3.b64tohex(str));
            }
            catch (ex) {
                return false;
            }
        };
        JSEncrypt.prototype.encrypt = function (str) {
            try {
                return base64_3.hex2b64(this.getKey().encrypt(str));
            }
            catch (ex) {
                return false;
            }
        };
        JSEncrypt.prototype.sign = function (str, digestMethod, digestName) {
            try {
                return base64_3.hex2b64(this.getKey().sign(str, digestMethod, digestName));
            }
            catch (ex) {
                return false;
            }
        };
        JSEncrypt.prototype.verify = function (str, signature, digestMethod) {
            try {
                return this.getKey().verify(str, base64_3.b64tohex(signature), digestMethod);
            }
            catch (ex) {
                return false;
            }
        };
        JSEncrypt.prototype.getKey = function (cb) {
            if (!this.key) {
                this.key = new JSEncryptRSAKey_2.JSEncryptRSAKey();
                if (cb && {}.toString.call(cb) === "[object Function]") {
                    this.key.generateAsync(this.default_key_size, this.default_public_exponent, cb);
                    return null;
                }
                this.key.generate(this.default_key_size, this.default_public_exponent);
            }
            return this.key;
        };
        JSEncrypt.prototype.getPrivateKey = function () {
            return this.getKey().getPrivateKey();
        };
        JSEncrypt.prototype.getPrivateKeyB64 = function () {
            return this.getKey().getPrivateBaseKeyB64();
        };
        JSEncrypt.prototype.getPublicKey = function () {
            return this.getKey().getPublicKey();
        };
        JSEncrypt.prototype.getPublicKeyB64 = function () {
            return this.getKey().getPublicBaseKeyB64();
        };
        JSEncrypt.version = JSENCRYPT_VERSION;
        return JSEncrypt;
    }());
    exports.default = JSEncrypt;
});
define("Lib/asn1js/oids", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.oids = {
        "0.2.262.1.10": { "d": "Telesec", "c": "Deutsche Telekom", "w": false },
        "0.2.262.1.10.0": { "d": "extension", "c": "Telesec", "w": false },
        "0.2.262.1.10.1": { "d": "mechanism", "c": "Telesec", "w": false },
        "0.2.262.1.10.1.0": { "d": "authentication", "c": "Telesec mechanism", "w": false },
        "0.2.262.1.10.1.0.1": { "d": "passwordAuthentication", "c": "Telesec authentication", "w": false },
        "0.2.262.1.10.1.0.2": { "d": "protectedPasswordAuthentication", "c": "Telesec authentication", "w": false },
        "0.2.262.1.10.1.0.3": { "d": "oneWayX509Authentication", "c": "Telesec authentication", "w": false },
        "0.2.262.1.10.1.0.4": { "d": "twoWayX509Authentication", "c": "Telesec authentication", "w": false },
        "0.2.262.1.10.1.0.5": { "d": "threeWayX509Authentication", "c": "Telesec authentication", "w": false },
        "0.2.262.1.10.1.0.6": { "d": "oneWayISO9798Authentication", "c": "Telesec authentication", "w": false },
        "0.2.262.1.10.1.0.7": { "d": "twoWayISO9798Authentication", "c": "Telesec authentication", "w": false },
        "0.2.262.1.10.1.0.8": { "d": "telekomAuthentication", "c": "Telesec authentication", "w": false },
        "0.2.262.1.10.1.1": { "d": "signature", "c": "Telesec mechanism", "w": false },
        "0.2.262.1.10.1.1.1": { "d": "md4WithRSAAndISO9697", "c": "Telesec mechanism", "w": false },
        "0.2.262.1.10.1.1.2": { "d": "md4WithRSAAndTelesecSignatureStandard", "c": "Telesec mechanism", "w": false },
        "0.2.262.1.10.1.1.3": { "d": "md5WithRSAAndISO9697", "c": "Telesec mechanism", "w": false },
        "0.2.262.1.10.1.1.4": { "d": "md5WithRSAAndTelesecSignatureStandard", "c": "Telesec mechanism", "w": false },
        "0.2.262.1.10.1.1.5": { "d": "ripemd160WithRSAAndTelekomSignatureStandard", "c": "Telesec mechanism", "w": false },
        "0.2.262.1.10.1.1.9": { "d": "hbciRsaSignature", "c": "Telesec signature", "w": false },
        "0.2.262.1.10.1.2": { "d": "encryption", "c": "Telesec mechanism", "w": false },
        "0.2.262.1.10.1.2.0": { "d": "none", "c": "Telesec encryption", "w": false },
        "0.2.262.1.10.1.2.1": { "d": "rsaTelesec", "c": "Telesec encryption", "w": false },
        "0.2.262.1.10.1.2.2": { "d": "des", "c": "Telesec encryption", "w": false },
        "0.2.262.1.10.1.2.2.1": { "d": "desECB", "c": "Telesec encryption", "w": false },
        "0.2.262.1.10.1.2.2.2": { "d": "desCBC", "c": "Telesec encryption", "w": false },
        "0.2.262.1.10.1.2.2.3": { "d": "desOFB", "c": "Telesec encryption", "w": false },
        "0.2.262.1.10.1.2.2.4": { "d": "desCFB8", "c": "Telesec encryption", "w": false },
        "0.2.262.1.10.1.2.2.5": { "d": "desCFB64", "c": "Telesec encryption", "w": false },
        "0.2.262.1.10.1.2.3": { "d": "des3", "c": "Telesec encryption", "w": false },
        "0.2.262.1.10.1.2.3.1": { "d": "des3ECB", "c": "Telesec encryption", "w": false },
        "0.2.262.1.10.1.2.3.2": { "d": "des3CBC", "c": "Telesec encryption", "w": false },
        "0.2.262.1.10.1.2.3.3": { "d": "des3OFB", "c": "Telesec encryption", "w": false },
        "0.2.262.1.10.1.2.3.4": { "d": "des3CFB8", "c": "Telesec encryption", "w": false },
        "0.2.262.1.10.1.2.3.5": { "d": "des3CFB64", "c": "Telesec encryption", "w": false },
        "0.2.262.1.10.1.2.4": { "d": "magenta", "c": "Telesec encryption", "w": false },
        "0.2.262.1.10.1.2.5": { "d": "idea", "c": "Telesec encryption", "w": false },
        "0.2.262.1.10.1.2.5.1": { "d": "ideaECB", "c": "Telesec encryption", "w": false },
        "0.2.262.1.10.1.2.5.2": { "d": "ideaCBC", "c": "Telesec encryption", "w": false },
        "0.2.262.1.10.1.2.5.3": { "d": "ideaOFB", "c": "Telesec encryption", "w": false },
        "0.2.262.1.10.1.2.5.4": { "d": "ideaCFB8", "c": "Telesec encryption", "w": false },
        "0.2.262.1.10.1.2.5.5": { "d": "ideaCFB64", "c": "Telesec encryption", "w": false },
        "0.2.262.1.10.1.3": { "d": "oneWayFunction", "c": "Telesec mechanism", "w": false },
        "0.2.262.1.10.1.3.1": { "d": "md4", "c": "Telesec one-way function", "w": false },
        "0.2.262.1.10.1.3.2": { "d": "md5", "c": "Telesec one-way function", "w": false },
        "0.2.262.1.10.1.3.3": { "d": "sqModNX509", "c": "Telesec one-way function", "w": false },
        "0.2.262.1.10.1.3.4": { "d": "sqModNISO", "c": "Telesec one-way function", "w": false },
        "0.2.262.1.10.1.3.5": { "d": "ripemd128", "c": "Telesec one-way function", "w": false },
        "0.2.262.1.10.1.3.6": { "d": "hashUsingBlockCipher", "c": "Telesec one-way function", "w": false },
        "0.2.262.1.10.1.3.7": { "d": "mac", "c": "Telesec one-way function", "w": false },
        "0.2.262.1.10.1.3.8": { "d": "ripemd160", "c": "Telesec one-way function", "w": false },
        "0.2.262.1.10.1.4": { "d": "fecFunction", "c": "Telesec mechanism", "w": false },
        "0.2.262.1.10.1.4.1": { "d": "reedSolomon", "c": "Telesec mechanism", "w": false },
        "0.2.262.1.10.2": { "d": "module", "c": "Telesec", "w": false },
        "0.2.262.1.10.2.0": { "d": "algorithms", "c": "Telesec module", "w": false },
        "0.2.262.1.10.2.1": { "d": "attributeTypes", "c": "Telesec module", "w": false },
        "0.2.262.1.10.2.2": { "d": "certificateTypes", "c": "Telesec module", "w": false },
        "0.2.262.1.10.2.3": { "d": "messageTypes", "c": "Telesec module", "w": false },
        "0.2.262.1.10.2.4": { "d": "plProtocol", "c": "Telesec module", "w": false },
        "0.2.262.1.10.2.5": { "d": "smeAndComponentsOfSme", "c": "Telesec module", "w": false },
        "0.2.262.1.10.2.6": { "d": "fec", "c": "Telesec module", "w": false },
        "0.2.262.1.10.2.7": { "d": "usefulDefinitions", "c": "Telesec module", "w": false },
        "0.2.262.1.10.2.8": { "d": "stefiles", "c": "Telesec module", "w": false },
        "0.2.262.1.10.2.9": { "d": "sadmib", "c": "Telesec module", "w": false },
        "0.2.262.1.10.2.10": { "d": "electronicOrder", "c": "Telesec module", "w": false },
        "0.2.262.1.10.2.11": { "d": "telesecTtpAsymmetricApplication", "c": "Telesec module", "w": false },
        "0.2.262.1.10.2.12": { "d": "telesecTtpBasisApplication", "c": "Telesec module", "w": false },
        "0.2.262.1.10.2.13": { "d": "telesecTtpMessages", "c": "Telesec module", "w": false },
        "0.2.262.1.10.2.14": { "d": "telesecTtpTimeStampApplication", "c": "Telesec module", "w": false },
        "0.2.262.1.10.3": { "d": "objectClass", "c": "Telesec", "w": false },
        "0.2.262.1.10.3.0": { "d": "telesecOtherName", "c": "Telesec object class", "w": false },
        "0.2.262.1.10.3.1": { "d": "directory", "c": "Telesec object class", "w": false },
        "0.2.262.1.10.3.2": { "d": "directoryType", "c": "Telesec object class", "w": false },
        "0.2.262.1.10.3.3": { "d": "directoryGroup", "c": "Telesec object class", "w": false },
        "0.2.262.1.10.3.4": { "d": "directoryUser", "c": "Telesec object class", "w": false },
        "0.2.262.1.10.3.5": { "d": "symmetricKeyEntry", "c": "Telesec object class", "w": false },
        "0.2.262.1.10.4": { "d": "package", "c": "Telesec", "w": false },
        "0.2.262.1.10.5": { "d": "parameter", "c": "Telesec", "w": false },
        "0.2.262.1.10.6": { "d": "nameBinding", "c": "Telesec", "w": false },
        "0.2.262.1.10.7": { "d": "attribute", "c": "Telesec", "w": false },
        "0.2.262.1.10.7.0": { "d": "applicationGroupIdentifier", "c": "Telesec attribute", "w": false },
        "0.2.262.1.10.7.1": { "d": "certificateType", "c": "Telesec attribute", "w": false },
        "0.2.262.1.10.7.2": { "d": "telesecCertificate", "c": "Telesec attribute", "w": false },
        "0.2.262.1.10.7.3": { "d": "certificateNumber", "c": "Telesec attribute", "w": false },
        "0.2.262.1.10.7.4": { "d": "certificateRevocationList", "c": "Telesec attribute", "w": false },
        "0.2.262.1.10.7.5": { "d": "creationDate", "c": "Telesec attribute", "w": false },
        "0.2.262.1.10.7.6": { "d": "issuer", "c": "Telesec attribute", "w": false },
        "0.2.262.1.10.7.7": { "d": "namingAuthority", "c": "Telesec attribute", "w": false },
        "0.2.262.1.10.7.8": { "d": "publicKeyDirectory", "c": "Telesec attribute", "w": false },
        "0.2.262.1.10.7.9": { "d": "securityDomain", "c": "Telesec attribute", "w": false },
        "0.2.262.1.10.7.10": { "d": "subject", "c": "Telesec attribute", "w": false },
        "0.2.262.1.10.7.11": { "d": "timeOfRevocation", "c": "Telesec attribute", "w": false },
        "0.2.262.1.10.7.12": { "d": "userGroupReference", "c": "Telesec attribute", "w": false },
        "0.2.262.1.10.7.13": { "d": "validity", "c": "Telesec attribute", "w": false },
        "0.2.262.1.10.7.14": { "d": "zert93", "c": "Telesec attribute", "w": false },
        "0.2.262.1.10.7.15": { "d": "securityMessEnv", "c": "Telesec attribute", "w": false },
        "0.2.262.1.10.7.16": { "d": "anonymizedPublicKeyDirectory", "c": "Telesec attribute", "w": false },
        "0.2.262.1.10.7.17": { "d": "telesecGivenName", "c": "Telesec attribute", "w": false },
        "0.2.262.1.10.7.18": { "d": "nameAdditions", "c": "Telesec attribute", "w": false },
        "0.2.262.1.10.7.19": { "d": "telesecPostalCode", "c": "Telesec attribute", "w": false },
        "0.2.262.1.10.7.20": { "d": "nameDistinguisher", "c": "Telesec attribute", "w": false },
        "0.2.262.1.10.7.21": { "d": "telesecCertificateList", "c": "Telesec attribute", "w": false },
        "0.2.262.1.10.7.22": { "d": "teletrustCertificateList", "c": "Telesec attribute", "w": false },
        "0.2.262.1.10.7.23": { "d": "x509CertificateList", "c": "Telesec attribute", "w": false },
        "0.2.262.1.10.7.24": { "d": "timeOfIssue", "c": "Telesec attribute", "w": false },
        "0.2.262.1.10.7.25": { "d": "physicalCardNumber", "c": "Telesec attribute", "w": false },
        "0.2.262.1.10.7.26": { "d": "fileType", "c": "Telesec attribute", "w": false },
        "0.2.262.1.10.7.27": { "d": "ctlFileIsArchive", "c": "Telesec attribute", "w": false },
        "0.2.262.1.10.7.28": { "d": "emailAddress", "c": "Telesec attribute", "w": false },
        "0.2.262.1.10.7.29": { "d": "certificateTemplateList", "c": "Telesec attribute", "w": false },
        "0.2.262.1.10.7.30": { "d": "directoryName", "c": "Telesec attribute", "w": false },
        "0.2.262.1.10.7.31": { "d": "directoryTypeName", "c": "Telesec attribute", "w": false },
        "0.2.262.1.10.7.32": { "d": "directoryGroupName", "c": "Telesec attribute", "w": false },
        "0.2.262.1.10.7.33": { "d": "directoryUserName", "c": "Telesec attribute", "w": false },
        "0.2.262.1.10.7.34": { "d": "revocationFlag", "c": "Telesec attribute", "w": false },
        "0.2.262.1.10.7.35": { "d": "symmetricKeyEntryName", "c": "Telesec attribute", "w": false },
        "0.2.262.1.10.7.36": { "d": "glNumber", "c": "Telesec attribute", "w": false },
        "0.2.262.1.10.7.37": { "d": "goNumber", "c": "Telesec attribute", "w": false },
        "0.2.262.1.10.7.38": { "d": "gKeyData", "c": "Telesec attribute", "w": false },
        "0.2.262.1.10.7.39": { "d": "zKeyData", "c": "Telesec attribute", "w": false },
        "0.2.262.1.10.7.40": { "d": "ktKeyData", "c": "Telesec attribute", "w": false },
        "0.2.262.1.10.7.41": { "d": "ktKeyNumber", "c": "Telesec attribute", "w": false },
        "0.2.262.1.10.7.51": { "d": "timeOfRevocationGen", "c": "Telesec attribute", "w": false },
        "0.2.262.1.10.7.52": { "d": "liabilityText", "c": "Telesec attribute", "w": false },
        "0.2.262.1.10.8": { "d": "attributeGroup", "c": "Telesec", "w": false },
        "0.2.262.1.10.9": { "d": "action", "c": "Telesec", "w": false },
        "0.2.262.1.10.10": { "d": "notification", "c": "Telesec", "w": false },
        "0.2.262.1.10.11": { "d": "snmp-mibs", "c": "Telesec", "w": false },
        "0.2.262.1.10.11.1": { "d": "securityApplication", "c": "Telesec SNMP MIBs", "w": false },
        "0.2.262.1.10.12": { "d": "certAndCrlExtensionDefinitions", "c": "Telesec", "w": false },
        "0.2.262.1.10.12.0": { "d": "liabilityLimitationFlag", "c": "Telesec cert/CRL extension", "w": false },
        "0.2.262.1.10.12.1": { "d": "telesecCertIdExt", "c": "Telesec cert/CRL extension", "w": false },
        "0.2.262.1.10.12.2": { "d": "Telesec policyIdentifier", "c": "Telesec cert/CRL extension", "w": false },
        "0.2.262.1.10.12.3": { "d": "telesecPolicyQualifierID", "c": "Telesec cert/CRL extension", "w": false },
        "0.2.262.1.10.12.4": { "d": "telesecCRLFilteredExt", "c": "Telesec cert/CRL extension", "w": false },
        "0.2.262.1.10.12.5": { "d": "telesecCRLFilterExt", "c": "Telesec cert/CRL extension", "w": false },
        "0.2.262.1.10.12.6": { "d": "telesecNamingAuthorityExt", "c": "Telesec cert/CRL extension", "w": false },
        "0.4.0.127.0.7": { "d": "bsi", "c": "BSI TR-03110/TR-03111", "w": false },
        "0.4.0.127.0.7.1": { "d": "bsiEcc", "c": "BSI TR-03111", "w": false },
        "0.4.0.127.0.7.1.1": { "d": "bsifieldType", "c": "BSI TR-03111", "w": false },
        "0.4.0.127.0.7.1.1.1": { "d": "bsiPrimeField", "c": "BSI TR-03111", "w": false },
        "0.4.0.127.0.7.1.1.2": { "d": "bsiCharacteristicTwoField", "c": "BSI TR-03111", "w": false },
        "0.4.0.127.0.7.1.1.2.3": { "d": "bsiCharacteristicTwoBasis", "c": "BSI TR-03111", "w": false },
        "0.4.0.127.0.7.1.1.2.3.1": { "d": "bsiGnBasis", "c": "BSI TR-03111", "w": false },
        "0.4.0.127.0.7.1.1.2.3.2": { "d": "bsiTpBasis", "c": "BSI TR-03111", "w": false },
        "0.4.0.127.0.7.1.1.2.3.3": { "d": "bsiPpBasis", "c": "BSI TR-03111", "w": false },
        "0.4.0.127.0.7.1.1.4.1": { "d": "bsiEcdsaSignatures", "c": "BSI TR-03111", "w": false },
        "0.4.0.127.0.7.1.1.4.1.1": { "d": "bsiEcdsaWithSHA1", "c": "BSI TR-03111", "w": false },
        "0.4.0.127.0.7.1.1.4.1.2": { "d": "bsiEcdsaWithSHA224", "c": "BSI TR-03111", "w": false },
        "0.4.0.127.0.7.1.1.4.1.3": { "d": "bsiEcdsaWithSHA256", "c": "BSI TR-03111", "w": false },
        "0.4.0.127.0.7.1.1.4.1.4": { "d": "bsiEcdsaWithSHA384", "c": "BSI TR-03111", "w": false },
        "0.4.0.127.0.7.1.1.4.1.5": { "d": "bsiEcdsaWithSHA512", "c": "BSI TR-03111", "w": false },
        "0.4.0.127.0.7.1.1.4.1.6": { "d": "bsiEcdsaWithRIPEMD160", "c": "BSI TR-03111", "w": false },
        "0.4.0.127.0.7.1.2": { "d": "bsiEcKeyType", "c": "BSI TR-03111", "w": false },
        "0.4.0.127.0.7.1.2.1": { "d": "bsiEcPublicKey", "c": "BSI TR-03111", "w": false },
        "0.4.0.127.0.7.1.5.1": { "d": "bsiKaeg", "c": "BSI TR-03111", "w": false },
        "0.4.0.127.0.7.1.5.1.1": { "d": "bsiKaegWithX963KDF", "c": "BSI TR-03111", "w": false },
        "0.4.0.127.0.7.1.5.1.2": { "d": "bsiKaegWith3DESKDF", "c": "BSI TR-03111", "w": false },
        "0.4.0.127.0.7.2.2.1": { "d": "bsiPK", "c": "BSI TR-03110. Formerly known as bsiCA, now moved to ...2.2.3.x", "w": false },
        "0.4.0.127.0.7.2.2.1.1": { "d": "bsiPK_DH", "c": "BSI TR-03110. Formerly known as bsiCA_DH, now moved to ...2.2.3.x", "w": false },
        "0.4.0.127.0.7.2.2.1.2": { "d": "bsiPK_ECDH", "c": "BSI TR-03110. Formerly known as bsiCA_ECDH, now moved to ...2.2.3.x", "w": false },
        "0.4.0.127.0.7.2.2.2": { "d": "bsiTA", "c": "BSI TR-03110", "w": false },
        "0.4.0.127.0.7.2.2.2.1": { "d": "bsiTA_RSA", "c": "BSI TR-03110", "w": false },
        "0.4.0.127.0.7.2.2.2.1.1": { "d": "bsiTA_RSAv1_5_SHA1", "c": "BSI TR-03110", "w": false },
        "0.4.0.127.0.7.2.2.2.1.2": { "d": "bsiTA_RSAv1_5_SHA256", "c": "BSI TR-03110", "w": false },
        "0.4.0.127.0.7.2.2.2.1.3": { "d": "bsiTA_RSAPSS_SHA1", "c": "BSI TR-03110", "w": false },
        "0.4.0.127.0.7.2.2.2.1.4": { "d": "bsiTA_RSAPSS_SHA256", "c": "BSI TR-03110", "w": false },
        "0.4.0.127.0.7.2.2.2.2": { "d": "bsiTA_ECDSA", "c": "BSI TR-03110", "w": false },
        "0.4.0.127.0.7.2.2.2.2.1": { "d": "bsiTA_ECDSA_SHA1", "c": "BSI TR-03110", "w": false },
        "0.4.0.127.0.7.2.2.2.2.2": { "d": "bsiTA_ECDSA_SHA224", "c": "BSI TR-03110", "w": false },
        "0.4.0.127.0.7.2.2.2.2.3": { "d": "bsiTA_ECDSA_SHA256", "c": "BSI TR-03110", "w": false },
        "0.4.0.127.0.7.2.2.3": { "d": "bsiCA", "c": "BSI TR-03110", "w": false },
        "0.4.0.127.0.7.2.2.3.1": { "d": "bsiCA_DH", "c": "BSI TR-03110", "w": false },
        "0.4.0.127.0.7.2.2.3.2": { "d": "bsiCA_ECDH", "c": "BSI TR-03110", "w": false },
        "0.4.0.127.0.7.3.1.2.1": { "d": "bsiRoleEAC", "c": "BSI TR-03110", "w": false },
        "0.4.0.1862": { "d": "etsiQcsProfile", "c": "ETSI TS 101 862 qualified certificates", "w": false },
        "0.4.0.1862.1": { "d": "etsiQcs", "c": "ETSI TS 101 862 qualified certificates", "w": false },
        "0.4.0.1862.1.1": { "d": "etsiQcsCompliance", "c": "ETSI TS 101 862 qualified certificates", "w": false },
        "0.4.0.1862.1.2": { "d": "etsiQcsLimitValue", "c": "ETSI TS 101 862 qualified certificates", "w": false },
        "0.4.0.1862.1.3": { "d": "etsiQcsRetentionPeriod", "c": "ETSI TS 101 862 qualified certificates", "w": false },
        "0.4.0.1862.1.4": { "d": "etsiQcsQcSSCD", "c": "ETSI TS 101 862 qualified certificates", "w": false },
        "0.9.2342.19200300.100.1.1": { "d": "userID", "c": "Some oddball X.500 attribute collection", "w": false },
        "0.9.2342.19200300.100.1.3": { "d": "rfc822Mailbox", "c": "Some oddball X.500 attribute collection", "w": false },
        "0.9.2342.19200300.100.1.25": { "d": "domainComponent", "c": "Men are from Mars, this OID is from Pluto", "w": false },
        "1.0.10118.3.0.49": { "d": "ripemd160", "c": "ISO 10118-3 hash function", "w": false },
        "1.0.10118.3.0.50": { "d": "ripemd128", "c": "ISO 10118-3 hash function", "w": false },
        "1.0.10118.3.0.55": { "d": "whirlpool", "c": "ISO 10118-3 hash function", "w": false },
        "1.2.36.1.3.1.1.1": { "d": "qgpki", "c": "Queensland Government PKI", "w": false },
        "1.2.36.1.3.1.1.1.1": { "d": "qgpkiPolicies", "c": "QGPKI policies", "w": false },
        "1.2.36.1.3.1.1.1.1.1": { "d": "qgpkiMedIntermedCA", "c": "QGPKI policy", "w": false },
        "1.2.36.1.3.1.1.1.1.1.1": { "d": "qgpkiMedIntermedIndividual", "c": "QGPKI policy", "w": false },
        "1.2.36.1.3.1.1.1.1.1.2": { "d": "qgpkiMedIntermedDeviceControl", "c": "QGPKI policy", "w": false },
        "1.2.36.1.3.1.1.1.1.1.3": { "d": "qgpkiMedIntermedDevice", "c": "QGPKI policy", "w": false },
        "1.2.36.1.3.1.1.1.1.1.4": { "d": "qgpkiMedIntermedAuthorisedParty", "c": "QGPKI policy", "w": false },
        "1.2.36.1.3.1.1.1.1.1.5": { "d": "qgpkiMedIntermedDeviceSystem", "c": "QGPKI policy", "w": false },
        "1.2.36.1.3.1.1.1.1.2": { "d": "qgpkiMedIssuingCA", "c": "QGPKI policy", "w": false },
        "1.2.36.1.3.1.1.1.1.2.1": { "d": "qgpkiMedIssuingIndividual", "c": "QGPKI policy", "w": false },
        "1.2.36.1.3.1.1.1.1.2.2": { "d": "qgpkiMedIssuingDeviceControl", "c": "QGPKI policy", "w": false },
        "1.2.36.1.3.1.1.1.1.2.3": { "d": "qgpkiMedIssuingDevice", "c": "QGPKI policy", "w": false },
        "1.2.36.1.3.1.1.1.1.2.4": { "d": "qgpkiMedIssuingAuthorisedParty", "c": "QGPKI policy", "w": false },
        "1.2.36.1.3.1.1.1.1.2.5": { "d": "qgpkiMedIssuingClientAuth", "c": "QGPKI policy", "w": false },
        "1.2.36.1.3.1.1.1.1.2.6": { "d": "qgpkiMedIssuingServerAuth", "c": "QGPKI policy", "w": false },
        "1.2.36.1.3.1.1.1.1.2.7": { "d": "qgpkiMedIssuingDataProt", "c": "QGPKI policy", "w": false },
        "1.2.36.1.3.1.1.1.1.2.8": { "d": "qgpkiMedIssuingTokenAuth", "c": "QGPKI policy", "w": false },
        "1.2.36.1.3.1.1.1.1.3": { "d": "qgpkiBasicIntermedCA", "c": "QGPKI policy", "w": false },
        "1.2.36.1.3.1.1.1.1.3.1": { "d": "qgpkiBasicIntermedDeviceSystem", "c": "QGPKI policy", "w": false },
        "1.2.36.1.3.1.1.1.1.4": { "d": "qgpkiBasicIssuingCA", "c": "QGPKI policy", "w": false },
        "1.2.36.1.3.1.1.1.1.4.1": { "d": "qgpkiBasicIssuingClientAuth", "c": "QGPKI policy", "w": false },
        "1.2.36.1.3.1.1.1.1.4.2": { "d": "qgpkiBasicIssuingServerAuth", "c": "QGPKI policy", "w": false },
        "1.2.36.1.3.1.1.1.1.4.3": { "d": "qgpkiBasicIssuingDataSigning", "c": "QGPKI policy", "w": false },
        "1.2.36.1.3.1.1.1.2": { "d": "qgpkiAssuranceLevel", "c": "QGPKI assurance level", "w": false },
        "1.2.36.1.3.1.1.1.2.1": { "d": "qgpkiAssuranceRudimentary", "c": "QGPKI assurance level", "w": false },
        "1.2.36.1.3.1.1.1.2.2": { "d": "qgpkiAssuranceBasic", "c": "QGPKI assurance level", "w": false },
        "1.2.36.1.3.1.1.1.2.3": { "d": "qgpkiAssuranceMedium", "c": "QGPKI assurance level", "w": false },
        "1.2.36.1.3.1.1.1.2.4": { "d": "qgpkiAssuranceHigh", "c": "QGPKI assurance level", "w": false },
        "1.2.36.1.3.1.1.1.3": { "d": "qgpkiCertFunction", "c": "QGPKI policies", "w": false },
        "1.2.36.1.3.1.1.1.3.1": { "d": "qgpkiFunctionIndividual", "c": "QGPKI policies", "w": false },
        "1.2.36.1.3.1.1.1.3.2": { "d": "qgpkiFunctionDevice", "c": "QGPKI policies", "w": false },
        "1.2.36.1.3.1.1.1.3.3": { "d": "qgpkiFunctionAuthorisedParty", "c": "QGPKI policies", "w": false },
        "1.2.36.1.3.1.1.1.3.4": { "d": "qgpkiFunctionDeviceControl", "c": "QGPKI policies", "w": false },
        "1.2.36.1.3.1.2": { "d": "qpspki", "c": "Queensland Police PKI", "w": false },
        "1.2.36.1.3.1.2.1": { "d": "qpspkiPolicies", "c": "Queensland Police PKI", "w": false },
        "1.2.36.1.3.1.2.1.2": { "d": "qpspkiPolicyBasic", "c": "Queensland Police PKI", "w": false },
        "1.2.36.1.3.1.2.1.3": { "d": "qpspkiPolicyMedium", "c": "Queensland Police PKI", "w": false },
        "1.2.36.1.3.1.2.1.4": { "d": "qpspkiPolicyHigh", "c": "Queensland Police PKI", "w": false },
        "1.2.36.1.3.1.3.2": { "d": "qtmrpki", "c": "Queensland Transport PKI", "w": false },
        "1.2.36.1.3.1.3.2.1": { "d": "qtmrpkiPolicies", "c": "Queensland Transport PKI", "w": false },
        "1.2.36.1.3.1.3.2.2": { "d": "qtmrpkiPurpose", "c": "Queensland Transport PKI", "w": false },
        "1.2.36.1.3.1.3.2.2.1": { "d": "qtmrpkiIndividual", "c": "Queensland Transport PKI purpose", "w": false },
        "1.2.36.1.3.1.3.2.2.2": { "d": "qtmrpkiDeviceControl", "c": "Queensland Transport PKI purpose", "w": false },
        "1.2.36.1.3.1.3.2.2.3": { "d": "qtmrpkiDevice", "c": "Queensland Transport PKI purpose", "w": false },
        "1.2.36.1.3.1.3.2.2.4": { "d": "qtmrpkiAuthorisedParty", "c": "Queensland Transport PKI purpose", "w": false },
        "1.2.36.1.3.1.3.2.2.5": { "d": "qtmrpkiDeviceSystem", "c": "Queensland Transport PKI purpose", "w": false },
        "1.2.36.1.3.1.3.2.3": { "d": "qtmrpkiDevice", "c": "Queensland Transport PKI", "w": false },
        "1.2.36.1.3.1.3.2.3.1": { "d": "qtmrpkiDriverLicense", "c": "Queensland Transport PKI device", "w": false },
        "1.2.36.1.3.1.3.2.3.2": { "d": "qtmrpkiIndustryAuthority", "c": "Queensland Transport PKI device", "w": false },
        "1.2.36.1.3.1.3.2.3.3": { "d": "qtmrpkiMarineLicense", "c": "Queensland Transport PKI device", "w": false },
        "1.2.36.1.3.1.3.2.3.4": { "d": "qtmrpkiAdultProofOfAge", "c": "Queensland Transport PKI device", "w": false },
        "1.2.36.1.3.1.3.2.3.5": { "d": "qtmrpkiSam", "c": "Queensland Transport PKI device", "w": false },
        "1.2.36.1.3.1.3.2.4": { "d": "qtmrpkiAuthorisedParty", "c": "Queensland Transport PKI", "w": false },
        "1.2.36.1.3.1.3.2.4.1": { "d": "qtmrpkiTransportInspector", "c": "Queensland Transport PKI authorised party", "w": false },
        "1.2.36.1.3.1.3.2.4.2": { "d": "qtmrpkiPoliceOfficer", "c": "Queensland Transport PKI authorised party", "w": false },
        "1.2.36.1.3.1.3.2.4.3": { "d": "qtmrpkiSystem", "c": "Queensland Transport PKI authorised party", "w": false },
        "1.2.36.1.3.1.3.2.4.4": { "d": "qtmrpkiLiquorLicensingInspector", "c": "Queensland Transport PKI authorised party", "w": false },
        "1.2.36.1.3.1.3.2.4.5": { "d": "qtmrpkiMarineEnforcementOfficer", "c": "Queensland Transport PKI authorised party", "w": false },
        "1.2.36.1.333.1": { "d": "australianBusinessNumber", "c": "Australian Government corporate taxpayer ID", "w": false },
        "1.2.36.68980861.1.1.2": { "d": "signetPersonal", "c": "Signet CA", "w": false },
        "1.2.36.68980861.1.1.3": { "d": "signetBusiness", "c": "Signet CA", "w": false },
        "1.2.36.68980861.1.1.4": { "d": "signetLegal", "c": "Signet CA", "w": false },
        "1.2.36.68980861.1.1.10": { "d": "signetPilot", "c": "Signet CA", "w": false },
        "1.2.36.68980861.1.1.11": { "d": "signetIntraNet", "c": "Signet CA", "w": false },
        "1.2.36.68980861.1.1.20": { "d": "signetPolicy", "c": "Signet CA", "w": false },
        "1.2.36.75878867.1.100.1.1": { "d": "certificatesAustraliaPolicy", "c": "Certificates Australia CA", "w": false },
        "1.2.392.200011.61.1.1.1": { "d": "mitsubishiSecurityAlgorithm", "c": "Mitsubishi security algorithm", "w": false },
        "1.2.392.200011.61.1.1.1.1": { "d": "misty1-cbc", "c": "Mitsubishi security algorithm", "w": false },
        "1.2.410.200004.1": { "d": "kisaAlgorithm", "c": "KISA algorithm", "w": false },
        "1.2.410.200004.1.1": { "d": "kcdsa", "c": "Korean DSA", "w": false },
        "1.2.410.200004.1.2": { "d": "has160", "c": "Korean hash algorithm", "w": false },
        "1.2.410.200004.1.3": { "d": "seedECB", "c": "Korean SEED algorithm, ECB mode", "w": false },
        "1.2.410.200004.1.4": { "d": "seedCBC", "c": "Korean SEED algorithm, CBC mode", "w": false },
        "1.2.410.200004.1.5": { "d": "seedOFB", "c": "Korean SEED algorithm, OFB mode", "w": false },
        "1.2.410.200004.1.6": { "d": "seedCFB", "c": "Korean SEED algorithm, CFB mode", "w": false },
        "1.2.410.200004.1.7": { "d": "seedMAC", "c": "Korean SEED algorithm, MAC mode", "w": false },
        "1.2.410.200004.1.8": { "d": "kcdsaWithHAS160", "c": "Korean signature algorithm", "w": false },
        "1.2.410.200004.1.9": { "d": "kcdsaWithSHA1", "c": "Korean signature algorithm", "w": false },
        "1.2.410.200004.1.10": { "d": "pbeWithHAS160AndSEED-ECB", "c": "Korean SEED algorithm, PBE key derivation", "w": false },
        "1.2.410.200004.1.11": { "d": "pbeWithHAS160AndSEED-CBC", "c": "Korean SEED algorithm, PBE key derivation", "w": false },
        "1.2.410.200004.1.12": { "d": "pbeWithHAS160AndSEED-CFB", "c": "Korean SEED algorithm, PBE key derivation", "w": false },
        "1.2.410.200004.1.13": { "d": "pbeWithHAS160AndSEED-OFB", "c": "Korean SEED algorithm, PBE key derivation", "w": false },
        "1.2.410.200004.1.14": { "d": "pbeWithSHA1AndSEED-ECB", "c": "Korean SEED algorithm, PBE key derivation", "w": false },
        "1.2.410.200004.1.15": { "d": "pbeWithSHA1AndSEED-CBC", "c": "Korean SEED algorithm, PBE key derivation", "w": false },
        "1.2.410.200004.1.16": { "d": "pbeWithSHA1AndSEED-CFB", "c": "Korean SEED algorithm, PBE key derivation", "w": false },
        "1.2.410.200004.1.17": { "d": "pbeWithSHA1AndSEED-OFB", "c": "Korean SEED algorithm, PBE key derivation", "w": false },
        "1.2.410.200004.1.20": { "d": "rsaWithHAS160", "c": "Korean signature algorithm", "w": false },
        "1.2.410.200004.1.21": { "d": "kcdsa1", "c": "Korean DSA", "w": false },
        "1.2.410.200004.2": { "d": "npkiCP", "c": "KISA NPKI certificate policies", "w": false },
        "1.2.410.200004.2.1": { "d": "npkiSignaturePolicy", "c": "KISA NPKI certificate policies", "w": false },
        "1.2.410.200004.3": { "d": "npkiKP", "c": "KISA NPKI key usage", "w": false },
        "1.2.410.200004.4": { "d": "npkiAT", "c": "KISA NPKI attribute", "w": false },
        "1.2.410.200004.5": { "d": "npkiLCA", "c": "KISA NPKI licensed CA", "w": false },
        "1.2.410.200004.5.1": { "d": "npkiSignKorea", "c": "KISA NPKI licensed CA", "w": false },
        "1.2.410.200004.5.2": { "d": "npkiSignGate", "c": "KISA NPKI licensed CA", "w": false },
        "1.2.410.200004.5.3": { "d": "npkiNcaSign", "c": "KISA NPKI licensed CA", "w": false },
        "1.2.410.200004.6": { "d": "npkiON", "c": "KISA NPKI otherName", "w": false },
        "1.2.410.200004.7": { "d": "npkiAPP", "c": "KISA NPKI application", "w": false },
        "1.2.410.200004.7.1": { "d": "npkiSMIME", "c": "KISA NPKI application", "w": false },
        "1.2.410.200004.7.1.1": { "d": "npkiSMIMEAlgo", "c": "KISA NPKI application", "w": false },
        "1.2.410.200004.7.1.1.1": { "d": "npkiCmsSEEDWrap", "c": "KISA NPKI application", "w": false },
        "1.2.410.200004.10": { "d": "npki", "c": "KISA NPKI", "w": false },
        "1.2.410.200004.10.1": { "d": "npkiAttribute", "c": "KISA NPKI attribute", "w": false },
        "1.2.410.200004.10.1.1": { "d": "npkiIdentifyData", "c": "KISA NPKI attribute", "w": false },
        "1.2.410.200004.10.1.1.1": { "d": "npkiVID", "c": "KISA NPKI attribute", "w": false },
        "1.2.410.200004.10.1.1.2": { "d": "npkiEncryptedVID", "c": "KISA NPKI attribute", "w": false },
        "1.2.410.200004.10.1.1.3": { "d": "npkiRandomNum", "c": "KISA NPKI attribute", "w": false },
        "1.2.410.200004.10.1.1.4": { "d": "npkiVID", "c": "KISA NPKI attribute", "w": false },
        "1.2.410.200046.1.1": { "d": "aria1AlgorithmModes", "c": "ARIA algorithm modes", "w": false },
        "1.2.410.200046.1.1.1": { "d": "aria128-ecb", "c": "ARIA algorithm modes", "w": false },
        "1.2.410.200046.1.1.2": { "d": "aria128-cbc", "c": "ARIA algorithm modes", "w": false },
        "1.2.410.200046.1.1.3": { "d": "aria128-cfb", "c": "ARIA algorithm modes", "w": false },
        "1.2.410.200046.1.1.4": { "d": "aria128-ofb", "c": "ARIA algorithm modes", "w": false },
        "1.2.410.200046.1.1.5": { "d": "aria128-ctr", "c": "ARIA algorithm modes", "w": false },
        "1.2.410.200046.1.1.6": { "d": "aria192-ecb", "c": "ARIA algorithm modes", "w": false },
        "1.2.410.200046.1.1.7": { "d": "aria192-cbc", "c": "ARIA algorithm modes", "w": false },
        "1.2.410.200046.1.1.8": { "d": "aria192-cfb", "c": "ARIA algorithm modes", "w": false },
        "1.2.410.200046.1.1.9": { "d": "aria192-ofb", "c": "ARIA algorithm modes", "w": false },
        "1.2.410.200046.1.1.10": { "d": "aria192-ctr", "c": "ARIA algorithm modes", "w": false },
        "1.2.410.200046.1.1.11": { "d": "aria256-ecb", "c": "ARIA algorithm modes", "w": false },
        "1.2.410.200046.1.1.12": { "d": "aria256-cbc", "c": "ARIA algorithm modes", "w": false },
        "1.2.410.200046.1.1.13": { "d": "aria256-cfb", "c": "ARIA algorithm modes", "w": false },
        "1.2.410.200046.1.1.21": { "d": "aria128-cmac", "c": "ARIA algorithm modes", "w": false },
        "1.2.410.200046.1.1.22": { "d": "aria192-cmac", "c": "ARIA algorithm modes", "w": false },
        "1.2.410.200046.1.1.23": { "d": "aria256-cmac", "c": "ARIA algorithm modes", "w": false },
        "1.2.410.200046.1.1.31": { "d": "aria128-ocb2", "c": "ARIA algorithm modes", "w": false },
        "1.2.410.200046.1.1.32": { "d": "aria192-ocb2", "c": "ARIA algorithm modes", "w": false },
        "1.2.410.200046.1.1.33": { "d": "aria256-ocb2", "c": "ARIA algorithm modes", "w": false },
        "1.2.410.200046.1.1.34": { "d": "aria128-gcm", "c": "ARIA algorithm modes", "w": false },
        "1.2.410.200046.1.1.35": { "d": "aria192-gcm", "c": "ARIA algorithm modes", "w": false },
        "1.2.410.200046.1.1.36": { "d": "aria256-gcm", "c": "ARIA algorithm modes", "w": false },
        "1.2.410.200046.1.1.37": { "d": "aria128-ccm", "c": "ARIA algorithm modes", "w": false },
        "1.2.410.200046.1.1.38": { "d": "aria192-ccm", "c": "ARIA algorithm modes", "w": false },
        "1.2.410.200046.1.1.39": { "d": "aria256-ccm", "c": "ARIA algorithm modes", "w": false },
        "1.2.410.200046.1.1.40": { "d": "aria128-keywrap", "c": "ARIA algorithm modes", "w": false },
        "1.2.410.200046.1.1.41": { "d": "aria192-keywrap", "c": "ARIA algorithm modes", "w": false },
        "1.2.410.200046.1.1.42": { "d": "aria256-keywrap", "c": "ARIA algorithm modes", "w": false },
        "1.2.410.200046.1.1.43": { "d": "aria128-keywrapWithPad", "c": "ARIA algorithm modes", "w": false },
        "1.2.410.200046.1.1.44": { "d": "aria192-keywrapWithPad", "c": "ARIA algorithm modes", "w": false },
        "1.2.410.200046.1.1.45": { "d": "aria256-keywrapWithPad", "c": "ARIA algorithm modes", "w": false },
        "1.2.643.2.2.3": { "d": "gostSignature", "c": "GOST R 34.10-2001 + GOST R 34.11-94 signature", "w": false },
        "1.2.643.2.2.4": { "d": "gost94Signature", "c": "GOST R 34.10-94 + GOST R 34.11-94 signature. Obsoleted by GOST R 34.10-2001", "w": true },
        "1.2.643.2.2.19": { "d": "gostPublicKey", "c": "GOST R 34.10-2001 (ECC) public key", "w": false },
        "1.2.643.2.2.20": { "d": "gost94PublicKey", "c": "GOST R 34.10-94 public key. Obsoleted by GOST R 34.10-2001", "w": true },
        "1.2.643.2.2.21": { "d": "gostCipher", "c": "GOST 28147-89 (symmetric key block cipher)", "w": false },
        "1.2.643.2.2.31.0": { "d": "testCipherParams", "c": "Test params for GOST 28147-89", "w": false },
        "1.2.643.2.2.31.1": { "d": "cryptoProCipherA", "c": "CryptoPro params A for GOST 28147-89", "w": false },
        "1.2.643.2.2.31.2": { "d": "cryptoProCipherB", "c": "CryptoPro params B for GOST 28147-89", "w": false },
        "1.2.643.2.2.31.3": { "d": "cryptoProCipherC", "c": "CryptoPro params C for GOST 28147-89", "w": false },
        "1.2.643.2.2.31.4": { "d": "cryptoProCipherD", "c": "CryptoPro params D for GOST 28147-89", "w": false },
        "1.2.643.2.2.31.5": { "d": "oscar11Cipher", "c": "Oscar-1.1 params for GOST 28147-89", "w": false },
        "1.2.643.2.2.31.6": { "d": "oscar10Cipher", "c": "Oscar-1.0 params for GOST 28147-89", "w": false },
        "1.2.643.2.2.31.7": { "d": "ric1Cipher", "c": "RIC-1 params for GOST 28147-89", "w": false },
        "1.2.643.2.2.9": { "d": "gostDigest", "c": "GOST R 34.11-94 digest", "w": false },
        "1.2.643.2.2.30.0": { "d": "testDigestParams", "c": "Test params for GOST R 34.11-94", "w": false },
        "1.2.643.2.2.30.1": { "d": "cryptoProDigestA", "c": "CryptoPro digest params for GOST R 34.11-94", "w": false },
        "1.2.643.2.2.35.0": { "d": "testSignParams", "c": "Test elliptic curve for GOST R 34.11-2001", "w": false },
        "1.2.643.2.2.35.1": { "d": "cryptoProSignA", "c": "CryptoPro ell.curve A for GOST R 34.11-2001", "w": false },
        "1.2.643.2.2.35.2": { "d": "cryptoProSignB", "c": "CryptoPro ell.curve B for GOST R 34.11-2001", "w": false },
        "1.2.643.2.2.35.3": { "d": "cryptoProSignC", "c": "CryptoPro ell.curve C for GOST R 34.11-2001", "w": false },
        "1.2.643.2.2.36.0": { "d": "cryptoProSignXA", "c": "CryptoPro ell.curve XA for GOST R 34.11-2001", "w": false },
        "1.2.643.2.2.36.1": { "d": "cryptoProSignXB", "c": "CryptoPro ell.curve XB for GOST R 34.11-2001", "w": false },
        "1.2.643.2.2.14.0": { "d": "nullMeshing", "c": "Do not mesh state of GOST 28147-89 cipher", "w": false },
        "1.2.643.2.2.14.1": { "d": "cryptoProMeshing", "c": "CryptoPro meshing of state of GOST 28147-89 cipher", "w": false },
        "1.2.643.2.2.10": { "d": "hmacGost", "c": "HMAC with GOST R 34.11-94", "w": false },
        "1.2.643.2.2.13.0": { "d": "gostWrap", "c": "Wrap key using GOST 28147-89 key", "w": false },
        "1.2.643.2.2.13.1": { "d": "cryptoProWrap", "c": "Wrap key using diversified GOST 28147-89 key", "w": false },
        "1.2.643.2.2.96": { "d": "cryptoProECDHWrap", "c": "Wrap key using ECC DH on GOST R 34.10-2001 keys (VKO)", "w": false },
        "1.2.752.34.1": { "d": "seis-cp", "c": "SEIS Project", "w": false },
        "1.2.752.34.1.1": { "d": "SEIS high-assurance policyIdentifier", "c": "SEIS Project certificate policies", "w": false },
        "1.2.752.34.1.2": { "d": "SEIS GAK policyIdentifier", "c": "SEIS Project certificate policies", "w": false },
        "1.2.752.34.2": { "d": "SEIS pe", "c": "SEIS Project", "w": false },
        "1.2.752.34.3": { "d": "SEIS at", "c": "SEIS Project", "w": false },
        "1.2.752.34.3.1": { "d": "SEIS at-personalIdentifier", "c": "SEIS Project attribute", "w": false },
        "1.2.840.10040.1": { "d": "module", "c": "ANSI X9.57", "w": false },
        "1.2.840.10040.1.1": { "d": "x9f1-cert-mgmt", "c": "ANSI X9.57 module", "w": false },
        "1.2.840.10040.2": { "d": "holdinstruction", "c": "ANSI X9.57", "w": false },
        "1.2.840.10040.2.1": { "d": "holdinstruction-none", "c": "ANSI X9.57 hold instruction", "w": false },
        "1.2.840.10040.2.2": { "d": "callissuer", "c": "ANSI X9.57 hold instruction", "w": false },
        "1.2.840.10040.2.3": { "d": "reject", "c": "ANSI X9.57 hold instruction", "w": false },
        "1.2.840.10040.2.4": { "d": "pickupToken", "c": "ANSI X9.57 hold instruction", "w": false },
        "1.2.840.10040.3": { "d": "attribute", "c": "ANSI X9.57", "w": false },
        "1.2.840.10040.3.1": { "d": "countersignature", "c": "ANSI X9.57 attribute", "w": false },
        "1.2.840.10040.3.2": { "d": "attribute-cert", "c": "ANSI X9.57 attribute", "w": false },
        "1.2.840.10040.4": { "d": "algorithm", "c": "ANSI X9.57", "w": false },
        "1.2.840.10040.4.1": { "d": "dsa", "c": "ANSI X9.57 algorithm", "w": false },
        "1.2.840.10040.4.2": { "d": "dsa-match", "c": "ANSI X9.57 algorithm", "w": false },
        "1.2.840.10040.4.3": { "d": "dsaWithSha1", "c": "ANSI X9.57 algorithm", "w": false },
        "1.2.840.10045.1": { "d": "fieldType", "c": "ANSI X9.62. This OID is also assigned as ecdsa-with-SHA1", "w": false },
        "1.2.840.10045.1.1": { "d": "prime-field", "c": "ANSI X9.62 field type", "w": false },
        "1.2.840.10045.1.2": { "d": "characteristic-two-field", "c": "ANSI X9.62 field type", "w": false },
        "1.2.840.10045.1.2.3": { "d": "characteristic-two-basis", "c": "ANSI X9.62 field type", "w": false },
        "1.2.840.10045.1.2.3.1": { "d": "onBasis", "c": "ANSI X9.62 field basis", "w": false },
        "1.2.840.10045.1.2.3.2": { "d": "tpBasis", "c": "ANSI X9.62 field basis", "w": false },
        "1.2.840.10045.1.2.3.3": { "d": "ppBasis", "c": "ANSI X9.62 field basis", "w": false },
        "1.2.840.10045.2": { "d": "publicKeyType", "c": "ANSI X9.62", "w": false },
        "1.2.840.10045.2.1": { "d": "ecPublicKey", "c": "ANSI X9.62 public key type", "w": false },
        "1.2.840.10045.3.0.1": { "d": "c2pnb163v1", "c": "ANSI X9.62 named elliptic curve", "w": false },
        "1.2.840.10045.3.0.2": { "d": "c2pnb163v2", "c": "ANSI X9.62 named elliptic curve", "w": false },
        "1.2.840.10045.3.0.3": { "d": "c2pnb163v3", "c": "ANSI X9.62 named elliptic curve", "w": false },
        "1.2.840.10045.3.0.5": { "d": "c2tnb191v1", "c": "ANSI X9.62 named elliptic curve", "w": false },
        "1.2.840.10045.3.0.6": { "d": "c2tnb191v2", "c": "ANSI X9.62 named elliptic curve", "w": false },
        "1.2.840.10045.3.0.7": { "d": "c2tnb191v3", "c": "ANSI X9.62 named elliptic curve", "w": false },
        "1.2.840.10045.3.0.10": { "d": "c2pnb208w1", "c": "ANSI X9.62 named elliptic curve", "w": false },
        "1.2.840.10045.3.0.11": { "d": "c2tnb239v1", "c": "ANSI X9.62 named elliptic curve", "w": false },
        "1.2.840.10045.3.0.12": { "d": "c2tnb239v2", "c": "ANSI X9.62 named elliptic curve", "w": false },
        "1.2.840.10045.3.0.13": { "d": "c2tnb239v3", "c": "ANSI X9.62 named elliptic curve", "w": false },
        "1.2.840.10045.3.0.16": { "d": "c2pnb272w1", "c": "ANSI X9.62 named elliptic curve", "w": false },
        "1.2.840.10045.3.0.18": { "d": "c2tnb359v1", "c": "ANSI X9.62 named elliptic curve", "w": false },
        "1.2.840.10045.3.0.19": { "d": "c2pnb368w1", "c": "ANSI X9.62 named elliptic curve", "w": false },
        "1.2.840.10045.3.0.20": { "d": "c2tnb431r1", "c": "ANSI X9.62 named elliptic curve", "w": false },
        "1.2.840.10045.3.1.1": { "d": "prime192v1", "c": "ANSI X9.62 named elliptic curve", "w": false },
        "1.2.840.10045.3.1.2": { "d": "prime192v2", "c": "ANSI X9.62 named elliptic curve", "w": false },
        "1.2.840.10045.3.1.3": { "d": "prime192v3", "c": "ANSI X9.62 named elliptic curve", "w": false },
        "1.2.840.10045.3.1.4": { "d": "prime239v1", "c": "ANSI X9.62 named elliptic curve", "w": false },
        "1.2.840.10045.3.1.5": { "d": "prime239v2", "c": "ANSI X9.62 named elliptic curve", "w": false },
        "1.2.840.10045.3.1.6": { "d": "prime239v3", "c": "ANSI X9.62 named elliptic curve", "w": false },
        "1.2.840.10045.3.1.7": { "d": "prime256v1", "c": "ANSI X9.62 named elliptic curve", "w": false },
        "1.2.840.10045.4.1": { "d": "ecdsaWithSHA1", "c": "ANSI X9.62 ECDSA algorithm with SHA1", "w": false },
        "1.2.840.10045.4.2": { "d": "ecdsaWithRecommended", "c": "ANSI X9.62 ECDSA algorithm with Recommended", "w": false },
        "1.2.840.10045.4.3": { "d": "ecdsaWithSpecified", "c": "ANSI X9.62 ECDSA algorithm with Specified", "w": false },
        "1.2.840.10045.4.3.1": { "d": "ecdsaWithSHA224", "c": "ANSI X9.62 ECDSA algorithm with SHA224", "w": false },
        "1.2.840.10045.4.3.2": { "d": "ecdsaWithSHA256", "c": "ANSI X9.62 ECDSA algorithm with SHA256", "w": false },
        "1.2.840.10045.4.3.3": { "d": "ecdsaWithSHA384", "c": "ANSI X9.62 ECDSA algorithm with SHA384", "w": false },
        "1.2.840.10045.4.3.4": { "d": "ecdsaWithSHA512", "c": "ANSI X9.62 ECDSA algorithm with SHA512", "w": false },
        "1.2.840.10046.1": { "d": "fieldType", "c": "ANSI X9.42", "w": false },
        "1.2.840.10046.1.1": { "d": "gf-prime", "c": "ANSI X9.42 field type", "w": false },
        "1.2.840.10046.2": { "d": "numberType", "c": "ANSI X9.42", "w": false },
        "1.2.840.10046.2.1": { "d": "dhPublicKey", "c": "ANSI X9.42 number type", "w": false },
        "1.2.840.10046.3": { "d": "scheme", "c": "ANSI X9.42", "w": false },
        "1.2.840.10046.3.1": { "d": "dhStatic", "c": "ANSI X9.42 scheme", "w": false },
        "1.2.840.10046.3.2": { "d": "dhEphem", "c": "ANSI X9.42 scheme", "w": false },
        "1.2.840.10046.3.3": { "d": "dhHybrid1", "c": "ANSI X9.42 scheme", "w": false },
        "1.2.840.10046.3.4": { "d": "dhHybrid2", "c": "ANSI X9.42 scheme", "w": false },
        "1.2.840.10046.3.5": { "d": "mqv2", "c": "ANSI X9.42 scheme", "w": false },
        "1.2.840.10046.3.6": { "d": "mqv1", "c": "ANSI X9.42 scheme", "w": false },
        "1.2.840.10065.2.2": { "d": "?", "c": "ASTM 31.20", "w": false },
        "1.2.840.10065.2.3": { "d": "healthcareLicense", "c": "ASTM 31.20", "w": false },
        "1.2.840.10065.2.3.1.1": { "d": "license?", "c": "ASTM 31.20 healthcare license type", "w": false },
        "1.2.840.113533.7": { "d": "nsn", "c": "", "w": false },
        "1.2.840.113533.7.65": { "d": "nsn-ce", "c": "", "w": false },
        "1.2.840.113533.7.65.0": { "d": "entrustVersInfo", "c": "Nortel Secure Networks ce", "w": false },
        "1.2.840.113533.7.66": { "d": "nsn-alg", "c": "", "w": false },
        "1.2.840.113533.7.66.3": { "d": "cast3CBC", "c": "Nortel Secure Networks alg", "w": false },
        "1.2.840.113533.7.66.10": { "d": "cast5CBC", "c": "Nortel Secure Networks alg", "w": false },
        "1.2.840.113533.7.66.11": { "d": "cast5MAC", "c": "Nortel Secure Networks alg", "w": false },
        "1.2.840.113533.7.66.12": { "d": "pbeWithMD5AndCAST5-CBC", "c": "Nortel Secure Networks alg", "w": false },
        "1.2.840.113533.7.66.13": { "d": "passwordBasedMac", "c": "Nortel Secure Networks alg", "w": false },
        "1.2.840.113533.7.67": { "d": "nsn-oc", "c": "", "w": false },
        "1.2.840.113533.7.67.0": { "d": "entrustUser", "c": "Nortel Secure Networks oc", "w": false },
        "1.2.840.113533.7.68": { "d": "nsn-at", "c": "", "w": false },
        "1.2.840.113533.7.68.0": { "d": "entrustCAInfo", "c": "Nortel Secure Networks at", "w": false },
        "1.2.840.113533.7.68.10": { "d": "attributeCertificate", "c": "Nortel Secure Networks at", "w": false },
        "1.2.840.113549.1.1": { "d": "pkcs-1", "c": "", "w": false },
        "1.2.840.113549.1.1.1": { "d": "rsaEncryption", "c": "PKCS #1", "w": false },
        "1.2.840.113549.1.1.2": { "d": "md2WithRSAEncryption", "c": "PKCS #1", "w": false },
        "1.2.840.113549.1.1.3": { "d": "md4WithRSAEncryption", "c": "PKCS #1", "w": false },
        "1.2.840.113549.1.1.4": { "d": "md5WithRSAEncryption", "c": "PKCS #1", "w": false },
        "1.2.840.113549.1.1.5": { "d": "sha1WithRSAEncryption", "c": "PKCS #1", "w": false },
        "1.2.840.113549.1.1.7": { "d": "rsaOAEP", "c": "PKCS #1", "w": false },
        "1.2.840.113549.1.1.8": { "d": "pkcs1-MGF", "c": "PKCS #1", "w": false },
        "1.2.840.113549.1.1.9": { "d": "rsaOAEP-pSpecified", "c": "PKCS #1", "w": false },
        "1.2.840.113549.1.1.10": { "d": "rsaPSS", "c": "PKCS #1", "w": false },
        "1.2.840.113549.1.1.11": { "d": "sha256WithRSAEncryption", "c": "PKCS #1", "w": false },
        "1.2.840.113549.1.1.12": { "d": "sha384WithRSAEncryption", "c": "PKCS #1", "w": false },
        "1.2.840.113549.1.1.13": { "d": "sha512WithRSAEncryption", "c": "PKCS #1", "w": false },
        "1.2.840.113549.1.1.14": { "d": "sha224WithRSAEncryption", "c": "PKCS #1", "w": false },
        "1.2.840.113549.1.1.6": { "d": "rsaOAEPEncryptionSET", "c": "PKCS #1. This OID may also be assigned as ripemd160WithRSAEncryption", "w": false },
        "1.2.840.113549.1.2": { "d": "bsafeRsaEncr", "c": "Obsolete BSAFE OID", "w": true },
        "1.2.840.113549.1.3": { "d": "pkcs-3", "c": "", "w": false },
        "1.2.840.113549.1.3.1": { "d": "dhKeyAgreement", "c": "PKCS #3", "w": false },
        "1.2.840.113549.1.5": { "d": "pkcs-5", "c": "", "w": false },
        "1.2.840.113549.1.5.1": { "d": "pbeWithMD2AndDES-CBC", "c": "PKCS #5", "w": false },
        "1.2.840.113549.1.5.3": { "d": "pbeWithMD5AndDES-CBC", "c": "PKCS #5", "w": false },
        "1.2.840.113549.1.5.4": { "d": "pbeWithMD2AndRC2-CBC", "c": "PKCS #5", "w": false },
        "1.2.840.113549.1.5.6": { "d": "pbeWithMD5AndRC2-CBC", "c": "PKCS #5", "w": false },
        "1.2.840.113549.1.5.9": { "d": "pbeWithMD5AndXOR", "c": "PKCS #5, used in BSAFE only", "w": true },
        "1.2.840.113549.1.5.10": { "d": "pbeWithSHAAndDES-CBC", "c": "PKCS #5", "w": false },
        "1.2.840.113549.1.5.12": { "d": "pkcs5PBKDF2", "c": "PKCS #5 v2.0", "w": false },
        "1.2.840.113549.1.5.13": { "d": "pkcs5PBES2", "c": "PKCS #5 v2.0", "w": false },
        "1.2.840.113549.1.5.14": { "d": "pkcs5PBMAC1", "c": "PKCS #5 v2.0", "w": false },
        "1.2.840.113549.1.7": { "d": "pkcs-7", "c": "", "w": false },
        "1.2.840.113549.1.7.1": { "d": "data", "c": "PKCS #7", "w": false },
        "1.2.840.113549.1.7.2": { "d": "signedData", "c": "PKCS #7", "w": false },
        "1.2.840.113549.1.7.3": { "d": "envelopedData", "c": "PKCS #7", "w": false },
        "1.2.840.113549.1.7.4": { "d": "signedAndEnvelopedData", "c": "PKCS #7", "w": false },
        "1.2.840.113549.1.7.5": { "d": "digestedData", "c": "PKCS #7", "w": false },
        "1.2.840.113549.1.7.6": { "d": "encryptedData", "c": "PKCS #7", "w": false },
        "1.2.840.113549.1.7.7": { "d": "dataWithAttributes", "c": "PKCS #7 experimental", "w": true },
        "1.2.840.113549.1.7.8": { "d": "encryptedPrivateKeyInfo", "c": "PKCS #7 experimental", "w": true },
        "1.2.840.113549.1.9": { "d": "pkcs-9", "c": "", "w": false },
        "1.2.840.113549.1.9.1": { "d": "emailAddress", "c": "PKCS #9. Deprecated, use an altName extension instead", "w": false },
        "1.2.840.113549.1.9.2": { "d": "unstructuredName", "c": "PKCS #9", "w": false },
        "1.2.840.113549.1.9.3": { "d": "contentType", "c": "PKCS #9", "w": false },
        "1.2.840.113549.1.9.4": { "d": "messageDigest", "c": "PKCS #9", "w": false },
        "1.2.840.113549.1.9.5": { "d": "signingTime", "c": "PKCS #9", "w": false },
        "1.2.840.113549.1.9.6": { "d": "countersignature", "c": "PKCS #9", "w": false },
        "1.2.840.113549.1.9.7": { "d": "challengePassword", "c": "PKCS #9", "w": false },
        "1.2.840.113549.1.9.8": { "d": "unstructuredAddress", "c": "PKCS #9", "w": false },
        "1.2.840.113549.1.9.9": { "d": "extendedCertificateAttributes", "c": "PKCS #9", "w": false },
        "1.2.840.113549.1.9.10": { "d": "issuerAndSerialNumber", "c": "PKCS #9 experimental", "w": true },
        "1.2.840.113549.1.9.11": { "d": "passwordCheck", "c": "PKCS #9 experimental", "w": true },
        "1.2.840.113549.1.9.12": { "d": "publicKey", "c": "PKCS #9 experimental", "w": true },
        "1.2.840.113549.1.9.13": { "d": "signingDescription", "c": "PKCS #9", "w": false },
        "1.2.840.113549.1.9.14": { "d": "extensionRequest", "c": "PKCS #9 via CRMF", "w": false },
        "1.2.840.113549.1.9.15": { "d": "sMIMECapabilities", "c": "PKCS #9. This OID was formerly assigned as symmetricCapabilities, then reassigned as SMIMECapabilities, then renamed to the current name", "w": false },
        "1.2.840.113549.1.9.15.1": { "d": "preferSignedData", "c": "sMIMECapabilities", "w": false },
        "1.2.840.113549.1.9.15.2": { "d": "canNotDecryptAny", "c": "sMIMECapabilities", "w": false },
        "1.2.840.113549.1.9.15.3": { "d": "receiptRequest", "c": "sMIMECapabilities. Deprecated, use (1 2 840 113549 1 9 16 2 1) instead", "w": true },
        "1.2.840.113549.1.9.15.4": { "d": "receipt", "c": "sMIMECapabilities. Deprecated, use (1 2 840 113549 1 9 16 1 1) instead", "w": true },
        "1.2.840.113549.1.9.15.5": { "d": "contentHints", "c": "sMIMECapabilities. Deprecated, use (1 2 840 113549 1 9 16 2 4) instead", "w": true },
        "1.2.840.113549.1.9.15.6": { "d": "mlExpansionHistory", "c": "sMIMECapabilities. Deprecated, use (1 2 840 113549 1 9 16 2 3) instead", "w": true },
        "1.2.840.113549.1.9.16": { "d": "id-sMIME", "c": "PKCS #9", "w": false },
        "1.2.840.113549.1.9.16.0": { "d": "id-mod", "c": "id-sMIME", "w": false },
        "1.2.840.113549.1.9.16.0.1": { "d": "id-mod-cms", "c": "S/MIME Modules", "w": false },
        "1.2.840.113549.1.9.16.0.2": { "d": "id-mod-ess", "c": "S/MIME Modules", "w": false },
        "1.2.840.113549.1.9.16.0.3": { "d": "id-mod-oid", "c": "S/MIME Modules", "w": false },
        "1.2.840.113549.1.9.16.0.4": { "d": "id-mod-msg-v3", "c": "S/MIME Modules", "w": false },
        "1.2.840.113549.1.9.16.0.5": { "d": "id-mod-ets-eSignature-88", "c": "S/MIME Modules", "w": false },
        "1.2.840.113549.1.9.16.0.6": { "d": "id-mod-ets-eSignature-97", "c": "S/MIME Modules", "w": false },
        "1.2.840.113549.1.9.16.0.7": { "d": "id-mod-ets-eSigPolicy-88", "c": "S/MIME Modules", "w": false },
        "1.2.840.113549.1.9.16.0.8": { "d": "id-mod-ets-eSigPolicy-88", "c": "S/MIME Modules", "w": false },
        "1.2.840.113549.1.9.16.1": { "d": "contentType", "c": "S/MIME", "w": false },
        "1.2.840.113549.1.9.16.1.1": { "d": "receipt", "c": "S/MIME Content Types", "w": false },
        "1.2.840.113549.1.9.16.1.2": { "d": "authData", "c": "S/MIME Content Types", "w": false },
        "1.2.840.113549.1.9.16.1.3": { "d": "publishCert", "c": "S/MIME Content Types", "w": false },
        "1.2.840.113549.1.9.16.1.4": { "d": "tSTInfo", "c": "S/MIME Content Types", "w": false },
        "1.2.840.113549.1.9.16.1.5": { "d": "tDTInfo", "c": "S/MIME Content Types", "w": false },
        "1.2.840.113549.1.9.16.1.6": { "d": "contentInfo", "c": "S/MIME Content Types", "w": false },
        "1.2.840.113549.1.9.16.1.7": { "d": "dVCSRequestData", "c": "S/MIME Content Types", "w": false },
        "1.2.840.113549.1.9.16.1.8": { "d": "dVCSResponseData", "c": "S/MIME Content Types", "w": false },
        "1.2.840.113549.1.9.16.1.9": { "d": "compressedData", "c": "S/MIME Content Types", "w": false },
        "1.2.840.113549.1.9.16.1.10": { "d": "scvpCertValRequest", "c": "S/MIME Content Types", "w": false },
        "1.2.840.113549.1.9.16.1.11": { "d": "scvpCertValResponse", "c": "S/MIME Content Types", "w": false },
        "1.2.840.113549.1.9.16.1.12": { "d": "scvpValPolRequest", "c": "S/MIME Content Types", "w": false },
        "1.2.840.113549.1.9.16.1.13": { "d": "scvpValPolResponse", "c": "S/MIME Content Types", "w": false },
        "1.2.840.113549.1.9.16.1.14": { "d": "attrCertEncAttrs", "c": "S/MIME Content Types", "w": false },
        "1.2.840.113549.1.9.16.1.15": { "d": "tSReq", "c": "S/MIME Content Types", "w": false },
        "1.2.840.113549.1.9.16.1.16": { "d": "firmwarePackage", "c": "S/MIME Content Types", "w": false },
        "1.2.840.113549.1.9.16.1.17": { "d": "firmwareLoadReceipt", "c": "S/MIME Content Types", "w": false },
        "1.2.840.113549.1.9.16.1.18": { "d": "firmwareLoadError", "c": "S/MIME Content Types", "w": false },
        "1.2.840.113549.1.9.16.1.19": { "d": "contentCollection", "c": "S/MIME Content Types", "w": false },
        "1.2.840.113549.1.9.16.1.20": { "d": "contentWithAttrs", "c": "S/MIME Content Types", "w": false },
        "1.2.840.113549.1.9.16.1.21": { "d": "encKeyWithID", "c": "S/MIME Content Types", "w": false },
        "1.2.840.113549.1.9.16.1.22": { "d": "encPEPSI", "c": "S/MIME Content Types", "w": false },
        "1.2.840.113549.1.9.16.1.23": { "d": "authEnvelopedData", "c": "S/MIME Content Types", "w": false },
        "1.2.840.113549.1.9.16.1.24": { "d": "routeOriginAttest", "c": "S/MIME Content Types", "w": false },
        "1.2.840.113549.1.9.16.1.25": { "d": "symmetricKeyPackage", "c": "S/MIME Content Types", "w": false },
        "1.2.840.113549.1.9.16.1.26": { "d": "rpkiManifest", "c": "S/MIME Content Types", "w": false },
        "1.2.840.113549.1.9.16.1.27": { "d": "asciiTextWithCRLF", "c": "S/MIME Content Types", "w": false },
        "1.2.840.113549.1.9.16.1.28": { "d": "xml", "c": "S/MIME Content Types", "w": false },
        "1.2.840.113549.1.9.16.1.29": { "d": "pdf", "c": "S/MIME Content Types", "w": false },
        "1.2.840.113549.1.9.16.1.30": { "d": "postscript", "c": "S/MIME Content Types", "w": false },
        "1.2.840.113549.1.9.16.1.31": { "d": "timestampedData", "c": "S/MIME Content Types", "w": false },
        "1.2.840.113549.1.9.16.1.32": { "d": "asAdjacencyAttest", "c": "S/MIME Content Types", "w": true },
        "1.2.840.113549.1.9.16.1.33": { "d": "rpkiTrustAnchor", "c": "S/MIME Content Types", "w": false },
        "1.2.840.113549.1.9.16.1.34": { "d": "trustAnchorList", "c": "S/MIME Content Types", "w": false },
        "1.2.840.113549.1.9.16.2": { "d": "authenticatedAttributes", "c": "S/MIME", "w": false },
        "1.2.840.113549.1.9.16.2.1": { "d": "receiptRequest", "c": "S/MIME Authenticated Attributes", "w": false },
        "1.2.840.113549.1.9.16.2.2": { "d": "securityLabel", "c": "S/MIME Authenticated Attributes", "w": false },
        "1.2.840.113549.1.9.16.2.3": { "d": "mlExpandHistory", "c": "S/MIME Authenticated Attributes", "w": false },
        "1.2.840.113549.1.9.16.2.4": { "d": "contentHint", "c": "S/MIME Authenticated Attributes", "w": false },
        "1.2.840.113549.1.9.16.2.5": { "d": "msgSigDigest", "c": "S/MIME Authenticated Attributes", "w": false },
        "1.2.840.113549.1.9.16.2.6": { "d": "encapContentType", "c": "S/MIME Authenticated Attributes.  Obsolete", "w": true },
        "1.2.840.113549.1.9.16.2.7": { "d": "contentIdentifier", "c": "S/MIME Authenticated Attributes", "w": false },
        "1.2.840.113549.1.9.16.2.8": { "d": "macValue", "c": "S/MIME Authenticated Attributes.  Obsolete", "w": true },
        "1.2.840.113549.1.9.16.2.9": { "d": "equivalentLabels", "c": "S/MIME Authenticated Attributes", "w": false },
        "1.2.840.113549.1.9.16.2.10": { "d": "contentReference", "c": "S/MIME Authenticated Attributes", "w": false },
        "1.2.840.113549.1.9.16.2.11": { "d": "encrypKeyPref", "c": "S/MIME Authenticated Attributes", "w": false },
        "1.2.840.113549.1.9.16.2.12": { "d": "signingCertificate", "c": "S/MIME Authenticated Attributes", "w": false },
        "1.2.840.113549.1.9.16.2.13": { "d": "smimeEncryptCerts", "c": "S/MIME Authenticated Attributes", "w": false },
        "1.2.840.113549.1.9.16.2.14": { "d": "timeStampToken", "c": "S/MIME Authenticated Attributes", "w": false },
        "1.2.840.113549.1.9.16.2.15": { "d": "sigPolicyId", "c": "S/MIME Authenticated Attributes", "w": false },
        "1.2.840.113549.1.9.16.2.16": { "d": "commitmentType", "c": "S/MIME Authenticated Attributes", "w": false },
        "1.2.840.113549.1.9.16.2.17": { "d": "signerLocation", "c": "S/MIME Authenticated Attributes", "w": false },
        "1.2.840.113549.1.9.16.2.18": { "d": "signerAttr", "c": "S/MIME Authenticated Attributes", "w": false },
        "1.2.840.113549.1.9.16.2.19": { "d": "otherSigCert", "c": "S/MIME Authenticated Attributes", "w": false },
        "1.2.840.113549.1.9.16.2.20": { "d": "contentTimestamp", "c": "S/MIME Authenticated Attributes", "w": false },
        "1.2.840.113549.1.9.16.2.21": { "d": "certificateRefs", "c": "S/MIME Authenticated Attributes", "w": false },
        "1.2.840.113549.1.9.16.2.22": { "d": "revocationRefs", "c": "S/MIME Authenticated Attributes", "w": false },
        "1.2.840.113549.1.9.16.2.23": { "d": "certValues", "c": "S/MIME Authenticated Attributes", "w": false },
        "1.2.840.113549.1.9.16.2.24": { "d": "revocationValues", "c": "S/MIME Authenticated Attributes", "w": false },
        "1.2.840.113549.1.9.16.2.25": { "d": "escTimeStamp", "c": "S/MIME Authenticated Attributes", "w": false },
        "1.2.840.113549.1.9.16.2.26": { "d": "certCRLTimestamp", "c": "S/MIME Authenticated Attributes", "w": false },
        "1.2.840.113549.1.9.16.2.27": { "d": "archiveTimeStamp", "c": "S/MIME Authenticated Attributes", "w": false },
        "1.2.840.113549.1.9.16.2.28": { "d": "signatureType", "c": "S/MIME Authenticated Attributes", "w": false },
        "1.2.840.113549.1.9.16.2.29": { "d": "dvcsDvc", "c": "S/MIME Authenticated Attributes", "w": false },
        "1.2.840.113549.1.9.16.2.30": { "d": "cekReference", "c": "S/MIME Authenticated Attributes", "w": false },
        "1.2.840.113549.1.9.16.2.31": { "d": "maxCEKDecrypts", "c": "S/MIME Authenticated Attributes", "w": false },
        "1.2.840.113549.1.9.16.2.32": { "d": "kekDerivationAlg", "c": "S/MIME Authenticated Attributes", "w": false },
        "1.2.840.113549.1.9.16.2.33": { "d": "intendedRecipients", "c": "S/MIME Authenticated Attributes.  Obsolete", "w": true },
        "1.2.840.113549.1.9.16.2.34": { "d": "cmcUnsignedData", "c": "S/MIME Authenticated Attributes", "w": false },
        "1.2.840.113549.1.9.16.2.35": { "d": "fwPackageID", "c": "S/MIME Authenticated Attributes", "w": false },
        "1.2.840.113549.1.9.16.2.36": { "d": "fwTargetHardwareIDs", "c": "S/MIME Authenticated Attributes", "w": false },
        "1.2.840.113549.1.9.16.2.37": { "d": "fwDecryptKeyID", "c": "S/MIME Authenticated Attributes", "w": false },
        "1.2.840.113549.1.9.16.2.38": { "d": "fwImplCryptAlgs", "c": "S/MIME Authenticated Attributes", "w": false },
        "1.2.840.113549.1.9.16.2.39": { "d": "fwWrappedFirmwareKey", "c": "S/MIME Authenticated Attributes", "w": false },
        "1.2.840.113549.1.9.16.2.40": { "d": "fwCommunityIdentifiers", "c": "S/MIME Authenticated Attributes", "w": false },
        "1.2.840.113549.1.9.16.2.41": { "d": "fwPkgMessageDigest", "c": "S/MIME Authenticated Attributes", "w": false },
        "1.2.840.113549.1.9.16.2.42": { "d": "fwPackageInfo", "c": "S/MIME Authenticated Attributes", "w": false },
        "1.2.840.113549.1.9.16.2.43": { "d": "fwImplCompressAlgs", "c": "S/MIME Authenticated Attributes", "w": false },
        "1.2.840.113549.1.9.16.2.44": { "d": "etsAttrCertificateRefs", "c": "S/MIME Authenticated Attributes", "w": false },
        "1.2.840.113549.1.9.16.2.45": { "d": "etsAttrRevocationRefs", "c": "S/MIME Authenticated Attributes", "w": false },
        "1.2.840.113549.1.9.16.2.46": { "d": "binarySigningTime", "c": "S/MIME Authenticated Attributes", "w": false },
        "1.2.840.113549.1.9.16.2.47": { "d": "signingCertificateV2", "c": "S/MIME Authenticated Attributes", "w": false },
        "1.2.840.113549.1.9.16.2.48": { "d": "etsArchiveTimeStampV2", "c": "S/MIME Authenticated Attributes", "w": false },
        "1.2.840.113549.1.9.16.2.49": { "d": "erInternal", "c": "S/MIME Authenticated Attributes", "w": false },
        "1.2.840.113549.1.9.16.2.50": { "d": "erExternal", "c": "S/MIME Authenticated Attributes", "w": false },
        "1.2.840.113549.1.9.16.2.51": { "d": "multipleSignatures", "c": "S/MIME Authenticated Attributes", "w": false },
        "1.2.840.113549.1.9.16.3.1": { "d": "esDHwith3DES", "c": "S/MIME Algorithms. Obsolete", "w": true },
        "1.2.840.113549.1.9.16.3.2": { "d": "esDHwithRC2", "c": "S/MIME Algorithms. Obsolete", "w": true },
        "1.2.840.113549.1.9.16.3.3": { "d": "3desWrap", "c": "S/MIME Algorithms. Obsolete", "w": true },
        "1.2.840.113549.1.9.16.3.4": { "d": "rc2Wrap", "c": "S/MIME Algorithms. Obsolete", "w": true },
        "1.2.840.113549.1.9.16.3.5": { "d": "esDH", "c": "S/MIME Algorithms", "w": false },
        "1.2.840.113549.1.9.16.3.6": { "d": "cms3DESwrap", "c": "S/MIME Algorithms", "w": false },
        "1.2.840.113549.1.9.16.3.7": { "d": "cmsRC2wrap", "c": "S/MIME Algorithms", "w": false },
        "1.2.840.113549.1.9.16.3.8": { "d": "zlib", "c": "S/MIME Algorithms", "w": false },
        "1.2.840.113549.1.9.16.3.9": { "d": "pwriKEK", "c": "S/MIME Algorithms", "w": false },
        "1.2.840.113549.1.9.16.3.10": { "d": "ssDH", "c": "S/MIME Algorithms", "w": false },
        "1.2.840.113549.1.9.16.3.11": { "d": "hmacWith3DESwrap", "c": "S/MIME Algorithms", "w": false },
        "1.2.840.113549.1.9.16.3.12": { "d": "hmacWithAESwrap", "c": "S/MIME Algorithms", "w": false },
        "1.2.840.113549.1.9.16.3.13": { "d": "md5XorExperiment", "c": "S/MIME Algorithms.  Experimental", "w": true },
        "1.2.840.113549.1.9.16.3.14": { "d": "rsaKEM", "c": "S/MIME Algorithms", "w": false },
        "1.2.840.113549.1.9.16.3.15": { "d": "authEnc128", "c": "S/MIME Algorithms", "w": false },
        "1.2.840.113549.1.9.16.3.16": { "d": "authEnc256", "c": "S/MIME Algorithms", "w": false },
        "1.2.840.113549.1.9.16.4.1": { "d": "certDist-ldap", "c": "S/MIME Certificate Distribution", "w": false },
        "1.2.840.113549.1.9.16.5.1": { "d": "sigPolicyQualifier-spuri x", "c": "S/MIME Signature Policy Qualifiers", "w": false },
        "1.2.840.113549.1.9.16.5.2": { "d": "sigPolicyQualifier-spUserNotice", "c": "S/MIME Signature Policy Qualifiers", "w": false },
        "1.2.840.113549.1.9.16.6.1": { "d": "proofOfOrigin", "c": "S/MIME Commitment Type Identifiers", "w": false },
        "1.2.840.113549.1.9.16.6.2": { "d": "proofOfReceipt", "c": "S/MIME Commitment Type Identifiers", "w": false },
        "1.2.840.113549.1.9.16.6.3": { "d": "proofOfDelivery", "c": "S/MIME Commitment Type Identifiers", "w": false },
        "1.2.840.113549.1.9.16.6.4": { "d": "proofOfSender", "c": "S/MIME Commitment Type Identifiers", "w": false },
        "1.2.840.113549.1.9.16.6.5": { "d": "proofOfApproval", "c": "S/MIME Commitment Type Identifiers", "w": false },
        "1.2.840.113549.1.9.16.6.6": { "d": "proofOfCreation", "c": "S/MIME Commitment Type Identifiers", "w": false },
        "1.2.840.113549.1.9.16.8.1": { "d": "glUseKEK", "c": "S/MIME Symmetric Key Distribution Attributes", "w": false },
        "1.2.840.113549.1.9.16.8.2": { "d": "glDelete", "c": "S/MIME Symmetric Key Distribution Attributes", "w": false },
        "1.2.840.113549.1.9.16.8.3": { "d": "glAddMember", "c": "S/MIME Symmetric Key Distribution Attributes", "w": false },
        "1.2.840.113549.1.9.16.8.4": { "d": "glDeleteMember", "c": "S/MIME Symmetric Key Distribution Attributes", "w": false },
        "1.2.840.113549.1.9.16.8.5": { "d": "glRekey", "c": "S/MIME Symmetric Key Distribution Attributes", "w": false },
        "1.2.840.113549.1.9.16.8.6": { "d": "glAddOwner", "c": "S/MIME Symmetric Key Distribution Attributes", "w": false },
        "1.2.840.113549.1.9.16.8.7": { "d": "glRemoveOwner", "c": "S/MIME Symmetric Key Distribution Attributes", "w": false },
        "1.2.840.113549.1.9.16.8.8": { "d": "glkCompromise", "c": "S/MIME Symmetric Key Distribution Attributes", "w": false },
        "1.2.840.113549.1.9.16.8.9": { "d": "glkRefresh", "c": "S/MIME Symmetric Key Distribution Attributes", "w": false },
        "1.2.840.113549.1.9.16.8.10": { "d": "glFailInfo", "c": "S/MIME Symmetric Key Distribution Attributes.  Obsolete", "w": true },
        "1.2.840.113549.1.9.16.8.11": { "d": "glaQueryRequest", "c": "S/MIME Symmetric Key Distribution Attributes", "w": false },
        "1.2.840.113549.1.9.16.8.12": { "d": "glaQueryResponse", "c": "S/MIME Symmetric Key Distribution Attributes", "w": false },
        "1.2.840.113549.1.9.16.8.13": { "d": "glProvideCert", "c": "S/MIME Symmetric Key Distribution Attributes", "w": false },
        "1.2.840.113549.1.9.16.8.14": { "d": "glUpdateCert", "c": "S/MIME Symmetric Key Distribution Attributes", "w": false },
        "1.2.840.113549.1.9.16.8.15": { "d": "glKey", "c": "S/MIME Symmetric Key Distribution Attributes", "w": false },
        "1.2.840.113549.1.9.16.9": { "d": "signatureTypeIdentifier", "c": "S/MIME", "w": false },
        "1.2.840.113549.1.9.16.9.1": { "d": "originatorSig", "c": "S/MIME Signature Type Identifier", "w": false },
        "1.2.840.113549.1.9.16.9.2": { "d": "domainSig", "c": "S/MIME Signature Type Identifier", "w": false },
        "1.2.840.113549.1.9.16.9.3": { "d": "additionalAttributesSig", "c": "S/MIME Signature Type Identifier", "w": false },
        "1.2.840.113549.1.9.16.9.4": { "d": "reviewSig", "c": "S/MIME Signature Type Identifier", "w": false },
        "1.2.840.113549.1.9.16.11": { "d": "capabilities", "c": "S/MIME", "w": false },
        "1.2.840.113549.1.9.16.11.1": { "d": "preferBinaryInside", "c": "S/MIME Capability", "w": false },
        "1.2.840.113549.1.9.20": { "d": "friendlyName (for PKCS #12)", "c": "PKCS #9 via PKCS #12", "w": false },
        "1.2.840.113549.1.9.21": { "d": "localKeyID (for PKCS #12)", "c": "PKCS #9 via PKCS #12", "w": false },
        "1.2.840.113549.1.9.22": { "d": "certTypes (for PKCS #12)", "c": "PKCS #9 via PKCS #12", "w": false },
        "1.2.840.113549.1.9.22.1": { "d": "x509Certificate (for PKCS #12)", "c": "PKCS #9 via PKCS #12", "w": false },
        "1.2.840.113549.1.9.22.2": { "d": "sdsiCertificate (for PKCS #12)", "c": "PKCS #9 via PKCS #12", "w": false },
        "1.2.840.113549.1.9.23": { "d": "crlTypes (for PKCS #12)", "c": "PKCS #9 via PKCS #12", "w": false },
        "1.2.840.113549.1.9.23.1": { "d": "x509Crl (for PKCS #12)", "c": "PKCS #9 via PKCS #12", "w": false },
        "1.2.840.113549.1.9.24": { "d": "pkcs9objectClass", "c": "PKCS #9/RFC 2985", "w": false },
        "1.2.840.113549.1.9.25": { "d": "pkcs9attributes", "c": "PKCS #9/RFC 2985", "w": false },
        "1.2.840.113549.1.9.25.1": { "d": "pkcs15Token", "c": "PKCS #9/RFC 2985 attribute", "w": false },
        "1.2.840.113549.1.9.25.2": { "d": "encryptedPrivateKeyInfo", "c": "PKCS #9/RFC 2985 attribute", "w": false },
        "1.2.840.113549.1.9.25.3": { "d": "randomNonce", "c": "PKCS #9/RFC 2985 attribute", "w": false },
        "1.2.840.113549.1.9.25.4": { "d": "sequenceNumber", "c": "PKCS #9/RFC 2985 attribute", "w": false },
        "1.2.840.113549.1.9.25.5": { "d": "pkcs7PDU", "c": "PKCS #9/RFC 2985 attribute", "w": false },
        "1.2.840.113549.1.9.26": { "d": "pkcs9syntax", "c": "PKCS #9/RFC 2985", "w": false },
        "1.2.840.113549.1.9.27": { "d": "pkcs9matchingRules", "c": "PKCS #9/RFC 2985", "w": false },
        "1.2.840.113549.1.12": { "d": "pkcs-12", "c": "", "w": false },
        "1.2.840.113549.1.12.1": { "d": "pkcs-12-PbeIds", "c": "This OID was formerly assigned as PKCS #12 modeID", "w": false },
        "1.2.840.113549.1.12.1.1": { "d": "pbeWithSHAAnd128BitRC4", "c": "PKCS #12 PbeIds. This OID was formerly assigned as pkcs-12-OfflineTransportMode", "w": false },
        "1.2.840.113549.1.12.1.2": { "d": "pbeWithSHAAnd40BitRC4", "c": "PKCS #12 PbeIds. This OID was formerly assigned as pkcs-12-OnlineTransportMode", "w": false },
        "1.2.840.113549.1.12.1.3": { "d": "pbeWithSHAAnd3-KeyTripleDES-CBC", "c": "PKCS #12 PbeIds", "w": false },
        "1.2.840.113549.1.12.1.4": { "d": "pbeWithSHAAnd2-KeyTripleDES-CBC", "c": "PKCS #12 PbeIds", "w": false },
        "1.2.840.113549.1.12.1.5": { "d": "pbeWithSHAAnd128BitRC2-CBC", "c": "PKCS #12 PbeIds", "w": false },
        "1.2.840.113549.1.12.1.6": { "d": "pbeWithSHAAnd40BitRC2-CBC", "c": "PKCS #12 PbeIds", "w": false },
        "1.2.840.113549.1.12.2": { "d": "pkcs-12-ESPVKID", "c": "Deprecated", "w": true },
        "1.2.840.113549.1.12.2.1": { "d": "pkcs-12-PKCS8KeyShrouding", "c": "PKCS #12 ESPVKID. Deprecated, use (1 2 840 113549 1 12 3 5) instead", "w": true },
        "1.2.840.113549.1.12.3": { "d": "pkcs-12-BagIds", "c": "", "w": false },
        "1.2.840.113549.1.12.3.1": { "d": "pkcs-12-keyBagId", "c": "PKCS #12 BagIds", "w": false },
        "1.2.840.113549.1.12.3.2": { "d": "pkcs-12-certAndCRLBagId", "c": "PKCS #12 BagIds", "w": false },
        "1.2.840.113549.1.12.3.3": { "d": "pkcs-12-secretBagId", "c": "PKCS #12 BagIds", "w": false },
        "1.2.840.113549.1.12.3.4": { "d": "pkcs-12-safeContentsId", "c": "PKCS #12 BagIds", "w": false },
        "1.2.840.113549.1.12.3.5": { "d": "pkcs-12-pkcs-8ShroudedKeyBagId", "c": "PKCS #12 BagIds", "w": false },
        "1.2.840.113549.1.12.4": { "d": "pkcs-12-CertBagID", "c": "Deprecated", "w": true },
        "1.2.840.113549.1.12.4.1": { "d": "pkcs-12-X509CertCRLBagID", "c": "PKCS #12 CertBagID. This OID was formerly assigned as pkcs-12-X509CertCRLBag", "w": false },
        "1.2.840.113549.1.12.4.2": { "d": "pkcs-12-SDSICertBagID", "c": "PKCS #12 CertBagID. This OID was formerly assigned as pkcs-12-SDSICertBag", "w": false },
        "1.2.840.113549.1.12.5": { "d": "pkcs-12-OID", "c": "", "w": true },
        "1.2.840.113549.1.12.5.1": { "d": "pkcs-12-PBEID", "c": "PKCS #12 OID. Deprecated, use the partially compatible (1 2 840 113549 1 12 1) OIDs instead", "w": true },
        "1.2.840.113549.1.12.5.1.1": { "d": "pkcs-12-PBEWithSha1And128BitRC4", "c": "PKCS #12 OID PBEID. Deprecated, use (1 2 840 113549 1 12 1 1) instead", "w": true },
        "1.2.840.113549.1.12.5.1.2": { "d": "pkcs-12-PBEWithSha1And40BitRC4", "c": "PKCS #12 OID PBEID. Deprecated, use (1 2 840 113549 1 12 1 2) instead", "w": true },
        "1.2.840.113549.1.12.5.1.3": { "d": "pkcs-12-PBEWithSha1AndTripleDESCBC", "c": "PKCS #12 OID PBEID. Deprecated, use the incompatible but similar (1 2 840 113549 1 12 1 3) or (1 2 840 113549 1 12 1 4) instead", "w": true },
        "1.2.840.113549.1.12.5.1.4": { "d": "pkcs-12-PBEWithSha1And128BitRC2CBC", "c": "PKCS #12 OID PBEID. Deprecated, use (1 2 840 113549 1 12 1 5) instead", "w": true },
        "1.2.840.113549.1.12.5.1.5": { "d": "pkcs-12-PBEWithSha1And40BitRC2CBC", "c": "PKCS #12 OID PBEID. Deprecated, use (1 2 840 113549 1 12 1 6) instead", "w": true },
        "1.2.840.113549.1.12.5.1.6": { "d": "pkcs-12-PBEWithSha1AndRC4", "c": "PKCS #12 OID PBEID. Deprecated, use the incompatible but similar (1 2 840 113549 1 12 1 1) or (1 2 840 113549 1 12 1 2) instead", "w": true },
        "1.2.840.113549.1.12.5.1.7": { "d": "pkcs-12-PBEWithSha1AndRC2CBC", "c": "PKCS #12 OID PBEID. Deprecated, use the incompatible but similar (1 2 840 113549 1 12 1 5) or (1 2 840 113549 1 12 1 6) instead", "w": true },
        "1.2.840.113549.1.12.5.2": { "d": "pkcs-12-EnvelopingID", "c": "PKCS #12 OID. Deprecated, use the conventional PKCS #1 OIDs instead", "w": false },
        "1.2.840.113549.1.12.5.2.1": { "d": "pkcs-12-RSAEncryptionWith128BitRC4", "c": "PKCS #12 OID EnvelopingID. Deprecated, use the conventional PKCS #1 OIDs instead", "w": true },
        "1.2.840.113549.1.12.5.2.2": { "d": "pkcs-12-RSAEncryptionWith40BitRC4", "c": "PKCS #12 OID EnvelopingID. Deprecated, use the conventional PKCS #1 OIDs instead", "w": true },
        "1.2.840.113549.1.12.5.2.3": { "d": "pkcs-12-RSAEncryptionWithTripleDES", "c": "PKCS #12 OID EnvelopingID. Deprecated, use the conventional PKCS #1 OIDs instead", "w": true },
        "1.2.840.113549.1.12.5.3": { "d": "pkcs-12-SignatureID", "c": "PKCS #12 OID EnvelopingID. Deprecated, use the conventional PKCS #1 OIDs instead", "w": true },
        "1.2.840.113549.1.12.5.3.1": { "d": "pkcs-12-RSASignatureWithSHA1Digest", "c": "PKCS #12 OID SignatureID. Deprecated, use the conventional PKCS #1 OIDs instead", "w": true },
        "1.2.840.113549.1.12.10": { "d": "pkcs-12Version1", "c": "", "w": false },
        "1.2.840.113549.1.12.10.1": { "d": "pkcs-12BadIds", "c": "", "w": false },
        "1.2.840.113549.1.12.10.1.1": { "d": "pkcs-12-keyBag", "c": "PKCS #12 BagIds", "w": false },
        "1.2.840.113549.1.12.10.1.2": { "d": "pkcs-12-pkcs-8ShroudedKeyBag", "c": "PKCS #12 BagIds", "w": false },
        "1.2.840.113549.1.12.10.1.3": { "d": "pkcs-12-certBag", "c": "PKCS #12 BagIds", "w": false },
        "1.2.840.113549.1.12.10.1.4": { "d": "pkcs-12-crlBag", "c": "PKCS #12 BagIds", "w": false },
        "1.2.840.113549.1.12.10.1.5": { "d": "pkcs-12-secretBag", "c": "PKCS #12 BagIds", "w": false },
        "1.2.840.113549.1.12.10.1.6": { "d": "pkcs-12-safeContentsBag", "c": "PKCS #12 BagIds", "w": false },
        "1.2.840.113549.1.15.1": { "d": "pkcs15modules", "c": "PKCS #15", "w": false },
        "1.2.840.113549.1.15.2": { "d": "pkcs15attributes", "c": "PKCS #15", "w": false },
        "1.2.840.113549.1.15.3": { "d": "pkcs15contentType", "c": "PKCS #15", "w": false },
        "1.2.840.113549.1.15.3.1": { "d": "pkcs15content", "c": "PKCS #15 content type", "w": false },
        "1.2.840.113549.2": { "d": "digestAlgorithm", "c": "", "w": false },
        "1.2.840.113549.2.2": { "d": "md2", "c": "RSADSI digestAlgorithm", "w": false },
        "1.2.840.113549.2.4": { "d": "md4", "c": "RSADSI digestAlgorithm", "w": false },
        "1.2.840.113549.2.5": { "d": "md5", "c": "RSADSI digestAlgorithm", "w": false },
        "1.2.840.113549.2.7": { "d": "hmacWithSHA1", "c": "RSADSI digestAlgorithm", "w": false },
        "1.2.840.113549.2.8": { "d": "hmacWithSHA224", "c": "RSADSI digestAlgorithm", "w": false },
        "1.2.840.113549.2.9": { "d": "hmacWithSHA256", "c": "RSADSI digestAlgorithm", "w": false },
        "1.2.840.113549.2.10": { "d": "hmacWithSHA384", "c": "RSADSI digestAlgorithm", "w": false },
        "1.2.840.113549.2.11": { "d": "hmacWithSHA512", "c": "RSADSI digestAlgorithm", "w": false },
        "1.2.840.113549.3": { "d": "encryptionAlgorithm", "c": "", "w": false },
        "1.2.840.113549.3.2": { "d": "rc2CBC", "c": "RSADSI encryptionAlgorithm", "w": false },
        "1.2.840.113549.3.3": { "d": "rc2ECB", "c": "RSADSI encryptionAlgorithm", "w": false },
        "1.2.840.113549.3.4": { "d": "rc4", "c": "RSADSI encryptionAlgorithm", "w": false },
        "1.2.840.113549.3.5": { "d": "rc4WithMAC", "c": "RSADSI encryptionAlgorithm", "w": false },
        "1.2.840.113549.3.6": { "d": "desx-CBC", "c": "RSADSI encryptionAlgorithm", "w": false },
        "1.2.840.113549.3.7": { "d": "des-EDE3-CBC", "c": "RSADSI encryptionAlgorithm", "w": false },
        "1.2.840.113549.3.8": { "d": "rc5CBC", "c": "RSADSI encryptionAlgorithm", "w": false },
        "1.2.840.113549.3.9": { "d": "rc5-CBCPad", "c": "RSADSI encryptionAlgorithm", "w": false },
        "1.2.840.113549.3.10": { "d": "desCDMF", "c": "RSADSI encryptionAlgorithm. Formerly called CDMFCBCPad", "w": false },
        "1.2.840.114021.1.6.1": { "d": "Identrus unknown policyIdentifier", "c": "Identrus", "w": false },
        "1.2.840.114021.4.1": { "d": "identrusOCSP", "c": "Identrus", "w": false },
        "1.2.840.113556.1.2.241": { "d": "deliveryMechanism", "c": "Microsoft Exchange Server - attribute", "w": false },
        "1.2.840.113556.1.3.0": { "d": "site-Addressing", "c": "Microsoft Exchange Server - object class", "w": false },
        "1.2.840.113556.1.3.13": { "d": "classSchema", "c": "Microsoft Exchange Server - object class", "w": false },
        "1.2.840.113556.1.3.14": { "d": "attributeSchema", "c": "Microsoft Exchange Server - object class", "w": false },
        "1.2.840.113556.1.3.17": { "d": "mailbox-Agent", "c": "Microsoft Exchange Server - object class", "w": false },
        "1.2.840.113556.1.3.22": { "d": "mailbox", "c": "Microsoft Exchange Server - object class", "w": false },
        "1.2.840.113556.1.3.23": { "d": "container", "c": "Microsoft Exchange Server - object class", "w": false },
        "1.2.840.113556.1.3.46": { "d": "mailRecipient", "c": "Microsoft Exchange Server - object class", "w": false },
        "1.2.840.113556.1.2.281": { "d": "ntSecurityDescriptor", "c": "Microsoft Cert Template - attribute", "w": false },
        "1.2.840.113556.1.4.145": { "d": "revision", "c": "Microsoft Cert Template - attribute", "w": false },
        "1.2.840.113556.1.4.1327": { "d": "pKIDefaultKeySpec", "c": "Microsoft Cert Template - attribute", "w": false },
        "1.2.840.113556.1.4.1328": { "d": "pKIKeyUsage", "c": "Microsoft Cert Template - attribute", "w": false },
        "1.2.840.113556.1.4.1329": { "d": "pKIMaxIssuingDepth", "c": "Microsoft Cert Template - attribute", "w": false },
        "1.2.840.113556.1.4.1330": { "d": "pKICriticalExtensions", "c": "Microsoft Cert Template - attribute", "w": false },
        "1.2.840.113556.1.4.1331": { "d": "pKIExpirationPeriod", "c": "Microsoft Cert Template - attribute", "w": false },
        "1.2.840.113556.1.4.1332": { "d": "pKIOverlapPeriod", "c": "Microsoft Cert Template - attribute", "w": false },
        "1.2.840.113556.1.4.1333": { "d": "pKIExtendedKeyUsage", "c": "Microsoft Cert Template - attribute", "w": false },
        "1.2.840.113556.1.4.1334": { "d": "pKIDefaultCSPs", "c": "Microsoft Cert Template - attribute", "w": false },
        "1.2.840.113556.1.4.1335": { "d": "pKIEnrollmentAccess", "c": "Microsoft Cert Template - attribute", "w": false },
        "1.2.840.113556.1.4.1429": { "d": "msPKI-RA-Signature", "c": "Microsoft Cert Template - attribute", "w": false },
        "1.2.840.113556.1.4.1430": { "d": "msPKI-Enrollment-Flag", "c": "Microsoft Cert Template - attribute", "w": false },
        "1.2.840.113556.1.4.1431": { "d": "msPKI-Private-Key-Flag", "c": "Microsoft Cert Template - attribute", "w": false },
        "1.2.840.113556.1.4.1432": { "d": "msPKI-Certificate-Name-Flag", "c": "Microsoft Cert Template - attribute", "w": false },
        "1.2.840.113556.1.4.1433": { "d": "msPKI-Minimal-Key-Size", "c": "Microsoft Cert Template - attribute", "w": false },
        "1.2.840.113556.1.4.1434": { "d": "msPKI-Template-Schema-Version", "c": "Microsoft Cert Template - attribute", "w": false },
        "1.2.840.113556.1.4.1435": { "d": "msPKI-Template-Minor-Revision", "c": "Microsoft Cert Template - attribute", "w": false },
        "1.2.840.113556.1.4.1436": { "d": "msPKI-Cert-Template-OID", "c": "Microsoft Cert Template - attribute", "w": false },
        "1.2.840.113556.1.4.1437": { "d": "msPKI-Supersede-Templates", "c": "Microsoft Cert Template - attribute", "w": false },
        "1.2.840.113556.1.4.1438": { "d": "msPKI-RA-Policies", "c": "Microsoft Cert Template - attribute", "w": false },
        "1.2.840.113556.1.4.1439": { "d": "msPKI-Certificate-Policy", "c": "Microsoft Cert Template - attribute", "w": false },
        "1.2.840.113556.1.4.1674": { "d": "msPKI-Certificate-Application-Policy", "c": "Microsoft Cert Template - attribute", "w": false },
        "1.2.840.113556.1.4.1675": { "d": "msPKI-RA-Application-Policies", "c": "Microsoft Cert Template - attribute", "w": false },
        "1.2.840.113556.4.3": { "d": "microsoftExcel", "c": "Microsoft", "w": false },
        "1.2.840.113556.4.4": { "d": "titledWithOID", "c": "Microsoft", "w": false },
        "1.2.840.113556.4.5": { "d": "microsoftPowerPoint", "c": "Microsoft", "w": false },
        "1.2.840.113628.114.1.7": { "d": "adobePKCS7", "c": "Adobe", "w": false },
        "1.2.840.113635.100": { "d": "appleDataSecurity", "c": "Apple", "w": false },
        "1.2.840.113635.100.1": { "d": "appleTrustPolicy", "c": "Apple", "w": false },
        "1.2.840.113635.100.1.1": { "d": "appleISignTP", "c": "Apple trust policy", "w": false },
        "1.2.840.113635.100.1.2": { "d": "appleX509Basic", "c": "Apple trust policy", "w": false },
        "1.2.840.113635.100.1.3": { "d": "appleSSLPolicy", "c": "Apple trust policy", "w": false },
        "1.2.840.113635.100.1.4": { "d": "appleLocalCertGenPolicy", "c": "Apple trust policy", "w": false },
        "1.2.840.113635.100.1.5": { "d": "appleCSRGenPolicy", "c": "Apple trust policy", "w": false },
        "1.2.840.113635.100.1.6": { "d": "appleCRLPolicy", "c": "Apple trust policy", "w": false },
        "1.2.840.113635.100.1.7": { "d": "appleOCSPPolicy", "c": "Apple trust policy", "w": false },
        "1.2.840.113635.100.1.8": { "d": "appleSMIMEPolicy", "c": "Apple trust policy", "w": false },
        "1.2.840.113635.100.1.9": { "d": "appleEAPPolicy", "c": "Apple trust policy", "w": false },
        "1.2.840.113635.100.1.10": { "d": "appleSWUpdateSigningPolicy", "c": "Apple trust policy", "w": false },
        "1.2.840.113635.100.1.11": { "d": "appleIPSecPolicy", "c": "Apple trust policy", "w": false },
        "1.2.840.113635.100.1.12": { "d": "appleIChatPolicy", "c": "Apple trust policy", "w": false },
        "1.2.840.113635.100.1.13": { "d": "appleResourceSignPolicy", "c": "Apple trust policy", "w": false },
        "1.2.840.113635.100.1.14": { "d": "applePKINITClientPolicy", "c": "Apple trust policy", "w": false },
        "1.2.840.113635.100.1.15": { "d": "applePKINITServerPolicy", "c": "Apple trust policy", "w": false },
        "1.2.840.113635.100.1.16": { "d": "appleCodeSigningPolicy", "c": "Apple trust policy", "w": false },
        "1.2.840.113635.100.1.17": { "d": "applePackageSigningPolicy", "c": "Apple trust policy", "w": false },
        "1.2.840.113635.100.2": { "d": "appleSecurityAlgorithm", "c": "Apple", "w": false },
        "1.2.840.113635.100.2.1": { "d": "appleFEE", "c": "Apple security algorithm", "w": false },
        "1.2.840.113635.100.2.2": { "d": "appleASC", "c": "Apple security algorithm", "w": false },
        "1.2.840.113635.100.2.3": { "d": "appleFEE_MD5", "c": "Apple security algorithm", "w": false },
        "1.2.840.113635.100.2.4": { "d": "appleFEE_SHA1", "c": "Apple security algorithm", "w": false },
        "1.2.840.113635.100.2.5": { "d": "appleFEED", "c": "Apple security algorithm", "w": false },
        "1.2.840.113635.100.2.6": { "d": "appleFEEDEXP", "c": "Apple security algorithm", "w": false },
        "1.2.840.113635.100.2.7": { "d": "appleECDSA", "c": "Apple security algorithm", "w": false },
        "1.2.840.113635.100.3": { "d": "appleDotMacCertificate", "c": "Apple", "w": false },
        "1.2.840.113635.100.3.1": { "d": "appleDotMacCertificateRequest", "c": "Apple dotMac certificate", "w": false },
        "1.2.840.113635.100.3.2": { "d": "appleDotMacCertificateExtension", "c": "Apple dotMac certificate", "w": false },
        "1.2.840.113635.100.3.3": { "d": "appleDotMacCertificateRequestValues", "c": "Apple dotMac certificate", "w": false },
        "1.2.840.113635.100.4": { "d": "appleExtendedKeyUsage", "c": "Apple", "w": false },
        "1.2.840.113635.100.4.1": { "d": "appleCodeSigning", "c": "Apple extended key usage", "w": false },
        "1.2.840.113635.100.4.1.1": { "d": "appleCodeSigningDevelopment", "c": "Apple extended key usage", "w": false },
        "1.2.840.113635.100.4.1.2": { "d": "appleSoftwareUpdateSigning", "c": "Apple extended key usage", "w": false },
        "1.2.840.113635.100.4.1.3": { "d": "appleCodeSigningThirdParty", "c": "Apple extended key usage", "w": false },
        "1.2.840.113635.100.4.1.4": { "d": "appleResourceSigning", "c": "Apple extended key usage", "w": false },
        "1.2.840.113635.100.4.2": { "d": "appleIChatSigning", "c": "Apple extended key usage", "w": false },
        "1.2.840.113635.100.4.3": { "d": "appleIChatEncryption", "c": "Apple extended key usage", "w": false },
        "1.2.840.113635.100.4.4": { "d": "appleSystemIdentity", "c": "Apple extended key usage", "w": false },
        "1.2.840.113635.100.4.5": { "d": "appleCryptoEnv", "c": "Apple extended key usage", "w": false },
        "1.2.840.113635.100.4.5.1": { "d": "appleCryptoProductionEnv", "c": "Apple extended key usage", "w": false },
        "1.2.840.113635.100.4.5.2": { "d": "appleCryptoMaintenanceEnv", "c": "Apple extended key usage", "w": false },
        "1.2.840.113635.100.4.5.3": { "d": "appleCryptoTestEnv", "c": "Apple extended key usage", "w": false },
        "1.2.840.113635.100.4.5.4": { "d": "appleCryptoDevelopmentEnv", "c": "Apple extended key usage", "w": false },
        "1.2.840.113635.100.4.6": { "d": "appleCryptoQoS", "c": "Apple extended key usage", "w": false },
        "1.2.840.113635.100.4.6.1": { "d": "appleCryptoTier0QoS", "c": "Apple extended key usage", "w": false },
        "1.2.840.113635.100.4.6.2": { "d": "appleCryptoTier1QoS", "c": "Apple extended key usage", "w": false },
        "1.2.840.113635.100.4.6.3": { "d": "appleCryptoTier2QoS", "c": "Apple extended key usage", "w": false },
        "1.2.840.113635.100.4.6.4": { "d": "appleCryptoTier3QoS", "c": "Apple extended key usage", "w": false },
        "1.2.840.113635.100.5": { "d": "appleCertificatePolicies", "c": "Apple", "w": false },
        "1.2.840.113635.100.5.1": { "d": "appleCertificatePolicyID", "c": "Apple", "w": false },
        "1.2.840.113635.100.5.2": { "d": "appleDotMacCertificatePolicyID", "c": "Apple", "w": false },
        "1.2.840.113635.100.5.3": { "d": "appleADCCertificatePolicyID", "c": "Apple", "w": false },
        "1.2.840.113635.100.6": { "d": "appleCertificateExtensions", "c": "Apple", "w": false },
        "1.2.840.113635.100.6.1": { "d": "appleCertificateExtensionCodeSigning", "c": "Apple certificate extension", "w": false },
        "1.2.840.113635.100.6.1.1": { "d": "appleCertificateExtensionAppleSigning", "c": "Apple certificate extension", "w": false },
        "1.2.840.113635.100.6.1.2": { "d": "appleCertificateExtensionADCDeveloperSigning", "c": "Apple certificate extension", "w": false },
        "1.2.840.113635.100.6.1.3": { "d": "appleCertificateExtensionADCAppleSigning", "c": "Apple certificate extension", "w": false },
        "1.3.6.1.4.1.311.2.1.4": { "d": "spcIndirectDataContext", "c": "Microsoft code signing", "w": false },
        "1.3.6.1.4.1.311.2.1.10": { "d": "spcAgencyInfo", "c": "Microsoft code signing. Also known as policyLink", "w": false },
        "1.3.6.1.4.1.311.2.1.11": { "d": "spcStatementType", "c": "Microsoft code signing", "w": false },
        "1.3.6.1.4.1.311.2.1.12": { "d": "spcSpOpusInfo", "c": "Microsoft code signing", "w": false },
        "1.3.6.1.4.1.311.2.1.14": { "d": "certReqExtensions", "c": "Microsoft", "w": false },
        "1.3.6.1.4.1.311.2.1.15": { "d": "spcPEImageData", "c": "Microsoft code signing", "w": false },
        "1.3.6.1.4.1.311.2.1.18": { "d": "spcRawFileData", "c": "Microsoft code signing", "w": false },
        "1.3.6.1.4.1.311.2.1.19": { "d": "spcStructuredStorageData", "c": "Microsoft code signing", "w": false },
        "1.3.6.1.4.1.311.2.1.20": { "d": "spcJavaClassData (type 1)", "c": "Microsoft code signing. Formerly \"link extension\" aka \"glue extension\"", "w": false },
        "1.3.6.1.4.1.311.2.1.21": { "d": "individualCodeSigning", "c": "Microsoft", "w": false },
        "1.3.6.1.4.1.311.2.1.22": { "d": "commercialCodeSigning", "c": "Microsoft", "w": false },
        "1.3.6.1.4.1.311.2.1.25": { "d": "spcLink (type 2)", "c": "Microsoft code signing. Also known as \"glue extension\"", "w": false },
        "1.3.6.1.4.1.311.2.1.26": { "d": "spcMinimalCriteriaInfo", "c": "Microsoft code signing", "w": false },
        "1.3.6.1.4.1.311.2.1.27": { "d": "spcFinancialCriteriaInfo", "c": "Microsoft code signing", "w": false },
        "1.3.6.1.4.1.311.2.1.28": { "d": "spcLink (type 3)", "c": "Microsoft code signing.  Also known as \"glue extension\"", "w": false },
        "1.3.6.1.4.1.311.3.2.1": { "d": "timestampRequest", "c": "Microsoft code signing", "w": false },
        "1.3.6.1.4.1.311.10.1": { "d": "certTrustList", "c": "Microsoft contentType", "w": false },
        "1.3.6.1.4.1.311.10.1.1": { "d": "sortedCtl", "c": "Microsoft contentType", "w": false },
        "1.3.6.1.4.1.311.10.2": { "d": "nextUpdateLocation", "c": "Microsoft", "w": false },
        "1.3.6.1.4.1.311.10.3.1": { "d": "certTrustListSigning", "c": "Microsoft enhanced key usage", "w": false },
        "1.3.6.1.4.1.311.10.3.2": { "d": "timeStampSigning", "c": "Microsoft enhanced key usage", "w": false },
        "1.3.6.1.4.1.311.10.3.3": { "d": "serverGatedCrypto", "c": "Microsoft enhanced key usage", "w": false },
        "1.3.6.1.4.1.311.10.3.3.1": { "d": "serialized", "c": "Microsoft", "w": false },
        "1.3.6.1.4.1.311.10.3.4": { "d": "encryptedFileSystem", "c": "Microsoft enhanced key usage", "w": false },
        "1.3.6.1.4.1.311.10.3.5": { "d": "whqlCrypto", "c": "Microsoft enhanced key usage", "w": false },
        "1.3.6.1.4.1.311.10.3.6": { "d": "nt5Crypto", "c": "Microsoft enhanced key usage", "w": false },
        "1.3.6.1.4.1.311.10.3.7": { "d": "oemWHQLCrypto", "c": "Microsoft enhanced key usage", "w": false },
        "1.3.6.1.4.1.311.10.3.8": { "d": "embeddedNTCrypto", "c": "Microsoft enhanced key usage", "w": false },
        "1.3.6.1.4.1.311.10.3.9": { "d": "rootListSigner", "c": "Microsoft enhanced key usage", "w": false },
        "1.3.6.1.4.1.311.10.3.10": { "d": "qualifiedSubordination", "c": "Microsoft enhanced key usage", "w": false },
        "1.3.6.1.4.1.311.10.3.11": { "d": "keyRecovery", "c": "Microsoft enhanced key usage", "w": false },
        "1.3.6.1.4.1.311.10.3.12": { "d": "documentSigning", "c": "Microsoft enhanced key usage", "w": false },
        "1.3.6.1.4.1.311.10.3.13": { "d": "lifetimeSigning", "c": "Microsoft enhanced key usage", "w": false },
        "1.3.6.1.4.1.311.10.3.14": { "d": "mobileDeviceSoftware", "c": "Microsoft enhanced key usage", "w": false },
        "1.3.6.1.4.1.311.10.3.15": { "d": "smartDisplay", "c": "Microsoft enhanced key usage", "w": false },
        "1.3.6.1.4.1.311.10.3.16": { "d": "cspSignature", "c": "Microsoft enhanced key usage", "w": false },
        "1.3.6.1.4.1.311.10.3.4.1": { "d": "efsRecovery", "c": "Microsoft enhanced key usage", "w": false },
        "1.3.6.1.4.1.311.10.4.1": { "d": "yesnoTrustAttr", "c": "Microsoft attribute", "w": false },
        "1.3.6.1.4.1.311.10.5.1": { "d": "drm", "c": "Microsoft enhanced key usage", "w": false },
        "1.3.6.1.4.1.311.10.5.2": { "d": "drmIndividualization", "c": "Microsoft enhanced key usage", "w": false },
        "1.3.6.1.4.1.311.10.6.1": { "d": "licenses", "c": "Microsoft enhanced key usage", "w": false },
        "1.3.6.1.4.1.311.10.6.2": { "d": "licenseServer", "c": "Microsoft enhanced key usage", "w": false },
        "1.3.6.1.4.1.311.10.7.1": { "d": "keyidRdn", "c": "Microsoft attribute", "w": false },
        "1.3.6.1.4.1.311.10.8.1": { "d": "removeCertificate", "c": "Microsoft attribute", "w": false },
        "1.3.6.1.4.1.311.10.9.1": { "d": "crossCertDistPoints", "c": "Microsoft attribute", "w": false },
        "1.3.6.1.4.1.311.10.10.1": { "d": "cmcAddAttributes", "c": "Microsoft", "w": false },
        "1.3.6.1.4.1.311.10.11": { "d": "certPropIdPrefix", "c": "Microsoft", "w": false },
        "1.3.6.1.4.1.311.10.11.4": { "d": "certMd5HashPropId", "c": "Microsoft", "w": false },
        "1.3.6.1.4.1.311.10.11.20": { "d": "certKeyIdentifierPropId", "c": "Microsoft", "w": false },
        "1.3.6.1.4.1.311.10.11.28": { "d": "certIssuerSerialNumberMd5HashPropId", "c": "Microsoft", "w": false },
        "1.3.6.1.4.1.311.10.11.29": { "d": "certSubjectNameMd5HashPropId", "c": "Microsoft", "w": false },
        "1.3.6.1.4.1.311.10.12.1": { "d": "anyApplicationPolicy", "c": "Microsoft attribute", "w": false },
        "1.3.6.1.4.1.311.13.1": { "d": "renewalCertificate", "c": "Microsoft attribute", "w": false },
        "1.3.6.1.4.1.311.13.2.1": { "d": "enrolmentNameValuePair", "c": "Microsoft attribute", "w": false },
        "1.3.6.1.4.1.311.13.2.2": { "d": "enrolmentCSP", "c": "Microsoft attribute", "w": false },
        "1.3.6.1.4.1.311.13.2.3": { "d": "osVersion", "c": "Microsoft attribute", "w": false },
        "1.3.6.1.4.1.311.16.4": { "d": "microsoftRecipientInfo", "c": "Microsoft attribute", "w": false },
        "1.3.6.1.4.1.311.17.1": { "d": "pkcs12KeyProviderNameAttr", "c": "Microsoft attribute", "w": false },
        "1.3.6.1.4.1.311.17.2": { "d": "localMachineKeyset", "c": "Microsoft attribute", "w": false },
        "1.3.6.1.4.1.311.17.3": { "d": "pkcs12ExtendedAttributes", "c": "Microsoft attribute", "w": false },
        "1.3.6.1.4.1.311.20.1": { "d": "autoEnrollCtlUsage", "c": "Microsoft", "w": false },
        "1.3.6.1.4.1.311.20.2": { "d": "enrollCerttypeExtension", "c": "Microsoft CAPICOM certificate template, V1", "w": false },
        "1.3.6.1.4.1.311.20.2.1": { "d": "enrollmentAgent", "c": "Microsoft enhanced key usage", "w": false },
        "1.3.6.1.4.1.311.20.2.2": { "d": "smartcardLogon", "c": "Microsoft enhanced key usage", "w": false },
        "1.3.6.1.4.1.311.20.2.3": { "d": "universalPrincipalName", "c": "Microsoft UPN", "w": false },
        "1.3.6.1.4.1.311.20.3": { "d": "certManifold", "c": "Microsoft", "w": false },
        "1.3.6.1.4.1.311.21.1": { "d": "cAKeyCertIndexPair", "c": "Microsoft attribute.  Also known as certsrvCaVersion", "w": false },
        "1.3.6.1.4.1.311.21.5": { "d": "caExchange", "c": "Microsoft extended key usage", "w": true },
        "1.3.6.1.4.1.311.21.2": { "d": "certSrvPreviousCertHash", "c": "Microsoft", "w": false },
        "1.3.6.1.4.1.311.21.3": { "d": "crlVirtualBase", "c": "Microsoft", "w": false },
        "1.3.6.1.4.1.311.21.4": { "d": "crlNextPublish", "c": "Microsoft", "w": false },
        "1.3.6.1.4.1.311.21.6": { "d": "keyRecovery", "c": "Microsoft extended key usage", "w": true },
        "1.3.6.1.4.1.311.21.7": { "d": "certificateTemplate", "c": "Microsoft CAPICOM certificate template, V2", "w": false },
        "1.3.6.1.4.1.311.21.9": { "d": "rdnDummySigner", "c": "Microsoft", "w": false },
        "1.3.6.1.4.1.311.21.10": { "d": "applicationCertPolicies", "c": "Microsoft", "w": false },
        "1.3.6.1.4.1.311.21.11": { "d": "applicationPolicyMappings", "c": "Microsoft", "w": false },
        "1.3.6.1.4.1.311.21.12": { "d": "applicationPolicyConstraints", "c": "Microsoft", "w": false },
        "1.3.6.1.4.1.311.21.13": { "d": "archivedKey", "c": "Microsoft attribute", "w": false },
        "1.3.6.1.4.1.311.21.14": { "d": "crlSelfCDP", "c": "Microsoft", "w": false },
        "1.3.6.1.4.1.311.21.15": { "d": "requireCertChainPolicy", "c": "Microsoft", "w": false },
        "1.3.6.1.4.1.311.21.16": { "d": "archivedKeyCertHash", "c": "Microsoft", "w": false },
        "1.3.6.1.4.1.311.21.17": { "d": "issuedCertHash", "c": "Microsoft", "w": false },
        "1.3.6.1.4.1.311.21.19": { "d": "dsEmailReplication", "c": "Microsoft", "w": false },
        "1.3.6.1.4.1.311.21.20": { "d": "requestClientInfo", "c": "Microsoft attribute", "w": false },
        "1.3.6.1.4.1.311.21.21": { "d": "encryptedKeyHash", "c": "Microsoft attribute", "w": false },
        "1.3.6.1.4.1.311.21.22": { "d": "certsrvCrossCaVersion", "c": "Microsoft", "w": false },
        "1.3.6.1.4.1.311.25.1": { "d": "ntdsReplication", "c": "Microsoft", "w": false },
        "1.3.6.1.4.1.311.31.1": { "d": "productUpdate", "c": "Microsoft attribute", "w": false },
        "1.3.6.1.4.1.311.47.1.1": { "d": "systemHealth", "c": "Microsoft extended key usage", "w": false },
        "1.3.6.1.4.1.311.47.1.3": { "d": "systemHealthLoophole", "c": "Microsoft extended key usage", "w": false },
        "1.3.6.1.4.1.311.60.1.1": { "d": "rootProgramFlags", "c": "Microsoft policy attribute", "w": false },
        "1.3.6.1.4.1.311.61.1.1": { "d": "kernelModeCodeSigning", "c": "Microsoft enhanced key usage", "w": false },
        "1.3.6.1.4.1.311.60.2.1.1": { "d": "jurisdictionOfIncorporationL", "c": "Microsoft (???)", "w": false },
        "1.3.6.1.4.1.311.60.2.1.2": { "d": "jurisdictionOfIncorporationSP", "c": "Microsoft (???)", "w": false },
        "1.3.6.1.4.1.311.60.2.1.3": { "d": "jurisdictionOfIncorporationC", "c": "Microsoft (???)", "w": false },
        "1.3.6.1.4.1.311.88.2.1": { "d": "originalFilename", "c": "Microsoft attribute", "w": false },
        "1.3.6.1.4.1.188.7.1.1": { "d": "ascom", "c": "Ascom Systech", "w": false },
        "1.3.6.1.4.1.188.7.1.1.1": { "d": "ideaECB", "c": "Ascom Systech", "w": false },
        "1.3.6.1.4.1.188.7.1.1.2": { "d": "ideaCBC", "c": "Ascom Systech", "w": false },
        "1.3.6.1.4.1.188.7.1.1.3": { "d": "ideaCFB", "c": "Ascom Systech", "w": false },
        "1.3.6.1.4.1.188.7.1.1.4": { "d": "ideaOFB", "c": "Ascom Systech", "w": false },
        "1.3.6.1.4.1.2428.10.1.1": { "d": "UNINETT policyIdentifier", "c": "UNINETT PCA", "w": false },
        "1.3.6.1.4.1.2712.10": { "d": "ICE-TEL policyIdentifier", "c": "ICE-TEL CA", "w": false },
        "1.3.6.1.4.1.2786.1.1.1": { "d": "ICE-TEL Italian policyIdentifier", "c": "ICE-TEL CA policy", "w": false },
        "1.3.6.1.4.1.3029.1.1.1": { "d": "blowfishECB", "c": "cryptlib encryption algorithm", "w": false },
        "1.3.6.1.4.1.3029.1.1.2": { "d": "blowfishCBC", "c": "cryptlib encryption algorithm", "w": false },
        "1.3.6.1.4.1.3029.1.1.3": { "d": "blowfishCFB", "c": "cryptlib encryption algorithm", "w": false },
        "1.3.6.1.4.1.3029.1.1.4": { "d": "blowfishOFB", "c": "cryptlib encryption algorithm", "w": false },
        "1.3.6.1.4.1.3029.1.2.1": { "d": "elgamal", "c": "cryptlib public-key algorithm", "w": false },
        "1.3.6.1.4.1.3029.1.2.1.1": { "d": "elgamalWithSHA-1", "c": "cryptlib public-key algorithm", "w": false },
        "1.3.6.1.4.1.3029.1.2.1.2": { "d": "elgamalWithRIPEMD-160", "c": "cryptlib public-key algorithm", "w": false },
        "1.3.6.1.4.1.3029.3.1.1": { "d": "cryptlibPresenceCheck", "c": "cryptlib attribute type", "w": false },
        "1.3.6.1.4.1.3029.3.1.2": { "d": "pkiBoot", "c": "cryptlib attribute type", "w": false },
        "1.3.6.1.4.1.3029.3.1.4": { "d": "crlExtReason", "c": "cryptlib attribute type", "w": false },
        "1.3.6.1.4.1.3029.3.1.5": { "d": "keyFeatures", "c": "cryptlib attribute type", "w": false },
        "1.3.6.1.4.1.3029.4.1": { "d": "cryptlibContent", "c": "cryptlib", "w": false },
        "1.3.6.1.4.1.3029.4.1.1": { "d": "cryptlibConfigData", "c": "cryptlib content type", "w": false },
        "1.3.6.1.4.1.3029.4.1.2": { "d": "cryptlibUserIndex", "c": "cryptlib content type", "w": false },
        "1.3.6.1.4.1.3029.4.1.3": { "d": "cryptlibUserInfo", "c": "cryptlib content type", "w": false },
        "1.3.6.1.4.1.3029.4.1.4": { "d": "rtcsRequest", "c": "cryptlib content type", "w": false },
        "1.3.6.1.4.1.3029.4.1.5": { "d": "rtcsResponse", "c": "cryptlib content type", "w": false },
        "1.3.6.1.4.1.3029.4.1.6": { "d": "rtcsResponseExt", "c": "cryptlib content type", "w": false },
        "1.3.6.1.4.1.3029.42.11172.1": { "d": "mpeg-1", "c": "cryptlib special MPEG-of-cat OID", "w": false },
        "1.3.6.1.4.1.3029.54.11940.54": { "d": "TSA policy \"Anything that arrives, we sign\"", "c": "cryptlib TSA policy", "w": false },
        "1.3.6.1.4.1.3029.88.89.90.90.89": { "d": "xYZZY policyIdentifier", "c": "cryptlib certificate policy", "w": false },
        "1.3.6.1.4.1.3401.8.1.1": { "d": "pgpExtension", "c": "PGP key information", "w": false },
        "1.3.6.1.4.1.3576.7": { "d": "eciaAscX12Edi", "c": "TMN EDI for Interactive Agents", "w": false },
        "1.3.6.1.4.1.3576.7.1": { "d": "plainEDImessage", "c": "TMN EDI for Interactive Agents", "w": false },
        "1.3.6.1.4.1.3576.7.2": { "d": "signedEDImessage", "c": "TMN EDI for Interactive Agents", "w": false },
        "1.3.6.1.4.1.3576.7.5": { "d": "integrityEDImessage", "c": "TMN EDI for Interactive Agents", "w": false },
        "1.3.6.1.4.1.3576.7.65": { "d": "iaReceiptMessage", "c": "TMN EDI for Interactive Agents", "w": false },
        "1.3.6.1.4.1.3576.7.97": { "d": "iaStatusMessage", "c": "TMN EDI for Interactive Agents", "w": false },
        "1.3.6.1.4.1.3576.8": { "d": "eciaEdifact", "c": "TMN EDI for Interactive Agents", "w": false },
        "1.3.6.1.4.1.3576.9": { "d": "eciaNonEdi", "c": "TMN EDI for Interactive Agents", "w": false },
        "1.3.6.1.4.1.4146": { "d": "Globalsign", "c": "Globalsign", "w": false },
        "1.3.6.1.4.1.4146.1": { "d": "globalsignPolicy", "c": "Globalsign", "w": false },
        "1.3.6.1.4.1.4146.1.10": { "d": "globalsignDVPolicy", "c": "Globalsign policy", "w": false },
        "1.3.6.1.4.1.4146.1.20": { "d": "globalsignOVPolicy", "c": "Globalsign policy", "w": false },
        "1.3.6.1.4.1.4146.1.30": { "d": "globalsignTSAPolicy", "c": "Globalsign policy", "w": false },
        "1.3.6.1.4.1.4146.1.40": { "d": "globalsignClientCertPolicy", "c": "Globalsign policy", "w": false },
        "1.3.6.1.4.1.4146.1.50": { "d": "globalsignCodeSignPolicy", "c": "Globalsign policy", "w": false },
        "1.3.6.1.4.1.4146.1.60": { "d": "globalsignRootSignPolicy", "c": "Globalsign policy", "w": false },
        "1.3.6.1.4.1.4146.1.70": { "d": "globalsignTrustedRootPolicy", "c": "Globalsign policy", "w": false },
        "1.3.6.1.4.1.4146.1.80": { "d": "globalsignEDIClientPolicy", "c": "Globalsign policy", "w": false },
        "1.3.6.1.4.1.4146.1.81": { "d": "globalsignEDIServerPolicy", "c": "Globalsign policy", "w": false },
        "1.3.6.1.4.1.4146.1.90": { "d": "globalsignTPMRootPolicy", "c": "Globalsign policy", "w": false },
        "1.3.6.1.4.1.4146.1.95": { "d": "globalsignOCSPPolicy", "c": "Globalsign policy", "w": false },
        "1.3.6.1.4.1.5309.1": { "d": "edelWebPolicy", "c": "EdelWeb policy", "w": false },
        "1.3.6.1.4.1.5309.1.2": { "d": "edelWebCustomerPolicy", "c": "EdelWeb policy", "w": false },
        "1.3.6.1.4.1.5309.1.2.1": { "d": "edelWebClepsydrePolicy", "c": "EdelWeb policy", "w": false },
        "1.3.6.1.4.1.5309.1.2.2": { "d": "edelWebExperimentalTSAPolicy", "c": "EdelWeb policy", "w": false },
        "1.3.6.1.4.1.5309.1.2.3": { "d": "edelWebOpenEvidenceTSAPolicy", "c": "EdelWeb policy", "w": false },
        "1.3.6.1.4.1.5472": { "d": "timeproof", "c": "enterprise", "w": false },
        "1.3.6.1.4.1.5472.1": { "d": "tss", "c": "timeproof", "w": false },
        "1.3.6.1.4.1.5472.1.1": { "d": "tss80", "c": "timeproof TSS", "w": false },
        "1.3.6.1.4.1.5472.1.2": { "d": "tss380", "c": "timeproof TSS", "w": false },
        "1.3.6.1.4.1.5472.1.3": { "d": "tss400", "c": "timeproof TSS", "w": false },
        "1.3.6.1.4.1.5770.0.3": { "d": "secondaryPractices", "c": "MEDePass", "w": false },
        "1.3.6.1.4.1.5770.0.4": { "d": "physicianIdentifiers", "c": "MEDePass", "w": false },
        "1.3.6.1.4.1.6449.1.2.1.3.1": { "d": "comodoPolicy", "c": "Comodo CA", "w": false },
        "1.3.6.1.4.1.6449.1.2.2.15": { "d": "wotrustPolicy", "c": "WoTrust (Comodo) CA", "w": false },
        "1.3.6.1.4.1.6449.1.3.5.2": { "d": "comodoCertifiedDeliveryService", "c": "Comodo CA", "w": false },
        "1.3.6.1.4.1.6449.2.1.1": { "d": "comodoTimestampingPolicy", "c": "Comodo CA", "w": false },
        "1.3.6.1.4.1.8301.3.5.1": { "d": "validityModelChain", "c": "TU Darmstadt ValidityModel", "w": false },
        "1.3.6.1.4.1.8301.3.5.2": { "d": "validityModelShell", "c": "ValidityModel", "w": false },
        "1.3.6.1.4.1.8231.1": { "d": "rolUnicoNacional", "c": "Chilean Government national unique roll number", "w": false },
        "1.3.6.1.4.1.11591": { "d": "gnu", "c": "GNU Project (see http://www.gnupg.org/oids.html)", "w": false },
        "1.3.6.1.4.1.11591.1": { "d": "gnuRadius", "c": "GNU Radius", "w": false },
        "1.3.6.1.4.1.11591.3": { "d": "gnuRadar", "c": "GNU Radar", "w": false },
        "1.3.6.1.4.1.11591.12": { "d": "gnuDigestAlgorithm", "c": "GNU digest algorithm", "w": false },
        "1.3.6.1.4.1.11591.12.2": { "d": "tiger", "c": "GNU digest algorithm", "w": false },
        "1.3.6.1.4.1.11591.13": { "d": "gnuEncryptionAlgorithm", "c": "GNU encryption algorithm", "w": false },
        "1.3.6.1.4.1.11591.13.2": { "d": "serpent", "c": "GNU encryption algorithm", "w": false },
        "1.3.6.1.4.1.11591.13.2.1": { "d": "serpent128_ECB", "c": "GNU encryption algorithm", "w": false },
        "1.3.6.1.4.1.11591.13.2.2": { "d": "serpent128_CBC", "c": "GNU encryption algorithm", "w": false },
        "1.3.6.1.4.1.11591.13.2.3": { "d": "serpent128_OFB", "c": "GNU encryption algorithm", "w": false },
        "1.3.6.1.4.1.11591.13.2.4": { "d": "serpent128_CFB", "c": "GNU encryption algorithm", "w": false },
        "1.3.6.1.4.1.11591.13.2.21": { "d": "serpent192_ECB", "c": "GNU encryption algorithm", "w": false },
        "1.3.6.1.4.1.11591.13.2.22": { "d": "serpent192_CBC", "c": "GNU encryption algorithm", "w": false },
        "1.3.6.1.4.1.11591.13.2.23": { "d": "serpent192_OFB", "c": "GNU encryption algorithm", "w": false },
        "1.3.6.1.4.1.11591.13.2.24": { "d": "serpent192_CFB", "c": "GNU encryption algorithm", "w": false },
        "1.3.6.1.4.1.11591.13.2.41": { "d": "serpent256_ECB", "c": "GNU encryption algorithm", "w": false },
        "1.3.6.1.4.1.11591.13.2.42": { "d": "serpent256_CBC", "c": "GNU encryption algorithm", "w": false },
        "1.3.6.1.4.1.11591.13.2.43": { "d": "serpent256_OFB", "c": "GNU encryption algorithm", "w": false },
        "1.3.6.1.4.1.11591.13.2.44": { "d": "serpent256_CFB", "c": "GNU encryption algorithm", "w": false },
        "1.3.6.1.4.1.16334.509.1.1": { "d": "Northrop Grumman extKeyUsage?", "c": "Northrop Grumman extended key usage", "w": false },
        "1.3.6.1.4.1.16334.509.2.1": { "d": "ngcClass1", "c": "Northrop Grumman policy", "w": false },
        "1.3.6.1.4.1.16334.509.2.2": { "d": "ngcClass2", "c": "Northrop Grumman policy", "w": false },
        "1.3.6.1.4.1.16334.509.2.3": { "d": "ngcClass3", "c": "Northrop Grumman policy", "w": false },
        "1.3.6.1.5.5.7": { "d": "pkix", "c": "", "w": false },
        "1.3.6.1.5.5.7.0.12": { "d": "attributeCert", "c": "PKIX", "w": false },
        "1.3.6.1.5.5.7.1": { "d": "privateExtension", "c": "PKIX", "w": false },
        "1.3.6.1.5.5.7.1.1": { "d": "authorityInfoAccess", "c": "PKIX private extension", "w": false },
        "1.3.6.1.5.5.7.1.2": { "d": "biometricInfo", "c": "PKIX private extension", "w": false },
        "1.3.6.1.5.5.7.1.3": { "d": "qcStatements", "c": "PKIX private extension", "w": false },
        "1.3.6.1.5.5.7.1.4": { "d": "acAuditIdentity", "c": "PKIX private extension", "w": false },
        "1.3.6.1.5.5.7.1.5": { "d": "acTargeting", "c": "PKIX private extension", "w": false },
        "1.3.6.1.5.5.7.1.6": { "d": "acAaControls", "c": "PKIX private extension", "w": false },
        "1.3.6.1.5.5.7.1.7": { "d": "ipAddrBlocks", "c": "PKIX private extension", "w": false },
        "1.3.6.1.5.5.7.1.8": { "d": "autonomousSysIds", "c": "PKIX private extension", "w": false },
        "1.3.6.1.5.5.7.1.9": { "d": "routerIdentifier", "c": "PKIX private extension", "w": false },
        "1.3.6.1.5.5.7.1.10": { "d": "acProxying", "c": "PKIX private extension", "w": false },
        "1.3.6.1.5.5.7.1.11": { "d": "subjectInfoAccess", "c": "PKIX private extension", "w": false },
        "1.3.6.1.5.5.7.1.12": { "d": "logoType", "c": "PKIX private extension", "w": false },
        "1.3.6.1.5.5.7.1.13": { "d": "wlanSSID", "c": "PKIX private extension", "w": false },
        "1.3.6.1.5.5.7.2": { "d": "policyQualifierIds", "c": "PKIX", "w": false },
        "1.3.6.1.5.5.7.2.1": { "d": "cps", "c": "PKIX policy qualifier", "w": false },
        "1.3.6.1.5.5.7.2.2": { "d": "unotice", "c": "PKIX policy qualifier", "w": false },
        "1.3.6.1.5.5.7.2.3": { "d": "textNotice", "c": "PKIX policy qualifier", "w": false },
        "1.3.6.1.5.5.7.3": { "d": "keyPurpose", "c": "PKIX", "w": false },
        "1.3.6.1.5.5.7.3.1": { "d": "serverAuth", "c": "PKIX key purpose", "w": false },
        "1.3.6.1.5.5.7.3.2": { "d": "clientAuth", "c": "PKIX key purpose", "w": false },
        "1.3.6.1.5.5.7.3.3": { "d": "codeSigning", "c": "PKIX key purpose", "w": false },
        "1.3.6.1.5.5.7.3.4": { "d": "emailProtection", "c": "PKIX key purpose", "w": false },
        "1.3.6.1.5.5.7.3.5": { "d": "ipsecEndSystem", "c": "PKIX key purpose", "w": false },
        "1.3.6.1.5.5.7.3.6": { "d": "ipsecTunnel", "c": "PKIX key purpose", "w": false },
        "1.3.6.1.5.5.7.3.7": { "d": "ipsecUser", "c": "PKIX key purpose", "w": false },
        "1.3.6.1.5.5.7.3.8": { "d": "timeStamping", "c": "PKIX key purpose", "w": false },
        "1.3.6.1.5.5.7.3.9": { "d": "ocspSigning", "c": "PKIX key purpose", "w": false },
        "1.3.6.1.5.5.7.3.10": { "d": "dvcs", "c": "PKIX key purpose", "w": false },
        "1.3.6.1.5.5.7.3.11": { "d": "sbgpCertAAServerAuth", "c": "PKIX key purpose", "w": false },
        "1.3.6.1.5.5.7.3.13": { "d": "eapOverPPP", "c": "PKIX key purpose", "w": false },
        "1.3.6.1.5.5.7.3.14": { "d": "eapOverLAN", "c": "PKIX key purpose", "w": false },
        "1.3.6.1.5.5.7.4": { "d": "cmpInformationTypes", "c": "PKIX", "w": false },
        "1.3.6.1.5.5.7.4.1": { "d": "caProtEncCert", "c": "PKIX CMP information", "w": false },
        "1.3.6.1.5.5.7.4.2": { "d": "signKeyPairTypes", "c": "PKIX CMP information", "w": false },
        "1.3.6.1.5.5.7.4.3": { "d": "encKeyPairTypes", "c": "PKIX CMP information", "w": false },
        "1.3.6.1.5.5.7.4.4": { "d": "preferredSymmAlg", "c": "PKIX CMP information", "w": false },
        "1.3.6.1.5.5.7.4.5": { "d": "caKeyUpdateInfo", "c": "PKIX CMP information", "w": false },
        "1.3.6.1.5.5.7.4.6": { "d": "currentCRL", "c": "PKIX CMP information", "w": false },
        "1.3.6.1.5.5.7.4.7": { "d": "unsupportedOIDs", "c": "PKIX CMP information", "w": false },
        "1.3.6.1.5.5.7.4.10": { "d": "keyPairParamReq", "c": "PKIX CMP information", "w": false },
        "1.3.6.1.5.5.7.4.11": { "d": "keyPairParamRep", "c": "PKIX CMP information", "w": false },
        "1.3.6.1.5.5.7.4.12": { "d": "revPassphrase", "c": "PKIX CMP information", "w": false },
        "1.3.6.1.5.5.7.4.13": { "d": "implicitConfirm", "c": "PKIX CMP information", "w": false },
        "1.3.6.1.5.5.7.4.14": { "d": "confirmWaitTime", "c": "PKIX CMP information", "w": false },
        "1.3.6.1.5.5.7.4.15": { "d": "origPKIMessage", "c": "PKIX CMP information", "w": false },
        "1.3.6.1.5.5.7.4.16": { "d": "suppLangTags", "c": "PKIX CMP information", "w": false },
        "1.3.6.1.5.5.7.5": { "d": "crmfRegistration", "c": "PKIX", "w": false },
        "1.3.6.1.5.5.7.5.1": { "d": "regCtrl", "c": "PKIX CRMF registration", "w": false },
        "1.3.6.1.5.5.7.5.1.1": { "d": "regToken", "c": "PKIX CRMF registration control", "w": false },
        "1.3.6.1.5.5.7.5.1.2": { "d": "authenticator", "c": "PKIX CRMF registration control", "w": false },
        "1.3.6.1.5.5.7.5.1.3": { "d": "pkiPublicationInfo", "c": "PKIX CRMF registration control", "w": false },
        "1.3.6.1.5.5.7.5.1.4": { "d": "pkiArchiveOptions", "c": "PKIX CRMF registration control", "w": false },
        "1.3.6.1.5.5.7.5.1.5": { "d": "oldCertID", "c": "PKIX CRMF registration control", "w": false },
        "1.3.6.1.5.5.7.5.1.6": { "d": "protocolEncrKey", "c": "PKIX CRMF registration control", "w": false },
        "1.3.6.1.5.5.7.5.1.7": { "d": "altCertTemplate", "c": "PKIX CRMF registration control", "w": false },
        "1.3.6.1.5.5.7.5.1.8": { "d": "wtlsTemplate", "c": "PKIX CRMF registration control", "w": false },
        "1.3.6.1.5.5.7.5.2": { "d": "utf8Pairs", "c": "PKIX CRMF registration", "w": false },
        "1.3.6.1.5.5.7.5.2.1": { "d": "utf8Pairs", "c": "PKIX CRMF registration control", "w": false },
        "1.3.6.1.5.5.7.5.2.2": { "d": "certReq", "c": "PKIX CRMF registration control", "w": false },
        "1.3.6.1.5.5.7.6": { "d": "algorithms", "c": "PKIX", "w": false },
        "1.3.6.1.5.5.7.6.1": { "d": "des40", "c": "PKIX algorithm", "w": false },
        "1.3.6.1.5.5.7.6.2": { "d": "noSignature", "c": "PKIX algorithm", "w": false },
        "1.3.6.1.5.5.7.6.3": { "d": "dh-sig-hmac-sha1", "c": "PKIX algorithm", "w": false },
        "1.3.6.1.5.5.7.6.4": { "d": "dh-pop", "c": "PKIX algorithm", "w": false },
        "1.3.6.1.5.5.7.7": { "d": "cmcControls", "c": "PKIX", "w": false },
        "1.3.6.1.5.5.7.8": { "d": "otherNames", "c": "PKIX", "w": false },
        "1.3.6.1.5.5.7.8.1": { "d": "personalData", "c": "PKIX other name", "w": false },
        "1.3.6.1.5.5.7.8.2": { "d": "userGroup", "c": "PKIX other name", "w": false },
        "1.3.6.1.5.5.7.8.5": { "d": "xmppAddr", "c": "PKIX other name", "w": false },
        "1.3.6.1.5.5.7.9": { "d": "personalData", "c": "PKIX qualified certificates", "w": false },
        "1.3.6.1.5.5.7.9.1": { "d": "dateOfBirth", "c": "PKIX personal data", "w": false },
        "1.3.6.1.5.5.7.9.2": { "d": "placeOfBirth", "c": "PKIX personal data", "w": false },
        "1.3.6.1.5.5.7.9.3": { "d": "gender", "c": "PKIX personal data", "w": false },
        "1.3.6.1.5.5.7.9.4": { "d": "countryOfCitizenship", "c": "PKIX personal data", "w": false },
        "1.3.6.1.5.5.7.9.5": { "d": "countryOfResidence", "c": "PKIX personal data", "w": false },
        "1.3.6.1.5.5.7.10": { "d": "attributeCertificate", "c": "PKIX", "w": false },
        "1.3.6.1.5.5.7.10.1": { "d": "authenticationInfo", "c": "PKIX attribute certificate extension", "w": false },
        "1.3.6.1.5.5.7.10.2": { "d": "accessIdentity", "c": "PKIX attribute certificate extension", "w": false },
        "1.3.6.1.5.5.7.10.3": { "d": "chargingIdentity", "c": "PKIX attribute certificate extension", "w": false },
        "1.3.6.1.5.5.7.10.4": { "d": "group", "c": "PKIX attribute certificate extension", "w": false },
        "1.3.6.1.5.5.7.10.5": { "d": "role", "c": "PKIX attribute certificate extension", "w": false },
        "1.3.6.1.5.5.7.10.6": { "d": "wlanSSID", "c": "PKIX attribute-certificate extension", "w": false },
        "1.3.6.1.5.5.7.11": { "d": "personalData", "c": "PKIX qualified certificates", "w": false },
        "1.3.6.1.5.5.7.11.1": { "d": "pkixQCSyntax-v1", "c": "PKIX qualified certificates", "w": false },
        "1.3.6.1.5.5.7.14.2": { "d": "resourceCertificatePolicy", "c": "PKIX policies", "w": false },
        "1.3.6.1.5.5.7.20": { "d": "logo", "c": "PKIX qualified certificates", "w": false },
        "1.3.6.1.5.5.7.20.1": { "d": "logoLoyalty", "c": "PKIX", "w": false },
        "1.3.6.1.5.5.7.20.2": { "d": "logoBackground", "c": "PKIX", "w": false },
        "1.3.6.1.5.5.7.48.1": { "d": "ocsp", "c": "PKIX", "w": false },
        "1.3.6.1.5.5.7.48.1.1": { "d": "ocspBasic", "c": "OCSP", "w": false },
        "1.3.6.1.5.5.7.48.1.2": { "d": "ocspNonce", "c": "OCSP", "w": false },
        "1.3.6.1.5.5.7.48.1.3": { "d": "ocspCRL", "c": "OCSP", "w": false },
        "1.3.6.1.5.5.7.48.1.4": { "d": "ocspResponse", "c": "OCSP", "w": false },
        "1.3.6.1.5.5.7.48.1.5": { "d": "ocspNoCheck", "c": "OCSP", "w": false },
        "1.3.6.1.5.5.7.48.1.6": { "d": "ocspArchiveCutoff", "c": "OCSP", "w": false },
        "1.3.6.1.5.5.7.48.1.7": { "d": "ocspServiceLocator", "c": "OCSP", "w": false },
        "1.3.6.1.5.5.7.48.2": { "d": "caIssuers", "c": "PKIX subject/authority info access descriptor", "w": false },
        "1.3.6.1.5.5.7.48.3": { "d": "timeStamping", "c": "PKIX subject/authority info access descriptor", "w": false },
        "1.3.6.1.5.5.7.48.4": { "d": "dvcs", "c": "PKIX subject/authority info access descriptor", "w": false },
        "1.3.6.1.5.5.7.48.5": { "d": "caRepository", "c": "PKIX subject/authority info access descriptor", "w": false },
        "1.3.6.1.5.5.7.48.7": { "d": "signedObjectRepository", "c": "PKIX subject/authority info access descriptor", "w": false },
        "1.3.6.1.5.5.7.48.10": { "d": "rpkiManifest", "c": "PKIX subject/authority info access descriptor", "w": false },
        "1.3.6.1.5.5.7.48.11": { "d": "signedObject", "c": "PKIX subject/authority info access descriptor", "w": false },
        "1.3.6.1.5.5.8.1.1": { "d": "hmacMD5", "c": "ISAKMP HMAC algorithm", "w": false },
        "1.3.6.1.5.5.8.1.2": { "d": "hmacSHA", "c": "ISAKMP HMAC algorithm", "w": false },
        "1.3.6.1.5.5.8.1.3": { "d": "hmacTiger", "c": "ISAKMP HMAC algorithm", "w": false },
        "1.3.6.1.5.5.8.2.2": { "d": "iKEIntermediate", "c": "IKE ???", "w": false },
        "1.3.12.2.1011.7.1": { "d": "decEncryptionAlgorithm", "c": "DASS algorithm", "w": false },
        "1.3.12.2.1011.7.1.2": { "d": "decDEA", "c": "DASS encryption algorithm", "w": false },
        "1.3.12.2.1011.7.2": { "d": "decHashAlgorithm", "c": "DASS algorithm", "w": false },
        "1.3.12.2.1011.7.2.1": { "d": "decMD2", "c": "DASS hash algorithm", "w": false },
        "1.3.12.2.1011.7.2.2": { "d": "decMD4", "c": "DASS hash algorithm", "w": false },
        "1.3.12.2.1011.7.3": { "d": "decSignatureAlgorithm", "c": "DASS algorithm", "w": false },
        "1.3.12.2.1011.7.3.1": { "d": "decMD2withRSA", "c": "DASS signature algorithm", "w": false },
        "1.3.12.2.1011.7.3.2": { "d": "decMD4withRSA", "c": "DASS signature algorithm", "w": false },
        "1.3.12.2.1011.7.3.3": { "d": "decDEAMAC", "c": "DASS signature algorithm", "w": false },
        "1.3.14.2.26.5": { "d": "sha", "c": "Unsure about this OID", "w": false },
        "1.3.14.3.2.1.1": { "d": "rsa", "c": "X.509. Unsure about this OID", "w": false },
        "1.3.14.3.2.2": { "d": "md4WitRSA", "c": "Oddball OIW OID", "w": false },
        "1.3.14.3.2.3": { "d": "md5WithRSA", "c": "Oddball OIW OID", "w": false },
        "1.3.14.3.2.4": { "d": "md4WithRSAEncryption", "c": "Oddball OIW OID", "w": false },
        "1.3.14.3.2.2.1": { "d": "sqmod-N", "c": "X.509. Deprecated", "w": true },
        "1.3.14.3.2.3.1": { "d": "sqmod-NwithRSA", "c": "X.509. Deprecated", "w": true },
        "1.3.14.3.2.6": { "d": "desECB", "c": "", "w": false },
        "1.3.14.3.2.7": { "d": "desCBC", "c": "", "w": false },
        "1.3.14.3.2.8": { "d": "desOFB", "c": "", "w": false },
        "1.3.14.3.2.9": { "d": "desCFB", "c": "", "w": false },
        "1.3.14.3.2.10": { "d": "desMAC", "c": "", "w": false },
        "1.3.14.3.2.11": { "d": "rsaSignature", "c": "ISO 9796-2, also X9.31 Part 1", "w": false },
        "1.3.14.3.2.12": { "d": "dsa", "c": "OIW?, supposedly from an incomplete version of SDN.701 (doesn't match final SDN.701)", "w": true },
        "1.3.14.3.2.13": { "d": "dsaWithSHA", "c": "Oddball OIW OID.  Incorrectly used by JDK 1.1 in place of (1 3 14 3 2 27)", "w": true },
        "1.3.14.3.2.14": { "d": "mdc2WithRSASignature", "c": "Oddball OIW OID using 9796-2 padding rules", "w": false },
        "1.3.14.3.2.15": { "d": "shaWithRSASignature", "c": "Oddball OIW OID using 9796-2 padding rules", "w": false },
        "1.3.14.3.2.16": { "d": "dhWithCommonModulus", "c": "Oddball OIW OID. Deprecated, use a plain DH OID instead", "w": true },
        "1.3.14.3.2.17": { "d": "desEDE", "c": "Oddball OIW OID. Mode is ECB", "w": false },
        "1.3.14.3.2.18": { "d": "sha", "c": "Oddball OIW OID", "w": false },
        "1.3.14.3.2.19": { "d": "mdc-2", "c": "Oddball OIW OID, DES-based hash, planned for X9.31 Part 2", "w": false },
        "1.3.14.3.2.20": { "d": "dsaCommon", "c": "Oddball OIW OID.  Deprecated, use a plain DSA OID instead", "w": true },
        "1.3.14.3.2.21": { "d": "dsaCommonWithSHA", "c": "Oddball OIW OID.  Deprecated, use a plain dsaWithSHA OID instead", "w": true },
        "1.3.14.3.2.22": { "d": "rsaKeyTransport", "c": "Oddball OIW OID", "w": false },
        "1.3.14.3.2.23": { "d": "keyed-hash-seal", "c": "Oddball OIW OID", "w": false },
        "1.3.14.3.2.24": { "d": "md2WithRSASignature", "c": "Oddball OIW OID using 9796-2 padding rules", "w": false },
        "1.3.14.3.2.25": { "d": "md5WithRSASignature", "c": "Oddball OIW OID using 9796-2 padding rules", "w": false },
        "1.3.14.3.2.26": { "d": "sha1", "c": "OIW", "w": false },
        "1.3.14.3.2.27": { "d": "dsaWithSHA1", "c": "OIW. This OID may also be assigned as ripemd-160", "w": false },
        "1.3.14.3.2.28": { "d": "dsaWithCommonSHA1", "c": "OIW", "w": false },
        "1.3.14.3.2.29": { "d": "sha-1WithRSAEncryption", "c": "Oddball OIW OID", "w": false },
        "1.3.14.3.3.1": { "d": "simple-strong-auth-mechanism", "c": "Oddball OIW OID", "w": false },
        "1.3.14.7.2.1.1": { "d": "ElGamal", "c": "Unsure about this OID", "w": false },
        "1.3.14.7.2.3.1": { "d": "md2WithRSA", "c": "Unsure about this OID", "w": false },
        "1.3.14.7.2.3.2": { "d": "md2WithElGamal", "c": "Unsure about this OID", "w": false },
        "1.3.36.1": { "d": "document", "c": "Teletrust document", "w": false },
        "1.3.36.1.1": { "d": "finalVersion", "c": "Teletrust document", "w": false },
        "1.3.36.1.2": { "d": "draft", "c": "Teletrust document", "w": false },
        "1.3.36.2": { "d": "sio", "c": "Teletrust sio", "w": false },
        "1.3.36.2.1": { "d": "sedu", "c": "Teletrust sio", "w": false },
        "1.3.36.3": { "d": "algorithm", "c": "Teletrust algorithm", "w": false },
        "1.3.36.3.1": { "d": "encryptionAlgorithm", "c": "Teletrust algorithm", "w": false },
        "1.3.36.3.1.1": { "d": "des", "c": "Teletrust encryption algorithm", "w": false },
        "1.3.36.3.1.1.1": { "d": "desECB_pad", "c": "Teletrust encryption algorithm", "w": false },
        "1.3.36.3.1.1.1.1": { "d": "desECB_ISOpad", "c": "Teletrust encryption algorithm", "w": false },
        "1.3.36.3.1.1.2.1": { "d": "desCBC_pad", "c": "Teletrust encryption algorithm", "w": false },
        "1.3.36.3.1.1.2.1.1": { "d": "desCBC_ISOpad", "c": "Teletrust encryption algorithm", "w": false },
        "1.3.36.3.1.3": { "d": "des_3", "c": "Teletrust encryption algorithm", "w": false },
        "1.3.36.3.1.3.1.1": { "d": "des_3ECB_pad", "c": "Teletrust encryption algorithm. EDE triple DES", "w": false },
        "1.3.36.3.1.3.1.1.1": { "d": "des_3ECB_ISOpad", "c": "Teletrust encryption algorithm. EDE triple DES", "w": false },
        "1.3.36.3.1.3.2.1": { "d": "des_3CBC_pad", "c": "Teletrust encryption algorithm. EDE triple DES", "w": false },
        "1.3.36.3.1.3.2.1.1": { "d": "des_3CBC_ISOpad", "c": "Teletrust encryption algorithm. EDE triple DES", "w": false },
        "1.3.36.3.1.2": { "d": "idea", "c": "Teletrust encryption algorithm", "w": false },
        "1.3.36.3.1.2.1": { "d": "ideaECB", "c": "Teletrust encryption algorithm", "w": false },
        "1.3.36.3.1.2.1.1": { "d": "ideaECB_pad", "c": "Teletrust encryption algorithm", "w": false },
        "1.3.36.3.1.2.1.1.1": { "d": "ideaECB_ISOpad", "c": "Teletrust encryption algorithm", "w": false },
        "1.3.36.3.1.2.2": { "d": "ideaCBC", "c": "Teletrust encryption algorithm", "w": false },
        "1.3.36.3.1.2.2.1": { "d": "ideaCBC_pad", "c": "Teletrust encryption algorithm", "w": false },
        "1.3.36.3.1.2.2.1.1": { "d": "ideaCBC_ISOpad", "c": "Teletrust encryption algorithm", "w": false },
        "1.3.36.3.1.2.3": { "d": "ideaOFB", "c": "Teletrust encryption algorithm", "w": false },
        "1.3.36.3.1.2.4": { "d": "ideaCFB", "c": "Teletrust encryption algorithm", "w": false },
        "1.3.36.3.1.4": { "d": "rsaEncryption", "c": "Teletrust encryption algorithm", "w": false },
        "1.3.36.3.1.4.512.17": { "d": "rsaEncryptionWithlmod512expe17", "c": "Teletrust encryption algorithm", "w": false },
        "1.3.36.3.1.5": { "d": "bsi-1", "c": "Teletrust encryption algorithm", "w": false },
        "1.3.36.3.1.5.1": { "d": "bsi_1ECB_pad", "c": "Teletrust encryption algorithm", "w": false },
        "1.3.36.3.1.5.2": { "d": "bsi_1CBC_pad", "c": "Teletrust encryption algorithm", "w": false },
        "1.3.36.3.1.5.2.1": { "d": "bsi_1CBC_PEMpad", "c": "Teletrust encryption algorithm", "w": false },
        "1.3.36.3.2": { "d": "hashAlgorithm", "c": "Teletrust algorithm", "w": false },
        "1.3.36.3.2.1": { "d": "ripemd160", "c": "Teletrust hash algorithm", "w": false },
        "1.3.36.3.2.2": { "d": "ripemd128", "c": "Teletrust hash algorithm", "w": false },
        "1.3.36.3.2.3": { "d": "ripemd256", "c": "Teletrust hash algorithm", "w": false },
        "1.3.36.3.2.4": { "d": "mdc2singleLength", "c": "Teletrust hash algorithm", "w": false },
        "1.3.36.3.2.5": { "d": "mdc2doubleLength", "c": "Teletrust hash algorithm", "w": false },
        "1.3.36.3.3": { "d": "signatureAlgorithm", "c": "Teletrust algorithm", "w": false },
        "1.3.36.3.3.1": { "d": "rsaSignature", "c": "Teletrust signature algorithm", "w": false },
        "1.3.36.3.3.1.1": { "d": "rsaSignatureWithsha1", "c": "Teletrust signature algorithm", "w": false },
        "1.3.36.3.3.1.1.1024.11": { "d": "rsaSignatureWithsha1_l1024_l11", "c": "Teletrust signature algorithm", "w": false },
        "1.3.36.3.3.1.2": { "d": "rsaSignatureWithripemd160", "c": "Teletrust signature algorithm", "w": false },
        "1.3.36.3.3.1.2.1024.11": { "d": "rsaSignatureWithripemd160_l1024_l11", "c": "Teletrust signature algorithm", "w": false },
        "1.3.36.3.3.1.3": { "d": "rsaSignatureWithrimpemd128", "c": "Teletrust signature algorithm", "w": false },
        "1.3.36.3.3.1.4": { "d": "rsaSignatureWithrimpemd256", "c": "Teletrust signature algorithm", "w": false },
        "1.3.36.3.3.2": { "d": "ecsieSign", "c": "Teletrust signature algorithm", "w": false },
        "1.3.36.3.3.2.1": { "d": "ecsieSignWithsha1", "c": "Teletrust signature algorithm", "w": false },
        "1.3.36.3.3.2.2": { "d": "ecsieSignWithripemd160", "c": "Teletrust signature algorithm", "w": false },
        "1.3.36.3.3.2.3": { "d": "ecsieSignWithmd2", "c": "Teletrust signature algorithm", "w": false },
        "1.3.36.3.3.2.4": { "d": "ecsieSignWithmd5", "c": "Teletrust signature algorithm", "w": false },
        "1.3.36.3.3.2.8.1.1.1": { "d": "brainpoolP160r1", "c": "ECC Brainpool Standard Curves and Curve Generation", "w": false },
        "1.3.36.3.3.2.8.1.1.2": { "d": "brainpoolP160t1", "c": "ECC Brainpool Standard Curves and Curve Generation", "w": false },
        "1.3.36.3.3.2.8.1.1.3": { "d": "brainpoolP192r1", "c": "ECC Brainpool Standard Curves and Curve Generation", "w": false },
        "1.3.36.3.3.2.8.1.1.4": { "d": "brainpoolP192t1", "c": "ECC Brainpool Standard Curves and Curve Generation", "w": false },
        "1.3.36.3.3.2.8.1.1.5": { "d": "brainpoolP224r1", "c": "ECC Brainpool Standard Curves and Curve Generation", "w": false },
        "1.3.36.3.3.2.8.1.1.6": { "d": "brainpoolP224t1", "c": "ECC Brainpool Standard Curves and Curve Generation", "w": false },
        "1.3.36.3.3.2.8.1.1.7": { "d": "brainpoolP256r1", "c": "ECC Brainpool Standard Curves and Curve Generation", "w": false },
        "1.3.36.3.3.2.8.1.1.8": { "d": "brainpoolP256t1", "c": "ECC Brainpool Standard Curves and Curve Generation", "w": false },
        "1.3.36.3.3.2.8.1.1.9": { "d": "brainpoolP320r1", "c": "ECC Brainpool Standard Curves and Curve Generation", "w": false },
        "1.3.36.3.3.2.8.1.1.10": { "d": "brainpoolP320t1", "c": "ECC Brainpool Standard Curves and Curve Generation", "w": false },
        "1.3.36.3.3.2.8.1.1.11": { "d": "brainpoolP384r1", "c": "ECC Brainpool Standard Curves and Curve Generation", "w": false },
        "1.3.36.3.3.2.8.1.1.12": { "d": "brainpoolP384t1", "c": "ECC Brainpool Standard Curves and Curve Generation", "w": false },
        "1.3.36.3.3.2.8.1.1.13": { "d": "brainpoolP512r1", "c": "ECC Brainpool Standard Curves and Curve Generation", "w": false },
        "1.3.36.3.3.2.8.1.1.14": { "d": "brainpoolP512t1", "c": "ECC Brainpool Standard Curves and Curve Generation", "w": false },
        "1.3.36.3.4": { "d": "signatureScheme", "c": "Teletrust algorithm", "w": false },
        "1.3.36.3.4.1": { "d": "sigS_ISO9796-1", "c": "Teletrust signature scheme", "w": false },
        "1.3.36.3.4.2": { "d": "sigS_ISO9796-2", "c": "Teletrust signature scheme", "w": false },
        "1.3.36.3.4.2.1": { "d": "sigS_ISO9796-2Withred", "c": "Teletrust signature scheme. Unsure what this is supposed to be", "w": false },
        "1.3.36.3.4.2.2": { "d": "sigS_ISO9796-2Withrsa", "c": "Teletrust signature scheme. Unsure what this is supposed to be", "w": false },
        "1.3.36.3.4.2.3": { "d": "sigS_ISO9796-2Withrnd", "c": "Teletrust signature scheme. 9796-2 with random number in padding field", "w": false },
        "1.3.36.4": { "d": "attribute", "c": "Teletrust attribute", "w": false },
        "1.3.36.5": { "d": "policy", "c": "Teletrust policy", "w": false },
        "1.3.36.6": { "d": "api", "c": "Teletrust API", "w": false },
        "1.3.36.6.1": { "d": "manufacturer-specific_api", "c": "Teletrust API", "w": false },
        "1.3.36.6.1.1": { "d": "utimaco-api", "c": "Teletrust API", "w": false },
        "1.3.36.6.2": { "d": "functionality-specific_api", "c": "Teletrust API", "w": false },
        "1.3.36.7": { "d": "keymgmnt", "c": "Teletrust key management", "w": false },
        "1.3.36.7.1": { "d": "keyagree", "c": "Teletrust key management", "w": false },
        "1.3.36.7.1.1": { "d": "bsiPKE", "c": "Teletrust key management", "w": false },
        "1.3.36.7.2": { "d": "keytrans", "c": "Teletrust key management", "w": false },
        "1.3.36.7.2.1": { "d": "encISO9796-2Withrsa", "c": "Teletrust key management. 9796-2 with key stored in hash field", "w": false },
        "1.3.36.8.1.1": { "d": "Teletrust SigGConform policyIdentifier", "c": "Teletrust policy", "w": false },
        "1.3.36.8.2.1": { "d": "directoryService", "c": "Teletrust extended key usage", "w": false },
        "1.3.36.8.3.1": { "d": "dateOfCertGen", "c": "Teletrust attribute", "w": false },
        "1.3.36.8.3.2": { "d": "procuration", "c": "Teletrust attribute", "w": false },
        "1.3.36.8.3.3": { "d": "admission", "c": "Teletrust attribute", "w": false },
        "1.3.36.8.3.4": { "d": "monetaryLimit", "c": "Teletrust attribute", "w": false },
        "1.3.36.8.3.5": { "d": "declarationOfMajority", "c": "Teletrust attribute", "w": false },
        "1.3.36.8.3.6": { "d": "integratedCircuitCardSerialNumber", "c": "Teletrust attribute", "w": false },
        "1.3.36.8.3.7": { "d": "pKReference", "c": "Teletrust attribute", "w": false },
        "1.3.36.8.3.8": { "d": "restriction", "c": "Teletrust attribute", "w": false },
        "1.3.36.8.3.9": { "d": "retrieveIfAllowed", "c": "Teletrust attribute", "w": false },
        "1.3.36.8.3.10": { "d": "requestedCertificate", "c": "Teletrust attribute", "w": false },
        "1.3.36.8.3.11": { "d": "namingAuthorities", "c": "Teletrust attribute", "w": false },
        "1.3.36.8.3.11.1": { "d": "rechtWirtschaftSteuern", "c": "Teletrust naming authorities", "w": false },
        "1.3.36.8.3.11.1.1": { "d": "rechtsanwaeltin", "c": "Teletrust ProfessionInfo", "w": false },
        "1.3.36.8.3.11.1.2": { "d": "rechtsanwalt", "c": "Teletrust ProfessionInfo", "w": false },
        "1.3.36.8.3.11.1.3": { "d": "rechtsBeistand", "c": "Teletrust ProfessionInfo", "w": false },
        "1.3.36.8.3.11.1.4": { "d": "steuerBeraterin", "c": "Teletrust ProfessionInfo", "w": false },
        "1.3.36.8.3.11.1.5": { "d": "steuerBerater", "c": "Teletrust ProfessionInfo", "w": false },
        "1.3.36.8.3.11.1.6": { "d": "steuerBevollmaechtigte", "c": "Teletrust ProfessionInfo", "w": false },
        "1.3.36.8.3.11.1.7": { "d": "steuerBevollmaechtigter", "c": "Teletrust ProfessionInfo", "w": false },
        "1.3.36.8.3.11.1.8": { "d": "notarin", "c": "Teletrust ProfessionInfo", "w": false },
        "1.3.36.8.3.11.1.9": { "d": "notar", "c": "Teletrust ProfessionInfo", "w": false },
        "1.3.36.8.3.11.1.10": { "d": "notarVertreterin", "c": "Teletrust ProfessionInfo", "w": false },
        "1.3.36.8.3.11.1.11": { "d": "notarVertreter", "c": "Teletrust ProfessionInfo", "w": false },
        "1.3.36.8.3.11.1.12": { "d": "notariatsVerwalterin", "c": "Teletrust ProfessionInfo", "w": false },
        "1.3.36.8.3.11.1.13": { "d": "notariatsVerwalter", "c": "Teletrust ProfessionInfo", "w": false },
        "1.3.36.8.3.11.1.14": { "d": "wirtschaftsPrueferin", "c": "Teletrust ProfessionInfo", "w": false },
        "1.3.36.8.3.11.1.15": { "d": "wirtschaftsPruefer", "c": "Teletrust ProfessionInfo", "w": false },
        "1.3.36.8.3.11.1.16": { "d": "vereidigteBuchprueferin", "c": "Teletrust ProfessionInfo", "w": false },
        "1.3.36.8.3.11.1.17": { "d": "vereidigterBuchpruefer", "c": "Teletrust ProfessionInfo", "w": false },
        "1.3.36.8.3.11.1.18": { "d": "patentAnwaeltin", "c": "Teletrust ProfessionInfo", "w": false },
        "1.3.36.8.3.11.1.19": { "d": "patentAnwalt", "c": "Teletrust ProfessionInfo", "w": false },
        "1.3.36.8.3.12": { "d": "certInDirSince", "c": "Teletrust OCSP attribute (obsolete)", "w": true },
        "1.3.36.8.3.13": { "d": "certHash", "c": "Teletrust OCSP attribute", "w": false },
        "1.3.36.8.3.14": { "d": "nameAtBirth", "c": "Teletrust attribute", "w": false },
        "1.3.36.8.3.15": { "d": "additionalInformation", "c": "Teletrust attribute", "w": false },
        "1.3.36.8.4.1": { "d": "personalData", "c": "Teletrust OtherName attribute", "w": false },
        "1.3.36.8.4.8": { "d": "restriction", "c": "Teletrust attribute certificate attribute", "w": false },
        "1.3.36.8.5.1.1.1": { "d": "rsaIndicateSHA1", "c": "Teletrust signature algorithm", "w": false },
        "1.3.36.8.5.1.1.2": { "d": "rsaIndicateRIPEMD160", "c": "Teletrust signature algorithm", "w": false },
        "1.3.36.8.5.1.1.3": { "d": "rsaWithSHA1", "c": "Teletrust signature algorithm", "w": false },
        "1.3.36.8.5.1.1.4": { "d": "rsaWithRIPEMD160", "c": "Teletrust signature algorithm", "w": false },
        "1.3.36.8.5.1.2.1": { "d": "dsaExtended", "c": "Teletrust signature algorithm", "w": false },
        "1.3.36.8.5.1.2.2": { "d": "dsaWithRIPEMD160", "c": "Teletrust signature algorithm", "w": false },
        "1.3.36.8.6.1": { "d": "cert", "c": "Teletrust signature attributes", "w": false },
        "1.3.36.8.6.2": { "d": "certRef", "c": "Teletrust signature attributes", "w": false },
        "1.3.36.8.6.3": { "d": "attrCert", "c": "Teletrust signature attributes", "w": false },
        "1.3.36.8.6.4": { "d": "attrRef", "c": "Teletrust signature attributes", "w": false },
        "1.3.36.8.6.5": { "d": "fileName", "c": "Teletrust signature attributes", "w": false },
        "1.3.36.8.6.6": { "d": "storageTime", "c": "Teletrust signature attributes", "w": false },
        "1.3.36.8.6.7": { "d": "fileSize", "c": "Teletrust signature attributes", "w": false },
        "1.3.36.8.6.8": { "d": "location", "c": "Teletrust signature attributes", "w": false },
        "1.3.36.8.6.9": { "d": "sigNumber", "c": "Teletrust signature attributes", "w": false },
        "1.3.36.8.6.10": { "d": "autoGen", "c": "Teletrust signature attributes", "w": false },
        "1.3.36.8.7.1.1": { "d": "ptAdobeILL", "c": "Teletrust presentation types", "w": false },
        "1.3.36.8.7.1.2": { "d": "ptAmiPro", "c": "Teletrust presentation types", "w": false },
        "1.3.36.8.7.1.3": { "d": "ptAutoCAD", "c": "Teletrust presentation types", "w": false },
        "1.3.36.8.7.1.4": { "d": "ptBinary", "c": "Teletrust presentation types", "w": false },
        "1.3.36.8.7.1.5": { "d": "ptBMP", "c": "Teletrust presentation types", "w": false },
        "1.3.36.8.7.1.6": { "d": "ptCGM", "c": "Teletrust presentation types", "w": false },
        "1.3.36.8.7.1.7": { "d": "ptCorelCRT", "c": "Teletrust presentation types", "w": false },
        "1.3.36.8.7.1.8": { "d": "ptCorelDRW", "c": "Teletrust presentation types", "w": false },
        "1.3.36.8.7.1.9": { "d": "ptCorelEXC", "c": "Teletrust presentation types", "w": false },
        "1.3.36.8.7.1.10": { "d": "ptCorelPHT", "c": "Teletrust presentation types", "w": false },
        "1.3.36.8.7.1.11": { "d": "ptDraw", "c": "Teletrust presentation types", "w": false },
        "1.3.36.8.7.1.12": { "d": "ptDVI", "c": "Teletrust presentation types", "w": false },
        "1.3.36.8.7.1.13": { "d": "ptEPS", "c": "Teletrust presentation types", "w": false },
        "1.3.36.8.7.1.14": { "d": "ptExcel", "c": "Teletrust presentation types", "w": false },
        "1.3.36.8.7.1.15": { "d": "ptGEM", "c": "Teletrust presentation types", "w": false },
        "1.3.36.8.7.1.16": { "d": "ptGIF", "c": "Teletrust presentation types", "w": false },
        "1.3.36.8.7.1.17": { "d": "ptHPGL", "c": "Teletrust presentation types", "w": false },
        "1.3.36.8.7.1.18": { "d": "ptJPEG", "c": "Teletrust presentation types", "w": false },
        "1.3.36.8.7.1.19": { "d": "ptKodak", "c": "Teletrust presentation types", "w": false },
        "1.3.36.8.7.1.20": { "d": "ptLaTeX", "c": "Teletrust presentation types", "w": false },
        "1.3.36.8.7.1.21": { "d": "ptLotus", "c": "Teletrust presentation types", "w": false },
        "1.3.36.8.7.1.22": { "d": "ptLotusPIC", "c": "Teletrust presentation types", "w": false },
        "1.3.36.8.7.1.23": { "d": "ptMacPICT", "c": "Teletrust presentation types", "w": false },
        "1.3.36.8.7.1.24": { "d": "ptMacWord", "c": "Teletrust presentation types", "w": false },
        "1.3.36.8.7.1.25": { "d": "ptMSWfD", "c": "Teletrust presentation types", "w": false },
        "1.3.36.8.7.1.26": { "d": "ptMSWord", "c": "Teletrust presentation types", "w": false },
        "1.3.36.8.7.1.27": { "d": "ptMSWord2", "c": "Teletrust presentation types", "w": false },
        "1.3.36.8.7.1.28": { "d": "ptMSWord6", "c": "Teletrust presentation types", "w": false },
        "1.3.36.8.7.1.29": { "d": "ptMSWord8", "c": "Teletrust presentation types", "w": false },
        "1.3.36.8.7.1.30": { "d": "ptPDF", "c": "Teletrust presentation types", "w": false },
        "1.3.36.8.7.1.31": { "d": "ptPIF", "c": "Teletrust presentation types", "w": false },
        "1.3.36.8.7.1.32": { "d": "ptPostscript", "c": "Teletrust presentation types", "w": false },
        "1.3.36.8.7.1.33": { "d": "ptRTF", "c": "Teletrust presentation types", "w": false },
        "1.3.36.8.7.1.34": { "d": "ptSCITEX", "c": "Teletrust presentation types", "w": false },
        "1.3.36.8.7.1.35": { "d": "ptTAR", "c": "Teletrust presentation types", "w": false },
        "1.3.36.8.7.1.36": { "d": "ptTarga", "c": "Teletrust presentation types", "w": false },
        "1.3.36.8.7.1.37": { "d": "ptTeX", "c": "Teletrust presentation types", "w": false },
        "1.3.36.8.7.1.38": { "d": "ptText", "c": "Teletrust presentation types", "w": false },
        "1.3.36.8.7.1.39": { "d": "ptTIFF", "c": "Teletrust presentation types", "w": false },
        "1.3.36.8.7.1.40": { "d": "ptTIFF-FC", "c": "Teletrust presentation types", "w": false },
        "1.3.36.8.7.1.41": { "d": "ptUID", "c": "Teletrust presentation types", "w": false },
        "1.3.36.8.7.1.42": { "d": "ptUUEncode", "c": "Teletrust presentation types", "w": false },
        "1.3.36.8.7.1.43": { "d": "ptWMF", "c": "Teletrust presentation types", "w": false },
        "1.3.36.8.7.1.45": { "d": "ptWPGrph", "c": "Teletrust presentation types", "w": false },
        "1.3.101.1.4": { "d": "thawte-ce", "c": "Thawte", "w": false },
        "1.3.101.1.4.1": { "d": "strongExtranet", "c": "Thawte certificate extension", "w": false },
        "1.3.132.0.1": { "d": "sect163k1", "c": "SECG (Certicom) named elliptic curve", "w": false },
        "1.3.132.0.2": { "d": "sect163r1", "c": "SECG (Certicom) named elliptic curve", "w": false },
        "1.3.132.0.3": { "d": "sect239k1", "c": "SECG (Certicom) named elliptic curve", "w": false },
        "1.3.132.0.4": { "d": "sect113r1", "c": "SECG (Certicom) named elliptic curve", "w": false },
        "1.3.132.0.5": { "d": "sect113r2", "c": "SECG (Certicom) named elliptic curve", "w": false },
        "1.3.132.0.6": { "d": "secp112r1", "c": "SECG (Certicom) named elliptic curve", "w": false },
        "1.3.132.0.7": { "d": "secp112r2", "c": "SECG (Certicom) named elliptic curve", "w": false },
        "1.3.132.0.8": { "d": "secp160r1", "c": "SECG (Certicom) named elliptic curve", "w": false },
        "1.3.132.0.9": { "d": "secp160k1", "c": "SECG (Certicom) named elliptic curve", "w": false },
        "1.3.132.0.10": { "d": "secp256k1", "c": "SECG (Certicom) named elliptic curve", "w": false },
        "1.3.132.0.15": { "d": "sect163r2", "c": "SECG (Certicom) named elliptic curve", "w": false },
        "1.3.132.0.16": { "d": "sect283k1", "c": "SECG (Certicom) named elliptic curve", "w": false },
        "1.3.132.0.17": { "d": "sect283r1", "c": "SECG (Certicom) named elliptic curve", "w": false },
        "1.3.132.0.22": { "d": "sect131r1", "c": "SECG (Certicom) named elliptic curve", "w": false },
        "1.3.132.0.23": { "d": "sect131r2", "c": "SECG (Certicom) named elliptic curve", "w": false },
        "1.3.132.0.24": { "d": "sect193r1", "c": "SECG (Certicom) named elliptic curve", "w": false },
        "1.3.132.0.25": { "d": "sect193r2", "c": "SECG (Certicom) named elliptic curve", "w": false },
        "1.3.132.0.26": { "d": "sect233k1", "c": "SECG (Certicom) named elliptic curve", "w": false },
        "1.3.132.0.27": { "d": "sect233r1", "c": "SECG (Certicom) named elliptic curve", "w": false },
        "1.3.132.0.28": { "d": "secp128r1", "c": "SECG (Certicom) named elliptic curve", "w": false },
        "1.3.132.0.29": { "d": "secp128r2", "c": "SECG (Certicom) named elliptic curve", "w": false },
        "1.3.132.0.30": { "d": "secp160r2", "c": "SECG (Certicom) named elliptic curve", "w": false },
        "1.3.132.0.31": { "d": "secp192k1", "c": "SECG (Certicom) named elliptic curve", "w": false },
        "1.3.132.0.32": { "d": "secp224k1", "c": "SECG (Certicom) named elliptic curve", "w": false },
        "1.3.132.0.33": { "d": "secp224r1", "c": "SECG (Certicom) named elliptic curve", "w": false },
        "1.3.132.0.34": { "d": "secp384r1", "c": "SECG (Certicom) named elliptic curve", "w": false },
        "1.3.132.0.35": { "d": "secp521r1", "c": "SECG (Certicom) named elliptic curve", "w": false },
        "1.3.132.0.36": { "d": "sect409k1", "c": "SECG (Certicom) named elliptic curve", "w": false },
        "1.3.132.0.37": { "d": "sect409r1", "c": "SECG (Certicom) named elliptic curve", "w": false },
        "1.3.132.0.38": { "d": "sect571k1", "c": "SECG (Certicom) named elliptic curve", "w": false },
        "1.3.132.0.39": { "d": "sect571r1", "c": "SECG (Certicom) named elliptic curve", "w": false },
        "2.5.4.0": { "d": "objectClass", "c": "X.520 DN component", "w": false },
        "2.5.4.1": { "d": "aliasedEntryName", "c": "X.520 DN component", "w": false },
        "2.5.4.2": { "d": "knowledgeInformation", "c": "X.520 DN component", "w": false },
        "2.5.4.3": { "d": "commonName", "c": "X.520 DN component", "w": false },
        "2.5.4.4": { "d": "surname", "c": "X.520 DN component", "w": false },
        "2.5.4.5": { "d": "serialNumber", "c": "X.520 DN component", "w": false },
        "2.5.4.6": { "d": "countryName", "c": "X.520 DN component", "w": false },
        "2.5.4.7": { "d": "localityName", "c": "X.520 DN component", "w": false },
        "2.5.4.7.1": { "d": "collectiveLocalityName", "c": "X.520 DN component", "w": false },
        "2.5.4.8": { "d": "stateOrProvinceName", "c": "X.520 DN component", "w": false },
        "2.5.4.8.1": { "d": "collectiveStateOrProvinceName", "c": "X.520 DN component", "w": false },
        "2.5.4.9": { "d": "streetAddress", "c": "X.520 DN component", "w": false },
        "2.5.4.9.1": { "d": "collectiveStreetAddress", "c": "X.520 DN component", "w": false },
        "2.5.4.10": { "d": "organizationName", "c": "X.520 DN component", "w": false },
        "2.5.4.10.1": { "d": "collectiveOrganizationName", "c": "X.520 DN component", "w": false },
        "2.5.4.11": { "d": "organizationalUnitName", "c": "X.520 DN component", "w": false },
        "2.5.4.11.1": { "d": "collectiveOrganizationalUnitName", "c": "X.520 DN component", "w": false },
        "2.5.4.12": { "d": "title", "c": "X.520 DN component", "w": false },
        "2.5.4.13": { "d": "description", "c": "X.520 DN component", "w": false },
        "2.5.4.14": { "d": "searchGuide", "c": "X.520 DN component", "w": false },
        "2.5.4.15": { "d": "businessCategory", "c": "X.520 DN component", "w": false },
        "2.5.4.16": { "d": "postalAddress", "c": "X.520 DN component", "w": false },
        "2.5.4.16.1": { "d": "collectivePostalAddress", "c": "X.520 DN component", "w": false },
        "2.5.4.17": { "d": "postalCode", "c": "X.520 DN component", "w": false },
        "2.5.4.17.1": { "d": "collectivePostalCode", "c": "X.520 DN component", "w": false },
        "2.5.4.18": { "d": "postOfficeBox", "c": "X.520 DN component", "w": false },
        "2.5.4.18.1": { "d": "collectivePostOfficeBox", "c": "X.520 DN component", "w": false },
        "2.5.4.19": { "d": "physicalDeliveryOfficeName", "c": "X.520 DN component", "w": false },
        "2.5.4.19.1": { "d": "collectivePhysicalDeliveryOfficeName", "c": "X.520 DN component", "w": false },
        "2.5.4.20": { "d": "telephoneNumber", "c": "X.520 DN component", "w": false },
        "2.5.4.20.1": { "d": "collectiveTelephoneNumber", "c": "X.520 DN component", "w": false },
        "2.5.4.21": { "d": "telexNumber", "c": "X.520 DN component", "w": false },
        "2.5.4.21.1": { "d": "collectiveTelexNumber", "c": "X.520 DN component", "w": false },
        "2.5.4.22": { "d": "teletexTerminalIdentifier", "c": "X.520 DN component", "w": false },
        "2.5.4.22.1": { "d": "collectiveTeletexTerminalIdentifier", "c": "X.520 DN component", "w": false },
        "2.5.4.23": { "d": "facsimileTelephoneNumber", "c": "X.520 DN component", "w": false },
        "2.5.4.23.1": { "d": "collectiveFacsimileTelephoneNumber", "c": "X.520 DN component", "w": false },
        "2.5.4.24": { "d": "x121Address", "c": "X.520 DN component", "w": false },
        "2.5.4.25": { "d": "internationalISDNNumber", "c": "X.520 DN component", "w": false },
        "2.5.4.25.1": { "d": "collectiveInternationalISDNNumber", "c": "X.520 DN component", "w": false },
        "2.5.4.26": { "d": "registeredAddress", "c": "X.520 DN component", "w": false },
        "2.5.4.27": { "d": "destinationIndicator", "c": "X.520 DN component", "w": false },
        "2.5.4.28": { "d": "preferredDeliveryMehtod", "c": "X.520 DN component", "w": false },
        "2.5.4.29": { "d": "presentationAddress", "c": "X.520 DN component", "w": false },
        "2.5.4.30": { "d": "supportedApplicationContext", "c": "X.520 DN component", "w": false },
        "2.5.4.31": { "d": "member", "c": "X.520 DN component", "w": false },
        "2.5.4.32": { "d": "owner", "c": "X.520 DN component", "w": false },
        "2.5.4.33": { "d": "roleOccupant", "c": "X.520 DN component", "w": false },
        "2.5.4.34": { "d": "seeAlso", "c": "X.520 DN component", "w": false },
        "2.5.4.35": { "d": "userPassword", "c": "X.520 DN component", "w": false },
        "2.5.4.36": { "d": "userCertificate", "c": "X.520 DN component", "w": false },
        "2.5.4.37": { "d": "caCertificate", "c": "X.520 DN component", "w": false },
        "2.5.4.38": { "d": "authorityRevocationList", "c": "X.520 DN component", "w": false },
        "2.5.4.39": { "d": "certificateRevocationList", "c": "X.520 DN component", "w": false },
        "2.5.4.40": { "d": "crossCertificatePair", "c": "X.520 DN component", "w": false },
        "2.5.4.41": { "d": "name", "c": "X.520 DN component", "w": false },
        "2.5.4.42": { "d": "givenName", "c": "X.520 DN component", "w": false },
        "2.5.4.43": { "d": "initials", "c": "X.520 DN component", "w": false },
        "2.5.4.44": { "d": "generationQualifier", "c": "X.520 DN component", "w": false },
        "2.5.4.45": { "d": "uniqueIdentifier", "c": "X.520 DN component", "w": false },
        "2.5.4.46": { "d": "dnQualifier", "c": "X.520 DN component", "w": false },
        "2.5.4.47": { "d": "enhancedSearchGuide", "c": "X.520 DN component", "w": false },
        "2.5.4.48": { "d": "protocolInformation", "c": "X.520 DN component", "w": false },
        "2.5.4.49": { "d": "distinguishedName", "c": "X.520 DN component", "w": false },
        "2.5.4.50": { "d": "uniqueMember", "c": "X.520 DN component", "w": false },
        "2.5.4.51": { "d": "houseIdentifier", "c": "X.520 DN component", "w": false },
        "2.5.4.52": { "d": "supportedAlgorithms", "c": "X.520 DN component", "w": false },
        "2.5.4.53": { "d": "deltaRevocationList", "c": "X.520 DN component", "w": false },
        "2.5.4.54": { "d": "dmdName", "c": "X.520 DN component", "w": false },
        "2.5.4.55": { "d": "clearance", "c": "X.520 DN component", "w": false },
        "2.5.4.56": { "d": "defaultDirQop", "c": "X.520 DN component", "w": false },
        "2.5.4.57": { "d": "attributeIntegrityInfo", "c": "X.520 DN component", "w": false },
        "2.5.4.58": { "d": "attributeCertificate", "c": "X.520 DN component", "w": false },
        "2.5.4.59": { "d": "attributeCertificateRevocationList", "c": "X.520 DN component", "w": false },
        "2.5.4.60": { "d": "confKeyInfo", "c": "X.520 DN component", "w": false },
        "2.5.4.61": { "d": "aACertificate", "c": "X.520 DN component", "w": false },
        "2.5.4.62": { "d": "attributeDescriptorCertificate", "c": "X.520 DN component", "w": false },
        "2.5.4.63": { "d": "attributeAuthorityRevocationList", "c": "X.520 DN component", "w": false },
        "2.5.4.64": { "d": "familyInformation", "c": "X.520 DN component", "w": false },
        "2.5.4.65": { "d": "pseudonym", "c": "X.520 DN component", "w": false },
        "2.5.4.66": { "d": "communicationsService", "c": "X.520 DN component", "w": false },
        "2.5.4.67": { "d": "communicationsNetwork", "c": "X.520 DN component", "w": false },
        "2.5.4.68": { "d": "certificationPracticeStmt", "c": "X.520 DN component", "w": false },
        "2.5.4.69": { "d": "certificatePolicy", "c": "X.520 DN component", "w": false },
        "2.5.4.70": { "d": "pkiPath", "c": "X.520 DN component", "w": false },
        "2.5.4.71": { "d": "privPolicy", "c": "X.520 DN component", "w": false },
        "2.5.4.72": { "d": "role", "c": "X.520 DN component", "w": false },
        "2.5.4.73": { "d": "delegationPath", "c": "X.520 DN component", "w": false },
        "2.5.4.74": { "d": "protPrivPolicy", "c": "X.520 DN component", "w": false },
        "2.5.4.75": { "d": "xMLPrivilegeInfo", "c": "X.520 DN component", "w": false },
        "2.5.4.76": { "d": "xmlPrivPolicy", "c": "X.520 DN component", "w": false },
        "2.5.4.82": { "d": "permission", "c": "X.520 DN component", "w": false },
        "2.5.6.0": { "d": "top", "c": "X.520 objectClass", "w": false },
        "2.5.6.1": { "d": "alias", "c": "X.520 objectClass", "w": false },
        "2.5.6.2": { "d": "country", "c": "X.520 objectClass", "w": false },
        "2.5.6.3": { "d": "locality", "c": "X.520 objectClass", "w": false },
        "2.5.6.4": { "d": "organization", "c": "X.520 objectClass", "w": false },
        "2.5.6.5": { "d": "organizationalUnit", "c": "X.520 objectClass", "w": false },
        "2.5.6.6": { "d": "person", "c": "X.520 objectClass", "w": false },
        "2.5.6.7": { "d": "organizationalPerson", "c": "X.520 objectClass", "w": false },
        "2.5.6.8": { "d": "organizationalRole", "c": "X.520 objectClass", "w": false },
        "2.5.6.9": { "d": "groupOfNames", "c": "X.520 objectClass", "w": false },
        "2.5.6.10": { "d": "residentialPerson", "c": "X.520 objectClass", "w": false },
        "2.5.6.11": { "d": "applicationProcess", "c": "X.520 objectClass", "w": false },
        "2.5.6.12": { "d": "applicationEntity", "c": "X.520 objectClass", "w": false },
        "2.5.6.13": { "d": "dSA", "c": "X.520 objectClass", "w": false },
        "2.5.6.14": { "d": "device", "c": "X.520 objectClass", "w": false },
        "2.5.6.15": { "d": "strongAuthenticationUser", "c": "X.520 objectClass", "w": false },
        "2.5.6.16": { "d": "certificateAuthority", "c": "X.520 objectClass", "w": false },
        "2.5.6.17": { "d": "groupOfUniqueNames", "c": "X.520 objectClass", "w": false },
        "2.5.6.21": { "d": "pkiUser", "c": "X.520 objectClass", "w": false },
        "2.5.6.22": { "d": "pkiCA", "c": "X.520 objectClass", "w": false },
        "2.5.8.1.1": { "d": "rsa", "c": "X.500 algorithms.  Ambiguous, since no padding rules specified", "w": true },
        "2.5.29.1": { "d": "authorityKeyIdentifier", "c": "X.509 extension.  Deprecated, use 2 5 29 35 instead", "w": true },
        "2.5.29.2": { "d": "keyAttributes", "c": "X.509 extension.  Obsolete, use keyUsage/extKeyUsage instead", "w": true },
        "2.5.29.3": { "d": "certificatePolicies", "c": "X.509 extension.  Deprecated, use 2 5 29 32 instead", "w": true },
        "2.5.29.4": { "d": "keyUsageRestriction", "c": "X.509 extension.  Obsolete, use keyUsage/extKeyUsage instead", "w": true },
        "2.5.29.5": { "d": "policyMapping", "c": "X.509 extension.  Deprecated, use 2 5 29 33 instead", "w": true },
        "2.5.29.6": { "d": "subtreesConstraint", "c": "X.509 extension.  Obsolete, use nameConstraints instead", "w": true },
        "2.5.29.7": { "d": "subjectAltName", "c": "X.509 extension.  Deprecated, use 2 5 29 17 instead", "w": true },
        "2.5.29.8": { "d": "issuerAltName", "c": "X.509 extension.  Deprecated, use 2 5 29 18 instead", "w": true },
        "2.5.29.9": { "d": "subjectDirectoryAttributes", "c": "X.509 extension", "w": false },
        "2.5.29.10": { "d": "basicConstraints", "c": "X.509 extension.  Deprecated, use 2 5 29 19 instead", "w": true },
        "2.5.29.11": { "d": "nameConstraints", "c": "X.509 extension.  Deprecated, use 2 5 29 30 instead", "w": true },
        "2.5.29.12": { "d": "policyConstraints", "c": "X.509 extension.  Deprecated, use 2 5 29 36 instead", "w": true },
        "2.5.29.13": { "d": "basicConstraints", "c": "X.509 extension.  Deprecated, use 2 5 29 19 instead", "w": true },
        "2.5.29.14": { "d": "subjectKeyIdentifier", "c": "X.509 extension", "w": false },
        "2.5.29.15": { "d": "keyUsage", "c": "X.509 extension", "w": false },
        "2.5.29.16": { "d": "privateKeyUsagePeriod", "c": "X.509 extension", "w": false },
        "2.5.29.17": { "d": "subjectAltName", "c": "X.509 extension", "w": false },
        "2.5.29.18": { "d": "issuerAltName", "c": "X.509 extension", "w": false },
        "2.5.29.19": { "d": "basicConstraints", "c": "X.509 extension", "w": false },
        "2.5.29.20": { "d": "cRLNumber", "c": "X.509 extension", "w": false },
        "2.5.29.21": { "d": "cRLReason", "c": "X.509 extension", "w": false },
        "2.5.29.22": { "d": "expirationDate", "c": "X.509 extension.  Deprecated, alternative OID uncertain", "w": true },
        "2.5.29.23": { "d": "instructionCode", "c": "X.509 extension", "w": false },
        "2.5.29.24": { "d": "invalidityDate", "c": "X.509 extension", "w": false },
        "2.5.29.25": { "d": "cRLDistributionPoints", "c": "X.509 extension.  Deprecated, use 2 5 29 31 instead", "w": true },
        "2.5.29.26": { "d": "issuingDistributionPoint", "c": "X.509 extension.  Deprecated, use 2 5 29 28 instead", "w": true },
        "2.5.29.27": { "d": "deltaCRLIndicator", "c": "X.509 extension", "w": false },
        "2.5.29.28": { "d": "issuingDistributionPoint", "c": "X.509 extension", "w": false },
        "2.5.29.29": { "d": "certificateIssuer", "c": "X.509 extension", "w": false },
        "2.5.29.30": { "d": "nameConstraints", "c": "X.509 extension", "w": false },
        "2.5.29.31": { "d": "cRLDistributionPoints", "c": "X.509 extension", "w": false },
        "2.5.29.32": { "d": "certificatePolicies", "c": "X.509 extension", "w": false },
        "2.5.29.32.0": { "d": "anyPolicy", "c": "X.509 certificate policy", "w": false },
        "2.5.29.33": { "d": "policyMappings", "c": "X.509 extension", "w": false },
        "2.5.29.34": { "d": "policyConstraints", "c": "X.509 extension.  Deprecated, use 2 5 29 36 instead", "w": true },
        "2.5.29.35": { "d": "authorityKeyIdentifier", "c": "X.509 extension", "w": false },
        "2.5.29.36": { "d": "policyConstraints", "c": "X.509 extension", "w": false },
        "2.5.29.37": { "d": "extKeyUsage", "c": "X.509 extension", "w": false },
        "2.5.29.37.0": { "d": "anyExtendedKeyUsage", "c": "X.509 extended key usage", "w": false },
        "2.5.29.38": { "d": "authorityAttributeIdentifier", "c": "X.509 extension", "w": false },
        "2.5.29.39": { "d": "roleSpecCertIdentifier", "c": "X.509 extension", "w": false },
        "2.5.29.40": { "d": "cRLStreamIdentifier", "c": "X.509 extension", "w": false },
        "2.5.29.41": { "d": "basicAttConstraints", "c": "X.509 extension", "w": false },
        "2.5.29.42": { "d": "delegatedNameConstraints", "c": "X.509 extension", "w": false },
        "2.5.29.43": { "d": "timeSpecification", "c": "X.509 extension", "w": false },
        "2.5.29.44": { "d": "cRLScope", "c": "X.509 extension", "w": false },
        "2.5.29.45": { "d": "statusReferrals", "c": "X.509 extension", "w": false },
        "2.5.29.46": { "d": "freshestCRL", "c": "X.509 extension", "w": false },
        "2.5.29.47": { "d": "orderedList", "c": "X.509 extension", "w": false },
        "2.5.29.48": { "d": "attributeDescriptor", "c": "X.509 extension", "w": false },
        "2.5.29.49": { "d": "userNotice", "c": "X.509 extension", "w": false },
        "2.5.29.50": { "d": "sOAIdentifier", "c": "X.509 extension", "w": false },
        "2.5.29.51": { "d": "baseUpdateTime", "c": "X.509 extension", "w": false },
        "2.5.29.52": { "d": "acceptableCertPolicies", "c": "X.509 extension", "w": false },
        "2.5.29.53": { "d": "deltaInfo", "c": "X.509 extension", "w": false },
        "2.5.29.54": { "d": "inhibitAnyPolicy", "c": "X.509 extension", "w": false },
        "2.5.29.55": { "d": "targetInformation", "c": "X.509 extension", "w": false },
        "2.5.29.56": { "d": "noRevAvail", "c": "X.509 extension", "w": false },
        "2.5.29.57": { "d": "acceptablePrivilegePolicies", "c": "X.509 extension", "w": false },
        "2.5.29.58": { "d": "toBeRevoked", "c": "X.509 extension", "w": false },
        "2.5.29.59": { "d": "revokedGroups", "c": "X.509 extension", "w": false },
        "2.5.29.60": { "d": "expiredCertsOnCRL", "c": "X.509 extension", "w": false },
        "2.5.29.61": { "d": "indirectIssuer", "c": "X.509 extension", "w": false },
        "2.5.29.62": { "d": "noAssertion", "c": "X.509 extension", "w": false },
        "2.5.29.63": { "d": "aAissuingDistributionPoint", "c": "X.509 extension", "w": false },
        "2.5.29.64": { "d": "issuedOnBehalfOf", "c": "X.509 extension", "w": false },
        "2.5.29.65": { "d": "singleUse", "c": "X.509 extension", "w": false },
        "2.5.29.66": { "d": "groupAC", "c": "X.509 extension", "w": false },
        "2.5.29.67": { "d": "allowedAttAss", "c": "X.509 extension", "w": false },
        "2.5.29.68": { "d": "attributeMappings", "c": "X.509 extension", "w": false },
        "2.5.29.69": { "d": "holderNameConstraints", "c": "X.509 extension", "w": false },
        "2.16.724.1.2.2.4.1": { "d": "personalDataInfo", "c": "Spanish Government PKI?", "w": false },
        "2.16.840.1.101.2.1.1.1": { "d": "sdnsSignatureAlgorithm", "c": "SDN.700 INFOSEC algorithms", "w": false },
        "2.16.840.1.101.2.1.1.2": { "d": "fortezzaSignatureAlgorithm", "c": "SDN.700 INFOSEC algorithms.  Formerly known as mosaicSignatureAlgorithm, this OID is better known as dsaWithSHA-1.", "w": false },
        "2.16.840.1.101.2.1.1.3": { "d": "sdnsConfidentialityAlgorithm", "c": "SDN.700 INFOSEC algorithms", "w": false },
        "2.16.840.1.101.2.1.1.4": { "d": "fortezzaConfidentialityAlgorithm", "c": "SDN.700 INFOSEC algorithms.  Formerly known as mosaicConfidentialityAlgorithm", "w": false },
        "2.16.840.1.101.2.1.1.5": { "d": "sdnsIntegrityAlgorithm", "c": "SDN.700 INFOSEC algorithms", "w": false },
        "2.16.840.1.101.2.1.1.6": { "d": "fortezzaIntegrityAlgorithm", "c": "SDN.700 INFOSEC algorithms.  Formerly known as mosaicIntegrityAlgorithm", "w": false },
        "2.16.840.1.101.2.1.1.7": { "d": "sdnsTokenProtectionAlgorithm", "c": "SDN.700 INFOSEC algorithms", "w": false },
        "2.16.840.1.101.2.1.1.8": { "d": "fortezzaTokenProtectionAlgorithm", "c": "SDN.700 INFOSEC algorithms.  Formerly know as mosaicTokenProtectionAlgorithm", "w": false },
        "2.16.840.1.101.2.1.1.9": { "d": "sdnsKeyManagementAlgorithm", "c": "SDN.700 INFOSEC algorithms", "w": false },
        "2.16.840.1.101.2.1.1.10": { "d": "fortezzaKeyManagementAlgorithm", "c": "SDN.700 INFOSEC algorithms.  Formerly known as mosaicKeyManagementAlgorithm", "w": false },
        "2.16.840.1.101.2.1.1.11": { "d": "sdnsKMandSigAlgorithm", "c": "SDN.700 INFOSEC algorithms", "w": false },
        "2.16.840.1.101.2.1.1.12": { "d": "fortezzaKMandSigAlgorithm", "c": "SDN.700 INFOSEC algorithms.  Formerly known as mosaicKMandSigAlgorithm", "w": false },
        "2.16.840.1.101.2.1.1.13": { "d": "suiteASignatureAlgorithm", "c": "SDN.700 INFOSEC algorithms", "w": false },
        "2.16.840.1.101.2.1.1.14": { "d": "suiteAConfidentialityAlgorithm", "c": "SDN.700 INFOSEC algorithms", "w": false },
        "2.16.840.1.101.2.1.1.15": { "d": "suiteAIntegrityAlgorithm", "c": "SDN.700 INFOSEC algorithms", "w": false },
        "2.16.840.1.101.2.1.1.16": { "d": "suiteATokenProtectionAlgorithm", "c": "SDN.700 INFOSEC algorithms", "w": false },
        "2.16.840.1.101.2.1.1.17": { "d": "suiteAKeyManagementAlgorithm", "c": "SDN.700 INFOSEC algorithms", "w": false },
        "2.16.840.1.101.2.1.1.18": { "d": "suiteAKMandSigAlgorithm", "c": "SDN.700 INFOSEC algorithms", "w": false },
        "2.16.840.1.101.2.1.1.19": { "d": "fortezzaUpdatedSigAlgorithm", "c": "SDN.700 INFOSEC algorithms.  Formerly known as mosaicUpdatedSigAlgorithm", "w": false },
        "2.16.840.1.101.2.1.1.20": { "d": "fortezzaKMandUpdSigAlgorithms", "c": "SDN.700 INFOSEC algorithms.  Formerly known as mosaicKMandUpdSigAlgorithms", "w": false },
        "2.16.840.1.101.2.1.1.21": { "d": "fortezzaUpdatedIntegAlgorithm", "c": "SDN.700 INFOSEC algorithms.  Formerly known as mosaicUpdatedIntegAlgorithm", "w": false },
        "2.16.840.1.101.2.1.1.22": { "d": "keyExchangeAlgorithm", "c": "SDN.700 INFOSEC algorithms.  Formerly known as mosaicKeyEncryptionAlgorithm", "w": false },
        "2.16.840.1.101.2.1.1.23": { "d": "fortezzaWrap80Algorithm", "c": "SDN.700 INFOSEC algorithms", "w": false },
        "2.16.840.1.101.2.1.1.24": { "d": "kEAKeyEncryptionAlgorithm", "c": "SDN.700 INFOSEC algorithms", "w": false },
        "2.16.840.1.101.2.1.2.1": { "d": "rfc822MessageFormat", "c": "SDN.700 INFOSEC format", "w": false },
        "2.16.840.1.101.2.1.2.2": { "d": "emptyContent", "c": "SDN.700 INFOSEC format", "w": false },
        "2.16.840.1.101.2.1.2.3": { "d": "cspContentType", "c": "SDN.700 INFOSEC format", "w": false },
        "2.16.840.1.101.2.1.2.42": { "d": "mspRev3ContentType", "c": "SDN.700 INFOSEC format", "w": false },
        "2.16.840.1.101.2.1.2.48": { "d": "mspContentType", "c": "SDN.700 INFOSEC format", "w": false },
        "2.16.840.1.101.2.1.2.49": { "d": "mspRekeyAgentProtocol", "c": "SDN.700 INFOSEC format", "w": false },
        "2.16.840.1.101.2.1.2.50": { "d": "mspMMP", "c": "SDN.700 INFOSEC format", "w": false },
        "2.16.840.1.101.2.1.2.66": { "d": "mspRev3-1ContentType", "c": "SDN.700 INFOSEC format", "w": false },
        "2.16.840.1.101.2.1.2.72": { "d": "forwardedMSPMessageBodyPart", "c": "SDN.700 INFOSEC format", "w": false },
        "2.16.840.1.101.2.1.2.73": { "d": "mspForwardedMessageParameters", "c": "SDN.700 INFOSEC format", "w": false },
        "2.16.840.1.101.2.1.2.74": { "d": "forwardedCSPMsgBodyPart", "c": "SDN.700 INFOSEC format", "w": false },
        "2.16.840.1.101.2.1.2.75": { "d": "cspForwardedMessageParameters", "c": "SDN.700 INFOSEC format", "w": false },
        "2.16.840.1.101.2.1.2.76": { "d": "mspMMP2", "c": "SDN.700 INFOSEC format", "w": false },
        "2.16.840.1.101.2.1.3.1": { "d": "sdnsSecurityPolicy", "c": "SDN.700 INFOSEC policy", "w": false },
        "2.16.840.1.101.2.1.3.2": { "d": "sdnsPRBAC", "c": "SDN.700 INFOSEC policy", "w": false },
        "2.16.840.1.101.2.1.3.3": { "d": "mosaicPRBAC", "c": "SDN.700 INFOSEC policy", "w": false },
        "2.16.840.1.101.2.1.3.10": { "d": "siSecurityPolicy", "c": "SDN.700 INFOSEC policy", "w": false },
        "2.16.840.1.101.2.1.3.10.0": { "d": "siNASP", "c": "SDN.700 INFOSEC policy (obsolete)", "w": true },
        "2.16.840.1.101.2.1.3.10.1": { "d": "siELCO", "c": "SDN.700 INFOSEC policy (obsolete)", "w": true },
        "2.16.840.1.101.2.1.3.10.2": { "d": "siTK", "c": "SDN.700 INFOSEC policy (obsolete)", "w": true },
        "2.16.840.1.101.2.1.3.10.3": { "d": "siDSAP", "c": "SDN.700 INFOSEC policy (obsolete)", "w": true },
        "2.16.840.1.101.2.1.3.10.4": { "d": "siSSSS", "c": "SDN.700 INFOSEC policy (obsolete)", "w": true },
        "2.16.840.1.101.2.1.3.10.5": { "d": "siDNASP", "c": "SDN.700 INFOSEC policy (obsolete)", "w": true },
        "2.16.840.1.101.2.1.3.10.6": { "d": "siBYEMAN", "c": "SDN.700 INFOSEC policy (obsolete)", "w": true },
        "2.16.840.1.101.2.1.3.10.7": { "d": "siREL-US", "c": "SDN.700 INFOSEC policy (obsolete)", "w": true },
        "2.16.840.1.101.2.1.3.10.8": { "d": "siREL-AUS", "c": "SDN.700 INFOSEC policy (obsolete)", "w": true },
        "2.16.840.1.101.2.1.3.10.9": { "d": "siREL-CAN", "c": "SDN.700 INFOSEC policy (obsolete)", "w": true },
        "2.16.840.1.101.2.1.3.10.10": { "d": "siREL_UK", "c": "SDN.700 INFOSEC policy (obsolete)", "w": true },
        "2.16.840.1.101.2.1.3.10.11": { "d": "siREL-NZ", "c": "SDN.700 INFOSEC policy (obsolete)", "w": true },
        "2.16.840.1.101.2.1.3.10.12": { "d": "siGeneric", "c": "SDN.700 INFOSEC policy (obsolete)", "w": true },
        "2.16.840.1.101.2.1.3.11": { "d": "genser", "c": "SDN.700 INFOSEC policy", "w": false },
        "2.16.840.1.101.2.1.3.11.0": { "d": "genserNations", "c": "SDN.700 INFOSEC policy (obsolete)", "w": true },
        "2.16.840.1.101.2.1.3.11.1": { "d": "genserComsec", "c": "SDN.700 INFOSEC policy (obsolete)", "w": true },
        "2.16.840.1.101.2.1.3.11.2": { "d": "genserAcquisition", "c": "SDN.700 INFOSEC policy (obsolete)", "w": true },
        "2.16.840.1.101.2.1.3.11.3": { "d": "genserSecurityCategories", "c": "SDN.700 INFOSEC policy", "w": false },
        "2.16.840.1.101.2.1.3.11.3.0": { "d": "genserTagSetName", "c": "SDN.700 INFOSEC GENSER policy", "w": false },
        "2.16.840.1.101.2.1.3.12": { "d": "defaultSecurityPolicy", "c": "SDN.700 INFOSEC policy", "w": false },
        "2.16.840.1.101.2.1.3.13": { "d": "capcoMarkings", "c": "SDN.700 INFOSEC policy", "w": false },
        "2.16.840.1.101.2.1.3.13.0": { "d": "capcoSecurityCategories", "c": "SDN.700 INFOSEC policy CAPCO markings", "w": false },
        "2.16.840.1.101.2.1.3.13.0.1": { "d": "capcoTagSetName1", "c": "SDN.700 INFOSEC policy CAPCO markings", "w": false },
        "2.16.840.1.101.2.1.3.13.0.2": { "d": "capcoTagSetName2", "c": "SDN.700 INFOSEC policy CAPCO markings", "w": false },
        "2.16.840.1.101.2.1.3.13.0.3": { "d": "capcoTagSetName3", "c": "SDN.700 INFOSEC policy CAPCO markings", "w": false },
        "2.16.840.1.101.2.1.3.13.0.4": { "d": "capcoTagSetName4", "c": "SDN.700 INFOSEC policy CAPCO markings", "w": false },
        "2.16.840.1.101.2.1.5.1": { "d": "sdnsKeyManagementCertificate", "c": "SDN.700 INFOSEC attributes (superseded)", "w": true },
        "2.16.840.1.101.2.1.5.2": { "d": "sdnsUserSignatureCertificate", "c": "SDN.700 INFOSEC attributes (superseded)", "w": true },
        "2.16.840.1.101.2.1.5.3": { "d": "sdnsKMandSigCertificate", "c": "SDN.700 INFOSEC attributes (superseded)", "w": true },
        "2.16.840.1.101.2.1.5.4": { "d": "fortezzaKeyManagementCertificate", "c": "SDN.700 INFOSEC attributes (superseded)", "w": true },
        "2.16.840.1.101.2.1.5.5": { "d": "fortezzaKMandSigCertificate", "c": "SDN.700 INFOSEC attributes (superseded)", "w": true },
        "2.16.840.1.101.2.1.5.6": { "d": "fortezzaUserSignatureCertificate", "c": "SDN.700 INFOSEC attributes (superseded)", "w": true },
        "2.16.840.1.101.2.1.5.7": { "d": "fortezzaCASignatureCertificate", "c": "SDN.700 INFOSEC attributes (superseded)", "w": true },
        "2.16.840.1.101.2.1.5.8": { "d": "sdnsCASignatureCertificate", "c": "SDN.700 INFOSEC attributes (superseded)", "w": true },
        "2.16.840.1.101.2.1.5.10": { "d": "auxiliaryVector", "c": "SDN.700 INFOSEC attributes (superseded)", "w": true },
        "2.16.840.1.101.2.1.5.11": { "d": "mlReceiptPolicy", "c": "SDN.700 INFOSEC attributes", "w": false },
        "2.16.840.1.101.2.1.5.12": { "d": "mlMembership", "c": "SDN.700 INFOSEC attributes", "w": false },
        "2.16.840.1.101.2.1.5.13": { "d": "mlAdministrators", "c": "SDN.700 INFOSEC attributes", "w": false },
        "2.16.840.1.101.2.1.5.14": { "d": "alid", "c": "SDN.700 INFOSEC attributes", "w": false },
        "2.16.840.1.101.2.1.5.20": { "d": "janUKMs", "c": "SDN.700 INFOSEC attributes", "w": false },
        "2.16.840.1.101.2.1.5.21": { "d": "febUKMs", "c": "SDN.700 INFOSEC attributes", "w": false },
        "2.16.840.1.101.2.1.5.22": { "d": "marUKMs", "c": "SDN.700 INFOSEC attributes", "w": false },
        "2.16.840.1.101.2.1.5.23": { "d": "aprUKMs", "c": "SDN.700 INFOSEC attributes", "w": false },
        "2.16.840.1.101.2.1.5.24": { "d": "mayUKMs", "c": "SDN.700 INFOSEC attributes", "w": false },
        "2.16.840.1.101.2.1.5.25": { "d": "junUKMs", "c": "SDN.700 INFOSEC attributes", "w": false },
        "2.16.840.1.101.2.1.5.26": { "d": "julUKMs", "c": "SDN.700 INFOSEC attributes", "w": false },
        "2.16.840.1.101.2.1.5.27": { "d": "augUKMs", "c": "SDN.700 INFOSEC attributes", "w": false },
        "2.16.840.1.101.2.1.5.28": { "d": "sepUKMs", "c": "SDN.700 INFOSEC attributes", "w": false },
        "2.16.840.1.101.2.1.5.29": { "d": "octUKMs", "c": "SDN.700 INFOSEC attributes", "w": false },
        "2.16.840.1.101.2.1.5.30": { "d": "novUKMs", "c": "SDN.700 INFOSEC attributes", "w": false },
        "2.16.840.1.101.2.1.5.31": { "d": "decUKMs", "c": "SDN.700 INFOSEC attributes", "w": false },
        "2.16.840.1.101.2.1.5.40": { "d": "metaSDNSckl", "c": "SDN.700 INFOSEC attributes", "w": false },
        "2.16.840.1.101.2.1.5.41": { "d": "sdnsCKL", "c": "SDN.700 INFOSEC attributes", "w": false },
        "2.16.840.1.101.2.1.5.42": { "d": "metaSDNSsignatureCKL", "c": "SDN.700 INFOSEC attributes", "w": false },
        "2.16.840.1.101.2.1.5.43": { "d": "sdnsSignatureCKL", "c": "SDN.700 INFOSEC attributes", "w": false },
        "2.16.840.1.101.2.1.5.44": { "d": "sdnsCertificateRevocationList", "c": "SDN.700 INFOSEC attributes", "w": false },
        "2.16.840.1.101.2.1.5.45": { "d": "fortezzaCertificateRevocationList", "c": "SDN.700 INFOSEC attributes (superseded)", "w": true },
        "2.16.840.1.101.2.1.5.46": { "d": "fortezzaCKL", "c": "SDN.700 INFOSEC attributes", "w": false },
        "2.16.840.1.101.2.1.5.47": { "d": "alExemptedAddressProcessor", "c": "SDN.700 INFOSEC attributes", "w": false },
        "2.16.840.1.101.2.1.5.48": { "d": "guard", "c": "SDN.700 INFOSEC attributes (obsolete)", "w": true },
        "2.16.840.1.101.2.1.5.49": { "d": "algorithmsSupported", "c": "SDN.700 INFOSEC attributes (obsolete)", "w": true },
        "2.16.840.1.101.2.1.5.50": { "d": "suiteAKeyManagementCertificate", "c": "SDN.700 INFOSEC attributes (obsolete)", "w": true },
        "2.16.840.1.101.2.1.5.51": { "d": "suiteAKMandSigCertificate", "c": "SDN.700 INFOSEC attributes (obsolete)", "w": true },
        "2.16.840.1.101.2.1.5.52": { "d": "suiteAUserSignatureCertificate", "c": "SDN.700 INFOSEC attributes (obsolete)", "w": true },
        "2.16.840.1.101.2.1.5.53": { "d": "prbacInfo", "c": "SDN.700 INFOSEC attributes", "w": false },
        "2.16.840.1.101.2.1.5.54": { "d": "prbacCAConstraints", "c": "SDN.700 INFOSEC attributes", "w": false },
        "2.16.840.1.101.2.1.5.55": { "d": "sigOrKMPrivileges", "c": "SDN.700 INFOSEC attributes", "w": false },
        "2.16.840.1.101.2.1.5.56": { "d": "commPrivileges", "c": "SDN.700 INFOSEC attributes", "w": false },
        "2.16.840.1.101.2.1.5.57": { "d": "labeledAttribute", "c": "SDN.700 INFOSEC attributes", "w": false },
        "2.16.840.1.101.2.1.5.58": { "d": "policyInformationFile", "c": "SDN.700 INFOSEC attributes (obsolete)", "w": true },
        "2.16.840.1.101.2.1.5.59": { "d": "secPolicyInformationFile", "c": "SDN.700 INFOSEC attributes", "w": false },
        "2.16.840.1.101.2.1.5.60": { "d": "cAClearanceConstraint", "c": "SDN.700 INFOSEC attributes", "w": false },
        "2.16.840.1.101.2.1.7.1": { "d": "cspExtns", "c": "SDN.700 INFOSEC extensions", "w": false },
        "2.16.840.1.101.2.1.7.1.0": { "d": "cspCsExtn", "c": "SDN.700 INFOSEC extensions", "w": false },
        "2.16.840.1.101.2.1.8.1": { "d": "mISSISecurityCategories", "c": "SDN.700 INFOSEC security category", "w": false },
        "2.16.840.1.101.2.1.8.2": { "d": "standardSecurityLabelPrivileges", "c": "SDN.700 INFOSEC security category", "w": false },
        "2.16.840.1.101.2.1.10.1": { "d": "sigPrivileges", "c": "SDN.700 INFOSEC privileges", "w": false },
        "2.16.840.1.101.2.1.10.2": { "d": "kmPrivileges", "c": "SDN.700 INFOSEC privileges", "w": false },
        "2.16.840.1.101.2.1.10.3": { "d": "namedTagSetPrivilege", "c": "SDN.700 INFOSEC privileges", "w": false },
        "2.16.840.1.101.2.1.11.1": { "d": "ukDemo", "c": "SDN.700 INFOSEC certificate policy", "w": false },
        "2.16.840.1.101.2.1.11.2": { "d": "usDODClass2", "c": "SDN.700 INFOSEC certificate policy", "w": false },
        "2.16.840.1.101.2.1.11.3": { "d": "usMediumPilot", "c": "SDN.700 INFOSEC certificate policy", "w": false },
        "2.16.840.1.101.2.1.11.4": { "d": "usDODClass4", "c": "SDN.700 INFOSEC certificate policy", "w": false },
        "2.16.840.1.101.2.1.11.5": { "d": "usDODClass3", "c": "SDN.700 INFOSEC certificate policy", "w": false },
        "2.16.840.1.101.2.1.11.6": { "d": "usDODClass5", "c": "SDN.700 INFOSEC certificate policy", "w": false },
        "2.16.840.1.101.2.1.12.0": { "d": "testSecurityPolicy", "c": "SDN.700 INFOSEC test objects", "w": false },
        "2.16.840.1.101.2.1.12.0.1": { "d": "tsp1", "c": "SDN.700 INFOSEC test objects", "w": false },
        "2.16.840.1.101.2.1.12.0.1.0": { "d": "tsp1SecurityCategories", "c": "SDN.700 INFOSEC test objects", "w": false },
        "2.16.840.1.101.2.1.12.0.1.0.0": { "d": "tsp1TagSetZero", "c": "SDN.700 INFOSEC test objects", "w": false },
        "2.16.840.1.101.2.1.12.0.1.0.1": { "d": "tsp1TagSetOne", "c": "SDN.700 INFOSEC test objects", "w": false },
        "2.16.840.1.101.2.1.12.0.1.0.2": { "d": "tsp1TagSetTwo", "c": "SDN.700 INFOSEC test objects", "w": false },
        "2.16.840.1.101.2.1.12.0.2": { "d": "tsp2", "c": "SDN.700 INFOSEC test objects", "w": false },
        "2.16.840.1.101.2.1.12.0.2.0": { "d": "tsp2SecurityCategories", "c": "SDN.700 INFOSEC test objects", "w": false },
        "2.16.840.1.101.2.1.12.0.2.0.0": { "d": "tsp2TagSetZero", "c": "SDN.700 INFOSEC test objects", "w": false },
        "2.16.840.1.101.2.1.12.0.2.0.1": { "d": "tsp2TagSetOne", "c": "SDN.700 INFOSEC test objects", "w": false },
        "2.16.840.1.101.2.1.12.0.2.0.2": { "d": "tsp2TagSetTwo", "c": "SDN.700 INFOSEC test objects", "w": false },
        "2.16.840.1.101.2.1.12.0.3": { "d": "kafka", "c": "SDN.700 INFOSEC test objects", "w": false },
        "2.16.840.1.101.2.1.12.0.3.0": { "d": "kafkaSecurityCategories", "c": "SDN.700 INFOSEC test objects", "w": false },
        "2.16.840.1.101.2.1.12.0.3.0.1": { "d": "kafkaTagSetName1", "c": "SDN.700 INFOSEC test objects", "w": false },
        "2.16.840.1.101.2.1.12.0.3.0.2": { "d": "kafkaTagSetName2", "c": "SDN.700 INFOSEC test objects", "w": false },
        "2.16.840.1.101.2.1.12.0.3.0.3": { "d": "kafkaTagSetName3", "c": "SDN.700 INFOSEC test objects", "w": false },
        "2.16.840.1.101.2.1.12.1.1": { "d": "tcp1", "c": "SDN.700 INFOSEC test objects", "w": false },
        "2.16.840.1.101.3.1": { "d": "slabel", "c": "CSOR GAK", "w": true },
        "2.16.840.1.101.3.2": { "d": "pki", "c": "NIST", "w": true },
        "2.16.840.1.101.3.2.1": { "d": "NIST policyIdentifier", "c": "NIST policies", "w": true },
        "2.16.840.1.101.3.2.1.3.1": { "d": "fbcaRudimentaryPolicy", "c": "Federal Bridge CA Policy", "w": false },
        "2.16.840.1.101.3.2.1.3.2": { "d": "fbcaBasicPolicy", "c": "Federal Bridge CA Policy", "w": false },
        "2.16.840.1.101.3.2.1.3.3": { "d": "fbcaMediumPolicy", "c": "Federal Bridge CA Policy", "w": false },
        "2.16.840.1.101.3.2.1.3.4": { "d": "fbcaHighPolicy", "c": "Federal Bridge CA Policy", "w": false },
        "2.16.840.1.101.3.2.1.48.1": { "d": "nistTestPolicy1", "c": "NIST PKITS policies", "w": false },
        "2.16.840.1.101.3.2.1.48.2": { "d": "nistTestPolicy2", "c": "NIST PKITS policies", "w": false },
        "2.16.840.1.101.3.2.1.48.3": { "d": "nistTestPolicy3", "c": "NIST PKITS policies", "w": false },
        "2.16.840.1.101.3.2.1.48.4": { "d": "nistTestPolicy4", "c": "NIST PKITS policies", "w": false },
        "2.16.840.1.101.3.2.1.48.5": { "d": "nistTestPolicy5", "c": "NIST PKITS policies", "w": false },
        "2.16.840.1.101.3.2.1.48.6": { "d": "nistTestPolicy6", "c": "NIST PKITS policies", "w": false },
        "2.16.840.1.101.3.2.2": { "d": "gak", "c": "CSOR GAK extended key usage", "w": true },
        "2.16.840.1.101.3.2.2.1": { "d": "kRAKey", "c": "CSOR GAK extended key usage", "w": true },
        "2.16.840.1.101.3.2.3": { "d": "extensions", "c": "CSOR GAK extensions", "w": true },
        "2.16.840.1.101.3.2.3.1": { "d": "kRTechnique", "c": "CSOR GAK extensions", "w": true },
        "2.16.840.1.101.3.2.3.2": { "d": "kRecoveryCapable", "c": "CSOR GAK extensions", "w": true },
        "2.16.840.1.101.3.2.3.3": { "d": "kR", "c": "CSOR GAK extensions", "w": true },
        "2.16.840.1.101.3.2.4": { "d": "keyRecoverySchemes", "c": "CSOR GAK", "w": true },
        "2.16.840.1.101.3.2.5": { "d": "krapola", "c": "CSOR GAK", "w": true },
        "2.16.840.1.101.3.3": { "d": "arpa", "c": "CSOR GAK", "w": true },
        "2.16.840.1.101.3.4": { "d": "nistAlgorithm", "c": "NIST Algorithm", "w": false },
        "2.16.840.1.101.3.4.1": { "d": "aes", "c": "NIST Algorithm", "w": false },
        "2.16.840.1.101.3.4.1.1": { "d": "aes128-ECB", "c": "NIST Algorithm", "w": false },
        "2.16.840.1.101.3.4.1.2": { "d": "aes128-CBC", "c": "NIST Algorithm", "w": false },
        "2.16.840.1.101.3.4.1.3": { "d": "aes128-OFB", "c": "NIST Algorithm", "w": false },
        "2.16.840.1.101.3.4.1.4": { "d": "aes128-CFB", "c": "NIST Algorithm", "w": false },
        "2.16.840.1.101.3.4.1.5": { "d": "aes128-wrap", "c": "NIST Algorithm", "w": false },
        "2.16.840.1.101.3.4.1.6": { "d": "aes128-GCM", "c": "NIST Algorithm", "w": false },
        "2.16.840.1.101.3.4.1.7": { "d": "aes128-CCM", "c": "NIST Algorithm", "w": false },
        "2.16.840.1.101.3.4.1.8": { "d": "aes128-wrap-pad", "c": "NIST Algorithm", "w": false },
        "2.16.840.1.101.3.4.1.21": { "d": "aes192-ECB", "c": "NIST Algorithm", "w": false },
        "2.16.840.1.101.3.4.1.22": { "d": "aes192-CBC", "c": "NIST Algorithm", "w": false },
        "2.16.840.1.101.3.4.1.23": { "d": "aes192-OFB", "c": "NIST Algorithm", "w": false },
        "2.16.840.1.101.3.4.1.24": { "d": "aes192-CFB", "c": "NIST Algorithm", "w": false },
        "2.16.840.1.101.3.4.1.25": { "d": "aes192-wrap", "c": "NIST Algorithm", "w": false },
        "2.16.840.1.101.3.4.1.26": { "d": "aes192-GCM", "c": "NIST Algorithm", "w": false },
        "2.16.840.1.101.3.4.1.27": { "d": "aes192-CCM", "c": "NIST Algorithm", "w": false },
        "2.16.840.1.101.3.4.1.28": { "d": "aes192-wrap-pad", "c": "NIST Algorithm", "w": false },
        "2.16.840.1.101.3.4.1.41": { "d": "aes256-ECB", "c": "NIST Algorithm", "w": false },
        "2.16.840.1.101.3.4.1.42": { "d": "aes256-CBC", "c": "NIST Algorithm", "w": false },
        "2.16.840.1.101.3.4.1.43": { "d": "aes256-OFB", "c": "NIST Algorithm", "w": false },
        "2.16.840.1.101.3.4.1.44": { "d": "aes256-CFB", "c": "NIST Algorithm", "w": false },
        "2.16.840.1.101.3.4.1.45": { "d": "aes256-wrap", "c": "NIST Algorithm", "w": false },
        "2.16.840.1.101.3.4.1.46": { "d": "aes256-GCM", "c": "NIST Algorithm", "w": false },
        "2.16.840.1.101.3.4.1.47": { "d": "aes256-CCM", "c": "NIST Algorithm", "w": false },
        "2.16.840.1.101.3.4.1.48": { "d": "aes256-wrap-pad", "c": "NIST Algorithm", "w": false },
        "2.16.840.1.101.3.4.2": { "d": "hashAlgos", "c": "NIST Algorithm", "w": false },
        "2.16.840.1.101.3.4.2.1": { "d": "sha-256", "c": "NIST Algorithm", "w": false },
        "2.16.840.1.101.3.4.2.2": { "d": "sha-384", "c": "NIST Algorithm", "w": false },
        "2.16.840.1.101.3.4.2.3": { "d": "sha-512", "c": "NIST Algorithm", "w": false },
        "2.16.840.1.101.3.4.2.4": { "d": "sha-224", "c": "NIST Algorithm", "w": false },
        "2.16.840.1.101.3.4.3.1": { "d": "dsaWithSha224", "c": "NIST Algorithm", "w": false },
        "2.16.840.1.101.3.4.3.2": { "d": "dsaWithSha256", "c": "NIST Algorithm", "w": false },
        "2.16.840.1.113719.1.2.8": { "d": "novellAlgorithm", "c": "Novell", "w": false },
        "2.16.840.1.113719.1.2.8.22": { "d": "desCbcIV8", "c": "Novell encryption algorithm", "w": false },
        "2.16.840.1.113719.1.2.8.23": { "d": "desCbcPadIV8", "c": "Novell encryption algorithm", "w": false },
        "2.16.840.1.113719.1.2.8.24": { "d": "desEDE2CbcIV8", "c": "Novell encryption algorithm", "w": false },
        "2.16.840.1.113719.1.2.8.25": { "d": "desEDE2CbcPadIV8", "c": "Novell encryption algorithm", "w": false },
        "2.16.840.1.113719.1.2.8.26": { "d": "desEDE3CbcIV8", "c": "Novell encryption algorithm", "w": false },
        "2.16.840.1.113719.1.2.8.27": { "d": "desEDE3CbcPadIV8", "c": "Novell encryption algorithm", "w": false },
        "2.16.840.1.113719.1.2.8.28": { "d": "rc5CbcPad", "c": "Novell encryption algorithm", "w": false },
        "2.16.840.1.113719.1.2.8.29": { "d": "md2WithRSAEncryptionBSafe1", "c": "Novell signature algorithm", "w": false },
        "2.16.840.1.113719.1.2.8.30": { "d": "md5WithRSAEncryptionBSafe1", "c": "Novell signature algorithm", "w": false },
        "2.16.840.1.113719.1.2.8.31": { "d": "sha1WithRSAEncryptionBSafe1", "c": "Novell signature algorithm", "w": false },
        "2.16.840.1.113719.1.2.8.32": { "d": "lmDigest", "c": "Novell digest algorithm", "w": false },
        "2.16.840.1.113719.1.2.8.40": { "d": "md2", "c": "Novell digest algorithm", "w": false },
        "2.16.840.1.113719.1.2.8.50": { "d": "md5", "c": "Novell digest algorithm", "w": false },
        "2.16.840.1.113719.1.2.8.51": { "d": "ikeHmacWithSHA1-RSA", "c": "Novell signature algorithm", "w": false },
        "2.16.840.1.113719.1.2.8.52": { "d": "ikeHmacWithMD5-RSA", "c": "Novell signature algorithm", "w": false },
        "2.16.840.1.113719.1.2.8.69": { "d": "rc2CbcPad", "c": "Novell encryption algorithm", "w": false },
        "2.16.840.1.113719.1.2.8.82": { "d": "sha-1", "c": "Novell digest algorithm", "w": false },
        "2.16.840.1.113719.1.2.8.92": { "d": "rc2BSafe1Cbc", "c": "Novell encryption algorithm", "w": false },
        "2.16.840.1.113719.1.2.8.95": { "d": "md4", "c": "Novell digest algorithm", "w": false },
        "2.16.840.1.113719.1.2.8.130": { "d": "md4Packet", "c": "Novell keyed hash", "w": false },
        "2.16.840.1.113719.1.2.8.131": { "d": "rsaEncryptionBsafe1", "c": "Novell encryption algorithm", "w": false },
        "2.16.840.1.113719.1.2.8.132": { "d": "nwPassword", "c": "Novell encryption algorithm", "w": false },
        "2.16.840.1.113719.1.2.8.133": { "d": "novellObfuscate-1", "c": "Novell encryption algorithm", "w": false },
        "2.16.840.1.113719.1.9": { "d": "pki", "c": "Novell", "w": false },
        "2.16.840.1.113719.1.9.4": { "d": "pkiAttributeType", "c": "Novell PKI", "w": false },
        "2.16.840.1.113719.1.9.4.1": { "d": "securityAttributes", "c": "Novell PKI attribute type", "w": false },
        "2.16.840.1.113719.1.9.4.2": { "d": "relianceLimit", "c": "Novell PKI attribute type", "w": false },
        "2.16.840.1.113730.1": { "d": "cert-extension", "c": "Netscape", "w": false },
        "2.16.840.1.113730.1.1": { "d": "netscape-cert-type", "c": "Netscape certificate extension", "w": false },
        "2.16.840.1.113730.1.2": { "d": "netscape-base-url", "c": "Netscape certificate extension", "w": false },
        "2.16.840.1.113730.1.3": { "d": "netscape-revocation-url", "c": "Netscape certificate extension", "w": false },
        "2.16.840.1.113730.1.4": { "d": "netscape-ca-revocation-url", "c": "Netscape certificate extension", "w": false },
        "2.16.840.1.113730.1.7": { "d": "netscape-cert-renewal-url", "c": "Netscape certificate extension", "w": false },
        "2.16.840.1.113730.1.8": { "d": "netscape-ca-policy-url", "c": "Netscape certificate extension", "w": false },
        "2.16.840.1.113730.1.9": { "d": "HomePage-url", "c": "Netscape certificate extension", "w": false },
        "2.16.840.1.113730.1.10": { "d": "EntityLogo", "c": "Netscape certificate extension", "w": false },
        "2.16.840.1.113730.1.11": { "d": "UserPicture", "c": "Netscape certificate extension", "w": false },
        "2.16.840.1.113730.1.12": { "d": "netscape-ssl-server-name", "c": "Netscape certificate extension", "w": false },
        "2.16.840.1.113730.1.13": { "d": "netscape-comment", "c": "Netscape certificate extension", "w": false },
        "2.16.840.1.113730.2": { "d": "data-type", "c": "Netscape", "w": false },
        "2.16.840.1.113730.2.1": { "d": "dataGIF", "c": "Netscape data type", "w": false },
        "2.16.840.1.113730.2.2": { "d": "dataJPEG", "c": "Netscape data type", "w": false },
        "2.16.840.1.113730.2.3": { "d": "dataURL", "c": "Netscape data type", "w": false },
        "2.16.840.1.113730.2.4": { "d": "dataHTML", "c": "Netscape data type", "w": false },
        "2.16.840.1.113730.2.5": { "d": "certSequence", "c": "Netscape data type", "w": false },
        "2.16.840.1.113730.2.6": { "d": "certURL", "c": "Netscape certificate extension", "w": false },
        "2.16.840.1.113730.3": { "d": "directory", "c": "Netscape", "w": false },
        "2.16.840.1.113730.3.1": { "d": "ldapDefinitions", "c": "Netscape directory", "w": false },
        "2.16.840.1.113730.3.1.1": { "d": "carLicense", "c": "Netscape LDAP definitions", "w": false },
        "2.16.840.1.113730.3.1.2": { "d": "departmentNumber", "c": "Netscape LDAP definitions", "w": false },
        "2.16.840.1.113730.3.1.3": { "d": "employeeNumber", "c": "Netscape LDAP definitions", "w": false },
        "2.16.840.1.113730.3.1.4": { "d": "employeeType", "c": "Netscape LDAP definitions", "w": false },
        "2.16.840.1.113730.3.2.2": { "d": "inetOrgPerson", "c": "Netscape LDAP definitions", "w": false },
        "2.16.840.1.113730.4.1": { "d": "serverGatedCrypto", "c": "Netscape", "w": false },
        "2.16.840.1.113733.1.6.3": { "d": "verisignCZAG", "c": "Verisign extension", "w": false },
        "2.16.840.1.113733.1.6.6": { "d": "verisignInBox", "c": "Verisign extension", "w": false },
        "2.16.840.1.113733.1.6.11": { "d": "verisignOnsiteJurisdictionHash", "c": "Verisign extension", "w": false },
        "2.16.840.1.113733.1.6.13": { "d": "Unknown Verisign VPN extension", "c": "Verisign extension", "w": false },
        "2.16.840.1.113733.1.6.15": { "d": "verisignServerID", "c": "Verisign extension", "w": false },
        "2.16.840.1.113733.1.7.1.1": { "d": "verisignCertPolicies95Qualifier1", "c": "Verisign policy", "w": false },
        "2.16.840.1.113733.1.7.1.1.1": { "d": "verisignCPSv1notice", "c": "Verisign policy (obsolete)", "w": false },
        "2.16.840.1.113733.1.7.1.1.2": { "d": "verisignCPSv1nsi", "c": "Verisign policy (obsolete)", "w": false },
        "2.16.840.1.113733.1.7.23.6": { "d": "verisignEVPolicy", "c": "Verisign extension", "w": false },
        "2.16.840.1.113733.1.8.1": { "d": "verisignISSStrongCrypto", "c": "Verisign", "w": false },
        "2.16.840.1.113733.1": { "d": "pki", "c": "Verisign extension", "w": false },
        "2.16.840.1.113733.1.9": { "d": "pkcs7Attribute", "c": "Verisign PKI extension", "w": false },
        "2.16.840.1.113733.1.9.2": { "d": "messageType", "c": "Verisign PKCS #7 attribute", "w": false },
        "2.16.840.1.113733.1.9.3": { "d": "pkiStatus", "c": "Verisign PKCS #7 attribute", "w": false },
        "2.16.840.1.113733.1.9.4": { "d": "failInfo", "c": "Verisign PKCS #7 attribute", "w": false },
        "2.16.840.1.113733.1.9.5": { "d": "senderNonce", "c": "Verisign PKCS #7 attribute", "w": false },
        "2.16.840.1.113733.1.9.6": { "d": "recipientNonce", "c": "Verisign PKCS #7 attribute", "w": false },
        "2.16.840.1.113733.1.9.7": { "d": "transID", "c": "Verisign PKCS #7 attribute", "w": false },
        "2.16.840.1.113733.1.9.8": { "d": "extensionReq", "c": "Verisign PKCS #7 attribute.  Use PKCS #9 extensionRequest instead", "w": true },
        "2.16.840.1.114412.1.3.0.1": { "d": "digiCertGlobalCAPolicy", "c": "Digicert CA policy", "w": false },
        "2.16.840.1.114412.1.3.0.2": { "d": "digiCertHighAssuranceEVCAPolicy", "c": "Digicert CA policy", "w": false },
        "2.16.840.1.114412.1.3.0.3": { "d": "digiCertGlobalRootCAPolicy", "c": "Digicert CA policy", "w": false },
        "2.16.840.1.114412.1.3.0.4": { "d": "digiCertAssuredIDRootCAPolicy", "c": "Digicert CA policy", "w": false },
        "2.23.42.0": { "d": "contentType", "c": "SET", "w": false },
        "2.23.42.0.0": { "d": "panData", "c": "SET contentType", "w": false },
        "2.23.42.0.1": { "d": "panToken", "c": "SET contentType", "w": false },
        "2.23.42.0.2": { "d": "panOnly", "c": "SET contentType", "w": false },
        "2.23.42.1": { "d": "msgExt", "c": "SET", "w": false },
        "2.23.42.2": { "d": "field", "c": "SET", "w": false },
        "2.23.42.2.0": { "d": "fullName", "c": "SET field", "w": false },
        "2.23.42.2.1": { "d": "givenName", "c": "SET field", "w": false },
        "2.23.42.2.2": { "d": "familyName", "c": "SET field", "w": false },
        "2.23.42.2.3": { "d": "birthFamilyName", "c": "SET field", "w": false },
        "2.23.42.2.4": { "d": "placeName", "c": "SET field", "w": false },
        "2.23.42.2.5": { "d": "identificationNumber", "c": "SET field", "w": false },
        "2.23.42.2.6": { "d": "month", "c": "SET field", "w": false },
        "2.23.42.2.7": { "d": "date", "c": "SET field", "w": false },
        "2.23.42.2.8": { "d": "address", "c": "SET field", "w": false },
        "2.23.42.2.9": { "d": "telephone", "c": "SET field", "w": false },
        "2.23.42.2.10": { "d": "amount", "c": "SET field", "w": false },
        "2.23.42.2.11": { "d": "accountNumber", "c": "SET field", "w": false },
        "2.23.42.2.12": { "d": "passPhrase", "c": "SET field", "w": false },
        "2.23.42.3": { "d": "attribute", "c": "SET", "w": false },
        "2.23.42.3.0": { "d": "cert", "c": "SET attribute", "w": false },
        "2.23.42.3.0.0": { "d": "rootKeyThumb", "c": "SET cert attribute", "w": false },
        "2.23.42.3.0.1": { "d": "additionalPolicy", "c": "SET cert attribute", "w": false },
        "2.23.42.4": { "d": "algorithm", "c": "SET", "w": false },
        "2.23.42.5": { "d": "policy", "c": "SET", "w": false },
        "2.23.42.5.0": { "d": "root", "c": "SET policy", "w": false },
        "2.23.42.6": { "d": "module", "c": "SET", "w": false },
        "2.23.42.7": { "d": "certExt", "c": "SET", "w": false },
        "2.23.42.7.0": { "d": "hashedRootKey", "c": "SET cert extension", "w": false },
        "2.23.42.7.1": { "d": "certificateType", "c": "SET cert extension", "w": false },
        "2.23.42.7.2": { "d": "merchantData", "c": "SET cert extension", "w": false },
        "2.23.42.7.3": { "d": "cardCertRequired", "c": "SET cert extension", "w": false },
        "2.23.42.7.4": { "d": "tunneling", "c": "SET cert extension", "w": false },
        "2.23.42.7.5": { "d": "setExtensions", "c": "SET cert extension", "w": false },
        "2.23.42.7.6": { "d": "setQualifier", "c": "SET cert extension", "w": false },
        "2.23.42.8": { "d": "brand", "c": "SET", "w": false },
        "2.23.42.8.1": { "d": "IATA-ATA", "c": "SET brand", "w": false },
        "2.23.42.8.4": { "d": "VISA", "c": "SET brand", "w": false },
        "2.23.42.8.5": { "d": "MasterCard", "c": "SET brand", "w": false },
        "2.23.42.8.30": { "d": "Diners", "c": "SET brand", "w": false },
        "2.23.42.8.34": { "d": "AmericanExpress", "c": "SET brand", "w": false },
        "2.23.42.8.6011": { "d": "Novus", "c": "SET brand", "w": false },
        "2.23.42.9": { "d": "vendor", "c": "SET", "w": false },
        "2.23.42.9.0": { "d": "GlobeSet", "c": "SET vendor", "w": false },
        "2.23.42.9.1": { "d": "IBM", "c": "SET vendor", "w": false },
        "2.23.42.9.2": { "d": "CyberCash", "c": "SET vendor", "w": false },
        "2.23.42.9.3": { "d": "Terisa", "c": "SET vendor", "w": false },
        "2.23.42.9.4": { "d": "RSADSI", "c": "SET vendor", "w": false },
        "2.23.42.9.5": { "d": "VeriFone", "c": "SET vendor", "w": false },
        "2.23.42.9.6": { "d": "TrinTech", "c": "SET vendor", "w": false },
        "2.23.42.9.7": { "d": "BankGate", "c": "SET vendor", "w": false },
        "2.23.42.9.8": { "d": "GTE", "c": "SET vendor", "w": false },
        "2.23.42.9.9": { "d": "CompuSource", "c": "SET vendor", "w": false },
        "2.23.42.9.10": { "d": "Griffin", "c": "SET vendor", "w": false },
        "2.23.42.9.11": { "d": "Certicom", "c": "SET vendor", "w": false },
        "2.23.42.9.12": { "d": "OSS", "c": "SET vendor", "w": false },
        "2.23.42.9.13": { "d": "TenthMountain", "c": "SET vendor", "w": false },
        "2.23.42.9.14": { "d": "Antares", "c": "SET vendor", "w": false },
        "2.23.42.9.15": { "d": "ECC", "c": "SET vendor", "w": false },
        "2.23.42.9.16": { "d": "Maithean", "c": "SET vendor", "w": false },
        "2.23.42.9.17": { "d": "Netscape", "c": "SET vendor", "w": false },
        "2.23.42.9.18": { "d": "Verisign", "c": "SET vendor", "w": false },
        "2.23.42.9.19": { "d": "BlueMoney", "c": "SET vendor", "w": false },
        "2.23.42.9.20": { "d": "Lacerte", "c": "SET vendor", "w": false },
        "2.23.42.9.21": { "d": "Fujitsu", "c": "SET vendor", "w": false },
        "2.23.42.9.22": { "d": "eLab", "c": "SET vendor", "w": false },
        "2.23.42.9.23": { "d": "Entrust", "c": "SET vendor", "w": false },
        "2.23.42.9.24": { "d": "VIAnet", "c": "SET vendor", "w": false },
        "2.23.42.9.25": { "d": "III", "c": "SET vendor", "w": false },
        "2.23.42.9.26": { "d": "OpenMarket", "c": "SET vendor", "w": false },
        "2.23.42.9.27": { "d": "Lexem", "c": "SET vendor", "w": false },
        "2.23.42.9.28": { "d": "Intertrader", "c": "SET vendor", "w": false },
        "2.23.42.9.29": { "d": "Persimmon", "c": "SET vendor", "w": false },
        "2.23.42.9.30": { "d": "NABLE", "c": "SET vendor", "w": false },
        "2.23.42.9.31": { "d": "espace-net", "c": "SET vendor", "w": false },
        "2.23.42.9.32": { "d": "Hitachi", "c": "SET vendor", "w": false },
        "2.23.42.9.33": { "d": "Microsoft", "c": "SET vendor", "w": false },
        "2.23.42.9.34": { "d": "NEC", "c": "SET vendor", "w": false },
        "2.23.42.9.35": { "d": "Mitsubishi", "c": "SET vendor", "w": false },
        "2.23.42.9.36": { "d": "NCR", "c": "SET vendor", "w": false },
        "2.23.42.9.37": { "d": "e-COMM", "c": "SET vendor", "w": false },
        "2.23.42.9.38": { "d": "Gemplus", "c": "SET vendor", "w": false },
        "2.23.42.10": { "d": "national", "c": "SET", "w": false },
        "2.23.42.10.392": { "d": "Japan", "c": "SET national", "w": false },
        "2.23.136.1.1.1": { "d": "mRTDSignatureData", "c": "ICAO MRTD", "w": false },
        "2.54.1775.2": { "d": "hashedRootKey", "c": "SET.  Deprecated, use (2 23 42 7 0) instead", "w": true },
        "2.54.1775.3": { "d": "certificateType", "c": "SET.  Deprecated, use (2 23 42 7 0) instead", "w": true },
        "2.54.1775.4": { "d": "merchantData", "c": "SET.  Deprecated, use (2 23 42 7 0) instead", "w": true },
        "2.54.1775.5": { "d": "cardCertRequired", "c": "SET.  Deprecated, use (2 23 42 7 0) instead", "w": true },
        "2.54.1775.6": { "d": "tunneling", "c": "SET.  Deprecated, use (2 23 42 7 0) instead", "w": true },
        "2.54.1775.7": { "d": "setQualifier", "c": "SET.  Deprecated, use (2 23 42 7 0) instead", "w": true },
        "2.54.1775.99": { "d": "setData", "c": "SET.  Deprecated, use (2 23 42 7 0) instead", "w": true },
        "1.3.6.1.4.1.6449.1.2.1.5.1": { "d": "AddTrust EV policy", "c": "AddTrust External CA Root", "w": false },
        "1.3.6.1.4.1.34697.2.1": { "d": "AffirmTrust EV policy", "c": "AffirmTrust Commercial", "w": false },
        "1.3.6.1.4.1.34697.2.2": { "d": "AffirmTrust EV policy", "c": "AffirmTrust Networking", "w": false },
        "1.3.6.1.4.1.34697.2.3": { "d": "AffirmTrust EV policy", "c": "AffirmTrust Premium", "w": false },
        "1.3.6.1.4.1.34697.2.4": { "d": "AffirmTrust EV policy", "c": "AffirmTrust Premium ECC", "w": false },
        "2.16.578.1.26.1.3.3": { "d": "BuyPass EV policy", "c": "BuyPass Class 3 EV", "w": false },
        "1.3.6.1.4.1.22234.2.5.2.3.1": { "d": "CertPlus EV policy", "c": "CertPlus Class 2 Primary CA (KEYNECTIS)", "w": false },
        "1.3.6.1.4.1.6334.1.100.1": { "d": "Cybertrust EV policy", "c": "Cybertrust Global Root", "w": false },
        "2.16.840.1.114412.2.1": { "d": "DigiCert EV policy", "c": "DigiCert High Assurance EV Root CA", "w": false },
        "2.16.528.1.1001.1.1.1.12.6.1.1.1": { "d": "DigiNotar EV policy", "c": "DigiNotar Root CA", "w": false },
        "2.16.840.1.114028.10.1.2": { "d": "Entrust EV policy", "c": "Entrust Net Secure Server Certification Authority", "w": false },
        "1.3.6.1.4.1.14370.1.6": { "d": "Equifax EV policy", "c": "Equifax Secure Certificate Authority (GeoTrust)", "w": false },
        "1.3.6.1.4.1.4146.1.1": { "d": "GlobalSign EV policy", "c": "GlobalSign", "w": false },
        "2.16.840.1.114413.1.7.23.3": { "d": "GoDaddy EV policy", "c": "GoDaddy Class 2 Certification Authority", "w": false },
        "1.3.6.1.4.1.14777.6.1.1": { "d": "Izenpe EV policy", "c": "Certificado de Servidor Seguro SSL EV", "w": false },
        "1.3.6.1.4.1.14777.6.1.2": { "d": "Izenpe EV policy", "c": "Certificado de Sede Electronica EV", "w": false },
        "1.3.6.1.4.1.782.1.2.1.8.1": { "d": "Network Solutions EV policy", "c": "Network Solutions Certificate Authority", "w": false },
        "1.3.6.1.4.1.8024.0.2.100.1.2": { "d": "QuoVadis EV policy", "c": "QuoVadis Root CA 2", "w": false },
        "1.2.392.200091.100.721.1": { "d": "SECOM EV policy", "c": "SECOM Trust Systems EV", "w": false },
        "2.16.840.1.114404.1.1.2.4.1": { "d": "SecureTrust EV policy", "c": "SecureTrust CA, SecureTrust Corporation", "w": false },
        "1.3.6.1.4.1.23223.1.1.1": { "d": "StartCom EV policy", "c": "StartCom Certification Authority", "w": false },
        "2.16.840.1.114414.1.7.23.3": { "d": "Starfield EV policy", "c": "Starfield Class 2 Certification Authority", "w": false },
        "2.16.756.1.89.1.2.1.1": { "d": "SwissSign EV policy", "c": "SwissSign Gold CA - G2", "w": false },
        "2.16.840.1.113733.1.7.48.1": { "d": "Thawte EV policy", "c": "Thawte Premium Server CA", "w": false },
        "2.16.840.1.114171.500.9": { "d": "Wells Fargo EV policy", "c": "Wells Fargo WellsSecure Public Root Certificate Authority", "w": false },
        "END": ""
    };
});
define("Lib/jsrsasign/yahoo", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.YAHOO = {};
    exports.YAHOO.lang = {
        extend: function (subc, superc, overrides) {
            if (!superc || !subc) {
                throw new Error("YAHOO.lang.extend failed, please check that " +
                    "all dependencies are included.");
            }
            var F = function () { };
            F.prototype = superc.prototype;
            subc.prototype = new F();
            subc.prototype.constructor = subc;
            subc.superclass = superc.prototype;
            if (superc.prototype.constructor == Object.prototype.constructor) {
                superc.prototype.constructor = superc;
            }
            if (overrides) {
                var i;
                for (i in overrides) {
                    subc.prototype[i] = overrides[i];
                }
                var _IEEnumFix = function () { }, ADD = ["toString", "valueOf"];
                try {
                    if (/MSIE/.test(navigator.userAgent)) {
                        _IEEnumFix = function (r, s) {
                            for (i = 0; i < ADD.length; i = i + 1) {
                                var fname = ADD[i], f = s[fname];
                                if (typeof f === 'function' && f != Object.prototype[fname]) {
                                    r[fname] = f;
                                }
                            }
                        };
                    }
                }
                catch (ex) { }
                ;
                _IEEnumFix(subc.prototype, overrides);
            }
        }
    };
});
define("Lib/jsrsasign/asn1-1.0", ["require", "exports", "Lib/jsbn/jsbn", "Lib/jsrsasign/yahoo"], function (require, exports, jsbn_3, yahoo_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.KJUR = {};
    if (typeof exports.KJUR.asn1 == "undefined" || !exports.KJUR.asn1)
        exports.KJUR.asn1 = {};
    exports.KJUR.asn1.ASN1Util = new function () {
        this.integerToByteHex = function (i) {
            var h = i.toString(16);
            if ((h.length % 2) == 1)
                h = '0' + h;
            return h;
        };
        this.bigIntToMinTwosComplementsHex = function (bigIntegerValue) {
            var h = bigIntegerValue.toString(16);
            if (h.substr(0, 1) != '-') {
                if (h.length % 2 == 1) {
                    h = '0' + h;
                }
                else {
                    if (!h.match(/^[0-7]/)) {
                        h = '00' + h;
                    }
                }
            }
            else {
                var hPos = h.substr(1);
                var xorLen = hPos.length;
                if (xorLen % 2 == 1) {
                    xorLen += 1;
                }
                else {
                    if (!h.match(/^[0-7]/)) {
                        xorLen += 2;
                    }
                }
                var hMask = '';
                for (var i = 0; i < xorLen; i++) {
                    hMask += 'f';
                }
                var biMask = new jsbn_3.BigInteger(hMask, 16);
                var biNeg = biMask.xor(bigIntegerValue).add(jsbn_3.BigInteger.ONE);
                h = biNeg.toString(16).replace(/^-/, '');
            }
            return h;
        };
        this.getPEMStringFromHex = function (dataHex, pemHeader) {
            return hextopem(dataHex, pemHeader);
        };
        this.newObject = function (param) {
            var _KJUR = exports.KJUR, _KJUR_asn1 = _KJUR.asn1, _DERBoolean = _KJUR_asn1.DERBoolean, _DERInteger = _KJUR_asn1.DERInteger, _DERBitString = _KJUR_asn1.DERBitString, _DEROctetString = _KJUR_asn1.DEROctetString, _DERNull = _KJUR_asn1.DERNull, _DERObjectIdentifier = _KJUR_asn1.DERObjectIdentifier, _DEREnumerated = _KJUR_asn1.DEREnumerated, _DERUTF8String = _KJUR_asn1.DERUTF8String, _DERNumericString = _KJUR_asn1.DERNumericString, _DERPrintableString = _KJUR_asn1.DERPrintableString, _DERTeletexString = _KJUR_asn1.DERTeletexString, _DERIA5String = _KJUR_asn1.DERIA5String, _DERUTCTime = _KJUR_asn1.DERUTCTime, _DERGeneralizedTime = _KJUR_asn1.DERGeneralizedTime, _DERSequence = _KJUR_asn1.DERSequence, _DERSet = _KJUR_asn1.DERSet, _DERTaggedObject = _KJUR_asn1.DERTaggedObject, _newObject = _KJUR_asn1.ASN1Util.newObject;
            var keys = Object.keys(param);
            if (keys.length != 1)
                throw "key of param shall be only one.";
            var key = keys[0];
            if (":bool:int:bitstr:octstr:null:oid:enum:utf8str:numstr:prnstr:telstr:ia5str:utctime:gentime:seq:set:tag:".indexOf(":" + key + ":") == -1)
                throw "undefined key: " + key;
            if (key == "bool")
                return new _DERBoolean(param[key]);
            if (key == "int")
                return new _DERInteger(param[key]);
            if (key == "bitstr")
                return new _DERBitString(param[key]);
            if (key == "octstr")
                return new _DEROctetString(param[key]);
            if (key == "null")
                return new _DERNull(param[key]);
            if (key == "oid")
                return new _DERObjectIdentifier(param[key]);
            if (key == "enum")
                return new _DEREnumerated(param[key]);
            if (key == "utf8str")
                return new _DERUTF8String(param[key]);
            if (key == "numstr")
                return new _DERNumericString(param[key]);
            if (key == "prnstr")
                return new _DERPrintableString(param[key]);
            if (key == "telstr")
                return new _DERTeletexString(param[key]);
            if (key == "ia5str")
                return new _DERIA5String(param[key]);
            if (key == "utctime")
                return new _DERUTCTime(param[key]);
            if (key == "gentime")
                return new _DERGeneralizedTime(param[key]);
            if (key == "seq") {
                var paramList = param[key];
                var a = [];
                for (var i = 0; i < paramList.length; i++) {
                    var asn1Obj = _newObject(paramList[i]);
                    a.push(asn1Obj);
                }
                return new _DERSequence({ 'array': a });
            }
            if (key == "set") {
                var paramList = param[key];
                var a = [];
                for (var i = 0; i < paramList.length; i++) {
                    var asn1Obj = _newObject(paramList[i]);
                    a.push(asn1Obj);
                }
                return new _DERSet({ 'array': a });
            }
            if (key == "tag") {
                var tagParam = param[key];
                if (Object.prototype.toString.call(tagParam) === '[object Array]' &&
                    tagParam.length == 3) {
                    var obj = _newObject(tagParam[2]);
                    return new _DERTaggedObject({ tag: tagParam[0],
                        explicit: tagParam[1],
                        obj: obj });
                }
                else {
                    var newParam = {};
                    if (tagParam.explicit !== undefined)
                        newParam.explicit = tagParam.explicit;
                    if (tagParam.tag !== undefined)
                        newParam.tag = tagParam.tag;
                    if (tagParam.obj === undefined)
                        throw "obj shall be specified for 'tag'.";
                    newParam.obj = _newObject(tagParam.obj);
                    return new _DERTaggedObject(newParam);
                }
            }
        };
        this.jsonToASN1HEX = function (param) {
            var asn1Obj = this.newObject(param);
            return asn1Obj.getEncodedHex();
        };
    };
    exports.KJUR.asn1.ASN1Util.oidHexToInt = function (hex) {
        var s = "";
        var i01 = parseInt(hex.substr(0, 2), 16);
        var i0 = Math.floor(i01 / 40);
        var i1 = i01 % 40;
        var s = i0 + "." + i1;
        var binbuf = "";
        for (var i = 2; i < hex.length; i += 2) {
            var value = parseInt(hex.substr(i, 2), 16);
            var bin = ("00000000" + value.toString(2)).slice(-8);
            binbuf = binbuf + bin.substr(1, 7);
            if (bin.substr(0, 1) == "0") {
                var bi = new jsbn_3.BigInteger(binbuf, 2);
                s = s + "." + bi.toString(10);
                binbuf = "";
            }
        }
        ;
        return s;
    };
    exports.KJUR.asn1.ASN1Util.oidIntToHex = function (oidString) {
        var itox = function (i) {
            var h = i.toString(16);
            if (h.length == 1)
                h = '0' + h;
            return h;
        };
        var roidtox = function (roid) {
            var h = '';
            var bi = new jsbn_3.BigInteger(roid, 10);
            var b = bi.toString(2);
            var padLen = 7 - b.length % 7;
            if (padLen == 7)
                padLen = 0;
            var bPad = '';
            for (var i = 0; i < padLen; i++)
                bPad += '0';
            b = bPad + b;
            for (var i = 0; i < b.length - 1; i += 7) {
                var b8 = b.substr(i, 7);
                if (i != b.length - 7)
                    b8 = '1' + b8;
                h += itox(parseInt(b8, 2));
            }
            return h;
        };
        if (!oidString.match(/^[0-9.]+$/)) {
            throw "malformed oid string: " + oidString;
        }
        var h = '';
        var a = oidString.split('.');
        var i0 = parseInt(a[0]) * 40 + parseInt(a[1]);
        h += itox(i0);
        a.splice(0, 2);
        for (var i = 0; i < a.length; i++) {
            h += roidtox(a[i]);
        }
        return h;
    };
    exports.KJUR.asn1.ASN1Object = function () {
        var isModified = true;
        var hTLV = null;
        var hT = '00';
        var hL = '00';
        var hV = '';
        this.getLengthHexFromValue = function () {
            if (typeof this.hV == "undefined" || this.hV == null) {
                throw "this.hV is null or undefined.";
            }
            if (this.hV.length % 2 == 1) {
                throw "value hex must be even length: n=" + hV.length + ",v=" + this.hV;
            }
            var n = this.hV.length / 2;
            var hN = n.toString(16);
            if (hN.length % 2 == 1) {
                hN = "0" + hN;
            }
            if (n < 128) {
                return hN;
            }
            else {
                var hNlen = hN.length / 2;
                if (hNlen > 15) {
                    throw "ASN.1 length too long to represent by 8x: n = " + n.toString(16);
                }
                var head = 128 + hNlen;
                return head.toString(16) + hN;
            }
        };
        this.getEncodedHex = function () {
            if (this.hTLV == null || this.isModified) {
                this.hV = this.getFreshValueHex();
                this.hL = this.getLengthHexFromValue();
                this.hTLV = this.hT + this.hL + this.hV;
                this.isModified = false;
            }
            return this.hTLV;
        };
        this.getValueHex = function () {
            this.getEncodedHex();
            return this.hV;
        };
        this.getFreshValueHex = function () {
            return '';
        };
    };
    exports.KJUR.asn1.DERAbstractString = function (params) {
        exports.KJUR.asn1.DERAbstractString.superclass.constructor.call(this);
        var s = null;
        var hV = null;
        this.getString = function () {
            return this.s;
        };
        this.setString = function (newS) {
            this.hTLV = null;
            this.isModified = true;
            this.s = newS;
            this.hV = stohex(this.s);
        };
        this.setStringHex = function (newHexString) {
            this.hTLV = null;
            this.isModified = true;
            this.s = null;
            this.hV = newHexString;
        };
        this.getFreshValueHex = function () {
            return this.hV;
        };
        if (typeof params != "undefined") {
            if (typeof params == "string") {
                this.setString(params);
            }
            else if (typeof params['str'] != "undefined") {
                this.setString(params['str']);
            }
            else if (typeof params['hex'] != "undefined") {
                this.setStringHex(params['hex']);
            }
        }
    };
    yahoo_1.YAHOO.lang.extend(exports.KJUR.asn1.DERAbstractString, exports.KJUR.asn1.ASN1Object);
    exports.KJUR.asn1.DERAbstractTime = function (params) {
        exports.KJUR.asn1.DERAbstractTime.superclass.constructor.call(this);
        var s = null;
        var date = null;
        this.localDateToUTC = function (d) {
            utc = d.getTime() + (d.getTimezoneOffset() * 60000);
            var utcDate = new Date(utc);
            return utcDate;
        };
        this.formatDate = function (dateObject, type, withMillis) {
            var pad = this.zeroPadding;
            var d = this.localDateToUTC(dateObject);
            var year = String(d.getFullYear());
            if (type == 'utc')
                year = year.substr(2, 2);
            var month = pad(String(d.getMonth() + 1), 2);
            var day = pad(String(d.getDate()), 2);
            var hour = pad(String(d.getHours()), 2);
            var min = pad(String(d.getMinutes()), 2);
            var sec = pad(String(d.getSeconds()), 2);
            var s = year + month + day + hour + min + sec;
            if (withMillis === true) {
                var millis = d.getMilliseconds();
                if (millis != 0) {
                    var sMillis = pad(String(millis), 3);
                    sMillis = sMillis.replace(/[0]+$/, "");
                    s = s + "." + sMillis;
                }
            }
            return s + "Z";
        };
        this.zeroPadding = function (s, len) {
            if (s.length >= len)
                return s;
            return new Array(len - s.length + 1).join('0') + s;
        };
        this.getString = function () {
            return this.s;
        };
        this.setString = function (newS) {
            this.hTLV = null;
            this.isModified = true;
            this.s = newS;
            this.hV = stohex(newS);
        };
        this.setByDateValue = function (year, month, day, hour, min, sec) {
            var dateObject = new Date(Date.UTC(year, month - 1, day, hour, min, sec, 0));
            this.setByDate(dateObject);
        };
        this.getFreshValueHex = function () {
            return this.hV;
        };
    };
    yahoo_1.YAHOO.lang.extend(exports.KJUR.asn1.DERAbstractTime, exports.KJUR.asn1.ASN1Object);
    exports.KJUR.asn1.DERAbstractStructured = function (params) {
        exports.KJUR.asn1.DERAbstractString.superclass.constructor.call(this);
        var asn1Array = null;
        this.setByASN1ObjectArray = function (asn1ObjectArray) {
            this.hTLV = null;
            this.isModified = true;
            this.asn1Array = asn1ObjectArray;
        };
        this.appendASN1Object = function (asn1Object) {
            this.hTLV = null;
            this.isModified = true;
            this.asn1Array.push(asn1Object);
        };
        this.asn1Array = new Array();
        if (typeof params != "undefined") {
            if (typeof params['array'] != "undefined") {
                this.asn1Array = params['array'];
            }
        }
    };
    yahoo_1.YAHOO.lang.extend(exports.KJUR.asn1.DERAbstractStructured, exports.KJUR.asn1.ASN1Object);
    exports.KJUR.asn1.DERBoolean = function () {
        exports.KJUR.asn1.DERBoolean.superclass.constructor.call(this);
        this.hT = "01";
        this.hTLV = "0101ff";
    };
    yahoo_1.YAHOO.lang.extend(exports.KJUR.asn1.DERBoolean, exports.KJUR.asn1.ASN1Object);
    exports.KJUR.asn1.DERInteger = function (params) {
        exports.KJUR.asn1.DERInteger.superclass.constructor.call(this);
        this.hT = "02";
        this.setByBigInteger = function (bigIntegerValue) {
            this.hTLV = null;
            this.isModified = true;
            this.hV = exports.KJUR.asn1.ASN1Util.bigIntToMinTwosComplementsHex(bigIntegerValue);
        };
        this.setByInteger = function (intValue) {
            var bi = new jsbn_3.BigInteger(String(intValue), 10);
            this.setByBigInteger(bi);
        };
        this.setValueHex = function (newHexString) {
            this.hV = newHexString;
        };
        this.getFreshValueHex = function () {
            return this.hV;
        };
        if (typeof params != "undefined") {
            if (typeof params['bigint'] != "undefined") {
                this.setByBigInteger(params['bigint']);
            }
            else if (typeof params['int'] != "undefined") {
                this.setByInteger(params['int']);
            }
            else if (typeof params == "number") {
                this.setByInteger(params);
            }
            else if (typeof params['hex'] != "undefined") {
                this.setValueHex(params['hex']);
            }
        }
    };
    yahoo_1.YAHOO.lang.extend(exports.KJUR.asn1.DERInteger, exports.KJUR.asn1.ASN1Object);
    exports.KJUR.asn1.DERBitString = function (params) {
        if (params !== undefined && typeof params.obj !== "undefined") {
            var o = exports.KJUR.asn1.ASN1Util.newObject(params.obj);
            params.hex = "00" + o.getEncodedHex();
        }
        exports.KJUR.asn1.DERBitString.superclass.constructor.call(this);
        this.hT = "03";
        this.setHexValueIncludingUnusedBits = function (newHexStringIncludingUnusedBits) {
            this.hTLV = null;
            this.isModified = true;
            this.hV = newHexStringIncludingUnusedBits;
        };
        this.setUnusedBitsAndHexValue = function (unusedBits, hValue) {
            if (unusedBits < 0 || 7 < unusedBits) {
                throw "unused bits shall be from 0 to 7: u = " + unusedBits;
            }
            var hUnusedBits = "0" + unusedBits;
            this.hTLV = null;
            this.isModified = true;
            this.hV = hUnusedBits + hValue;
        };
        this.setByBinaryString = function (binaryString) {
            binaryString = binaryString.replace(/0+$/, '');
            var unusedBits = 8 - binaryString.length % 8;
            if (unusedBits == 8)
                unusedBits = 0;
            for (var i = 0; i <= unusedBits; i++) {
                binaryString += '0';
            }
            var h = '';
            for (var i = 0; i < binaryString.length - 1; i += 8) {
                var b = binaryString.substr(i, 8);
                var x = parseInt(b, 2).toString(16);
                if (x.length == 1)
                    x = '0' + x;
                h += x;
            }
            this.hTLV = null;
            this.isModified = true;
            this.hV = '0' + unusedBits + h;
        };
        this.setByBooleanArray = function (booleanArray) {
            var s = '';
            for (var i = 0; i < booleanArray.length; i++) {
                if (booleanArray[i] == true) {
                    s += '1';
                }
                else {
                    s += '0';
                }
            }
            this.setByBinaryString(s);
        };
        this.newFalseArray = function (nLength) {
            var a = new Array(nLength);
            for (var i = 0; i < nLength; i++) {
                a[i] = false;
            }
            return a;
        };
        this.getFreshValueHex = function () {
            return this.hV;
        };
        if (typeof params != "undefined") {
            if (typeof params == "string" && params.toLowerCase().match(/^[0-9a-f]+$/)) {
                this.setHexValueIncludingUnusedBits(params);
            }
            else if (typeof params['hex'] != "undefined") {
                this.setHexValueIncludingUnusedBits(params['hex']);
            }
            else if (typeof params['bin'] != "undefined") {
                this.setByBinaryString(params['bin']);
            }
            else if (typeof params['array'] != "undefined") {
                this.setByBooleanArray(params['array']);
            }
        }
    };
    yahoo_1.YAHOO.lang.extend(exports.KJUR.asn1.DERBitString, exports.KJUR.asn1.ASN1Object);
    exports.KJUR.asn1.DEROctetString = function (params) {
        if (params !== undefined && typeof params.obj !== "undefined") {
            var o = exports.KJUR.asn1.ASN1Util.newObject(params.obj);
            params.hex = o.getEncodedHex();
        }
        exports.KJUR.asn1.DEROctetString.superclass.constructor.call(this, params);
        this.hT = "04";
    };
    yahoo_1.YAHOO.lang.extend(exports.KJUR.asn1.DEROctetString, exports.KJUR.asn1.DERAbstractString);
    exports.KJUR.asn1.DERNull = function () {
        exports.KJUR.asn1.DERNull.superclass.constructor.call(this);
        this.hT = "05";
        this.hTLV = "0500";
    };
    yahoo_1.YAHOO.lang.extend(exports.KJUR.asn1.DERNull, exports.KJUR.asn1.ASN1Object);
    exports.KJUR.asn1.DERObjectIdentifier = function (params) {
        var itox = function (i) {
            var h = i.toString(16);
            if (h.length == 1)
                h = '0' + h;
            return h;
        };
        var roidtox = function (roid) {
            var h = '';
            var bi = new jsbn_3.BigInteger(roid, 10);
            var b = bi.toString(2);
            var padLen = 7 - b.length % 7;
            if (padLen == 7)
                padLen = 0;
            var bPad = '';
            for (var i = 0; i < padLen; i++)
                bPad += '0';
            b = bPad + b;
            for (var i = 0; i < b.length - 1; i += 7) {
                var b8 = b.substr(i, 7);
                if (i != b.length - 7)
                    b8 = '1' + b8;
                h += itox(parseInt(b8, 2));
            }
            return h;
        };
        exports.KJUR.asn1.DERObjectIdentifier.superclass.constructor.call(this);
        this.hT = "06";
        this.setValueHex = function (newHexString) {
            this.hTLV = null;
            this.isModified = true;
            this.s = null;
            this.hV = newHexString;
        };
        this.setValueOidString = function (oidString) {
            if (!oidString.match(/^[0-9.]+$/)) {
                throw "malformed oid string: " + oidString;
            }
            var h = '';
            var a = oidString.split('.');
            var i0 = parseInt(a[0]) * 40 + parseInt(a[1]);
            h += itox(i0);
            a.splice(0, 2);
            for (var i = 0; i < a.length; i++) {
                h += roidtox(a[i]);
            }
            this.hTLV = null;
            this.isModified = true;
            this.s = null;
            this.hV = h;
        };
        this.setValueName = function (oidName) {
            var oid = exports.KJUR.asn1.x509.OID.name2oid(oidName);
            if (oid !== '') {
                this.setValueOidString(oid);
            }
            else {
                throw "DERObjectIdentifier oidName undefined: " + oidName;
            }
        };
        this.getFreshValueHex = function () {
            return this.hV;
        };
        if (params !== undefined) {
            if (typeof params === "string") {
                if (params.match(/^[0-2].[0-9.]+$/)) {
                    this.setValueOidString(params);
                }
                else {
                    this.setValueName(params);
                }
            }
            else if (params.oid !== undefined) {
                this.setValueOidString(params.oid);
            }
            else if (params.hex !== undefined) {
                this.setValueHex(params.hex);
            }
            else if (params.name !== undefined) {
                this.setValueName(params.name);
            }
        }
    };
    yahoo_1.YAHOO.lang.extend(exports.KJUR.asn1.DERObjectIdentifier, exports.KJUR.asn1.ASN1Object);
    exports.KJUR.asn1.DEREnumerated = function (params) {
        exports.KJUR.asn1.DEREnumerated.superclass.constructor.call(this);
        this.hT = "0a";
        this.setByBigInteger = function (bigIntegerValue) {
            this.hTLV = null;
            this.isModified = true;
            this.hV = exports.KJUR.asn1.ASN1Util.bigIntToMinTwosComplementsHex(bigIntegerValue);
        };
        this.setByInteger = function (intValue) {
            var bi = new jsbn_3.BigInteger(String(intValue), 10);
            this.setByBigInteger(bi);
        };
        this.setValueHex = function (newHexString) {
            this.hV = newHexString;
        };
        this.getFreshValueHex = function () {
            return this.hV;
        };
        if (typeof params != "undefined") {
            if (typeof params['int'] != "undefined") {
                this.setByInteger(params['int']);
            }
            else if (typeof params == "number") {
                this.setByInteger(params);
            }
            else if (typeof params['hex'] != "undefined") {
                this.setValueHex(params['hex']);
            }
        }
    };
    yahoo_1.YAHOO.lang.extend(exports.KJUR.asn1.DEREnumerated, exports.KJUR.asn1.ASN1Object);
    exports.KJUR.asn1.DERUTF8String = function (params) {
        exports.KJUR.asn1.DERUTF8String.superclass.constructor.call(this, params);
        this.hT = "0c";
    };
    yahoo_1.YAHOO.lang.extend(exports.KJUR.asn1.DERUTF8String, exports.KJUR.asn1.DERAbstractString);
    exports.KJUR.asn1.DERNumericString = function (params) {
        exports.KJUR.asn1.DERNumericString.superclass.constructor.call(this, params);
        this.hT = "12";
    };
    yahoo_1.YAHOO.lang.extend(exports.KJUR.asn1.DERNumericString, exports.KJUR.asn1.DERAbstractString);
    exports.KJUR.asn1.DERPrintableString = function (params) {
        exports.KJUR.asn1.DERPrintableString.superclass.constructor.call(this, params);
        this.hT = "13";
    };
    yahoo_1.YAHOO.lang.extend(exports.KJUR.asn1.DERPrintableString, exports.KJUR.asn1.DERAbstractString);
    exports.KJUR.asn1.DERTeletexString = function (params) {
        exports.KJUR.asn1.DERTeletexString.superclass.constructor.call(this, params);
        this.hT = "14";
    };
    yahoo_1.YAHOO.lang.extend(exports.KJUR.asn1.DERTeletexString, exports.KJUR.asn1.DERAbstractString);
    exports.KJUR.asn1.DERIA5String = function (params) {
        exports.KJUR.asn1.DERIA5String.superclass.constructor.call(this, params);
        this.hT = "16";
    };
    yahoo_1.YAHOO.lang.extend(exports.KJUR.asn1.DERIA5String, exports.KJUR.asn1.DERAbstractString);
    exports.KJUR.asn1.DERUTCTime = function (params) {
        exports.KJUR.asn1.DERUTCTime.superclass.constructor.call(this, params);
        this.hT = "17";
        this.setByDate = function (dateObject) {
            this.hTLV = null;
            this.isModified = true;
            this.date = dateObject;
            this.s = this.formatDate(this.date, 'utc');
            this.hV = stohex(this.s);
        };
        this.getFreshValueHex = function () {
            if (typeof this.date == "undefined" && typeof this.s == "undefined") {
                this.date = new Date();
                this.s = this.formatDate(this.date, 'utc');
                this.hV = stohex(this.s);
            }
            return this.hV;
        };
        if (params !== undefined) {
            if (params.str !== undefined) {
                this.setString(params.str);
            }
            else if (typeof params == "string" && params.match(/^[0-9]{12}Z$/)) {
                this.setString(params);
            }
            else if (params.hex !== undefined) {
                this.setStringHex(params.hex);
            }
            else if (params.date !== undefined) {
                this.setByDate(params.date);
            }
        }
    };
    yahoo_1.YAHOO.lang.extend(exports.KJUR.asn1.DERUTCTime, exports.KJUR.asn1.DERAbstractTime);
    exports.KJUR.asn1.DERGeneralizedTime = function (params) {
        exports.KJUR.asn1.DERGeneralizedTime.superclass.constructor.call(this, params);
        this.hT = "18";
        this.withMillis = false;
        this.setByDate = function (dateObject) {
            this.hTLV = null;
            this.isModified = true;
            this.date = dateObject;
            this.s = this.formatDate(this.date, 'gen', this.withMillis);
            this.hV = stohex(this.s);
        };
        this.getFreshValueHex = function () {
            if (this.date === undefined && this.s === undefined) {
                this.date = new Date();
                this.s = this.formatDate(this.date, 'gen', this.withMillis);
                this.hV = stohex(this.s);
            }
            return this.hV;
        };
        if (params !== undefined) {
            if (params.str !== undefined) {
                this.setString(params.str);
            }
            else if (typeof params == "string" && params.match(/^[0-9]{14}Z$/)) {
                this.setString(params);
            }
            else if (params.hex !== undefined) {
                this.setStringHex(params.hex);
            }
            else if (params.date !== undefined) {
                this.setByDate(params.date);
            }
            if (params.millis === true) {
                this.withMillis = true;
            }
        }
    };
    yahoo_1.YAHOO.lang.extend(exports.KJUR.asn1.DERGeneralizedTime, exports.KJUR.asn1.DERAbstractTime);
    exports.KJUR.asn1.DERSequence = function (params) {
        exports.KJUR.asn1.DERSequence.superclass.constructor.call(this, params);
        this.hT = "30";
        this.getFreshValueHex = function () {
            var h = '';
            for (var i = 0; i < this.asn1Array.length; i++) {
                var asn1Obj = this.asn1Array[i];
                h += asn1Obj.getEncodedHex();
            }
            this.hV = h;
            return this.hV;
        };
    };
    yahoo_1.YAHOO.lang.extend(exports.KJUR.asn1.DERSequence, exports.KJUR.asn1.DERAbstractStructured);
    exports.KJUR.asn1.DERSet = function (params) {
        exports.KJUR.asn1.DERSet.superclass.constructor.call(this, params);
        this.hT = "31";
        this.sortFlag = true;
        this.getFreshValueHex = function () {
            var a = new Array();
            for (var i = 0; i < this.asn1Array.length; i++) {
                var asn1Obj = this.asn1Array[i];
                a.push(asn1Obj.getEncodedHex());
            }
            if (this.sortFlag == true)
                a.sort();
            this.hV = a.join('');
            return this.hV;
        };
        if (typeof params != "undefined") {
            if (typeof params.sortflag != "undefined" &&
                params.sortflag == false)
                this.sortFlag = false;
        }
    };
    yahoo_1.YAHOO.lang.extend(exports.KJUR.asn1.DERSet, exports.KJUR.asn1.DERAbstractStructured);
    exports.KJUR.asn1.DERTaggedObject = function (params) {
        exports.KJUR.asn1.DERTaggedObject.superclass.constructor.call(this);
        this.hT = "a0";
        this.hV = '';
        this.isExplicit = true;
        this.asn1Object = null;
        this.setASN1Object = function (isExplicitFlag, tagNoHex, asn1Object) {
            this.hT = tagNoHex;
            this.isExplicit = isExplicitFlag;
            this.asn1Object = asn1Object;
            if (this.isExplicit) {
                this.hV = this.asn1Object.getEncodedHex();
                this.hTLV = null;
                this.isModified = true;
            }
            else {
                this.hV = null;
                this.hTLV = asn1Object.getEncodedHex();
                this.hTLV = this.hTLV.replace(/^../, tagNoHex);
                this.isModified = false;
            }
        };
        this.getFreshValueHex = function () {
            return this.hV;
        };
        if (typeof params != "undefined") {
            if (typeof params['tag'] != "undefined") {
                this.hT = params['tag'];
            }
            if (typeof params['explicit'] != "undefined") {
                this.isExplicit = params['explicit'];
            }
            if (typeof params['obj'] != "undefined") {
                this.asn1Object = params['obj'];
                this.setASN1Object(this.isExplicit, this.hT, this.asn1Object);
            }
        }
    };
    yahoo_1.YAHOO.lang.extend(exports.KJUR.asn1.DERTaggedObject, exports.KJUR.asn1.ASN1Object);
});
define("Look/API/Exceptions", ["require", "exports", "Look/API/Request"], function (require, exports, request_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BadRequestException = (function (_super) {
        __extends(BadRequestException, _super);
        function BadRequestException(params) {
            return _super.call(this, 404, 'API request not currect', params) || this;
        }
        return BadRequestException;
    }(request_1.ErrorRequestObject));
    exports.BadRequestException = BadRequestException;
    var BadClassOrMethodException = (function (_super) {
        __extends(BadClassOrMethodException, _super);
        function BadClassOrMethodException(params) {
            return _super.call(this, 404, 'bad class or method', params) || this;
        }
        return BadClassOrMethodException;
    }(request_1.ErrorRequestObject));
    exports.BadClassOrMethodException = BadClassOrMethodException;
});
//# sourceMappingURL=bundle.ts.js.map