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
        var output = "<pmd version=\"tslint\">";
        for (var i = 0; i < failures.length; ++i) {
            var failure = failures[i];
            var fileName = failure.getFileName();
            var failureString = failure.getFailure().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\'/g, "&#39;").replace(/\"/g, "&quot;");
            var lineAndCharacter = failure.getStartPosition().getLineAndCharacter();
            var line = lineAndCharacter.line() + 1;
            var character = lineAndCharacter.character() + 1;
            output += "<file name=\"" + fileName;
            output += "\"><violation begincolumn=\"" + character;
            output += "\" beginline=\"" + line;
            output += "\" priority=\"1\"";
            output += " rule=\"" + failureString + "\"> </violation></file>";
        }
        output += "</pmd>";
        return output;
    };
    return Formatter;
})(Lint.Formatters.AbstractFormatter);
exports.Formatter = Formatter;
