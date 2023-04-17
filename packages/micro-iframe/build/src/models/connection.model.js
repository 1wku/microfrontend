"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connection = void 0;
var Connection = /** @class */ (function () {
    function Connection(origin) {
        console.log(window);
        this._origin = origin;
    }
    /**
     * @description Gửi tin nhắn cho cha từ iframe con
     * @param data - Data muốn gửi đi
     * @param fn - Callback được gọi khi có trả lời
     */
    Connection.prototype.sendMessage = function (data, fn) { };
    Connection.prototype.addListener = function (fn) { };
    return Connection;
}());
exports.Connection = Connection;
