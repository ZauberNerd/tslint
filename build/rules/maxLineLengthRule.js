var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.isEnabled = function () {
        if (_super.prototype.isEnabled.call(this)) {
            var option = this.getOptions().ruleArguments[0];
            if (typeof option === "number" && option > 0) {
                return true;
            }
        }
        return false;
    };
    Rule.prototype.apply = function (syntaxTree) {
        var ruleFailures = [];
        var lineLimit = this.getOptions().ruleArguments[0];
        var lineMap = syntaxTree.lineMap();
        var lineStarts = lineMap.lineStarts();
        var errorString = Rule.FAILURE_STRING + lineLimit;
        var disabledIntervals = this.getOptions().disabledIntervals;
        var source = TypeScript.fullText(syntaxTree.sourceUnit());
        for (var i = 0; i < lineStarts.length - 1; ++i) {
            var from = lineStarts[i], to = lineStarts[i + 1];
            if ((to - from - 1) > lineLimit && !((to - from - 2) === lineLimit && source[to - 2] === "\r")) {
                var ruleFailure = new Lint.RuleFailure(syntaxTree, from, to - 1, errorString, this.getOptions().ruleName);
                if (!Lint.doesIntersect(ruleFailure, disabledIntervals)) {
                    ruleFailures.push(ruleFailure);
                }
            }
        }
        return ruleFailures;
    };
    Rule.FAILURE_STRING = "exceeds maximum line length of ";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
