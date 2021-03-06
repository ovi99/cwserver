"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Util = exports.generateRandomString = exports.getLibRoot = exports.assert = void 0;
const _fs = __importStar(require("fs"));
const _path = __importStar(require("path"));
const stream_1 = require("stream");
const destroy = require("destroy");
const sow_fsw_1 = require("./sow-fsw");
function _isPlainObject(obj) {
    if (obj === null || obj === undefined)
        return false;
    return typeof (obj) === 'object' && Object.prototype.toString.call(obj) === "[object Object]";
}
function _extend(destination, source) {
    if (!_isPlainObject(destination) || !_isPlainObject(source))
        throw new TypeError(`Invalid arguments defined. Arguments should be Object instance. destination type ${typeof (destination)} and source type ${typeof (source)}`);
    for (const property in source) {
        if (property === "__proto__" || property === "constructor")
            continue;
        if (!destination.hasOwnProperty(property)) {
            destination[property] = source[property];
        }
        else {
            destination[property] = source[property];
        }
    }
    return destination;
}
function _deepExtend(destination, source) {
    if (typeof (source) === "function")
        source = source();
    if (!_isPlainObject(destination) || !_isPlainObject(source))
        throw new TypeError(`Invalid arguments defined. Arguments should be Object instance. destination type ${typeof (destination)} and source type ${typeof (source)}`);
    for (const property in source) {
        if (property === "__proto__" || property === "constructor")
            continue;
        if (!destination.hasOwnProperty(property)) {
            destination[property] = void 0;
        }
        const s = source[property];
        const d = destination[property];
        if (_isPlainObject(d) && _isPlainObject(s)) {
            _deepExtend(d, s);
            continue;
        }
        destination[property] = source[property];
    }
    return destination;
}
function assert(condition, expr) {
    const condType = typeof (condition);
    if (condType === "string") {
        if (condition.length === 0)
            condition = false;
    }
    if (!condition)
        throw new Error(`Assertion failed: ${expr}`);
}
exports.assert = assert;
function getLibRoot() {
    return _path.resolve(__dirname, process.env.SCRIPT === "TS" ? '..' : '../..');
}
exports.getLibRoot = getLibRoot;
function generateRandomString(num) {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let result = "";
    for (let i = 0, n = charset.length; i < num; ++i) {
        result += charset.charAt(Math.floor(Math.random() * n));
    }
    return result;
}
exports.generateRandomString = generateRandomString;
class Util {
    static guid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    static extend(destination, source, deep) {
        if (deep === true)
            return _deepExtend(destination, source);
        return _extend(destination, source);
    }
    static clone(source) {
        return _extend({}, source);
    }
    /** Checks whether the specified value is an object. true if the value is an object; false otherwise. */
    static isPlainObject(obj) {
        return _isPlainObject(obj);
    }
    /** Checks whether the specified value is an array object. true if the value is an array object; false otherwise. */
    static isArrayLike(obj) {
        if (obj === null || obj === undefined)
            return false;
        const result = Object.prototype.toString.call(obj);
        return result === "[object NodeList]" || result === "[object Array]" ? true : false;
    }
    static isError(obj) {
        return obj === null || !obj ? false : Object.prototype.toString.call(obj) === "[object Error]";
    }
    static throwIfError(obj) {
        if (this.isError(obj))
            throw obj;
    }
    static pipeOutputStream(absPath, ctx) {
        return ctx.handleError(null, () => {
            const statusCode = ctx.res.statusCode;
            const openenedFile = _fs.createReadStream(absPath);
            return stream_1.pipeline(openenedFile, ctx.res, (err) => {
                destroy(openenedFile);
                ctx.next(statusCode);
            }), void 0;
        });
    }
    static sendResponse(ctx, reqPath, contentType) {
        return sow_fsw_1.isExists(reqPath, (exists, url) => {
            return ctx.handleError(null, () => {
                if (!exists)
                    return ctx.next(404, true);
                ctx.res.status(200, { 'Content-Type': contentType || 'text/html; charset=UTF-8' });
                return this.pipeOutputStream(url, ctx);
            });
        });
    }
    static getExtension(reqPath) {
        const index = reqPath.lastIndexOf(".");
        if (index > 0) {
            return reqPath.substring(index + 1).toLowerCase();
        }
        return void 0;
    }
}
exports.Util = Util;
//# sourceMappingURL=sow-util.js.map