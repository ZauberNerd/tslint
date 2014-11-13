var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Formatter = (function (_super) {
    __extends(Formatter, _super);
    function Formatter() {
        _super.apply(this, arguments);
    }
    Formatter.prototype.format = function (failures) {
        var failuresJSON = [];
        for (var i = 0; i < failures.length; ++i) {
            failuresJSON.push(failures[i].toJson());
        }
        return JSON.stringify(failuresJSON);
    };
    return Formatter;
})(Lint.Formatters.AbstractFormatter);
exports.Formatter = Formatter;
