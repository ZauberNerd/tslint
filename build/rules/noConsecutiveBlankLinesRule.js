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
    Rule.prototype.apply = function (syntaxTree) {
        return this.applyWithWalker(new BlankLinesWalker(syntaxTree, this.getOptions()));
    };
    Rule.FAILURE_STRING = "consecutive blank lines are disallowed";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var BlankLinesWalker = (function (_super) {
    __extends(BlankLinesWalker, _super);
    function BlankLinesWalker() {
        _super.apply(this, arguments);
        this.newLinesInARowSeenSoFar = 1;
    }
    BlankLinesWalker.prototype.visitToken = function (token) {
        this.findConsecutiveBlankLinesFromTriva(token.leadingTrivia().toArray(), this.getPosition());
        this.newLinesInARowSeenSoFar = 0;
        this.findConsecutiveBlankLinesFromTriva(token.trailingTrivia().toArray(), this.getPosition() + TypeScript.leadingTriviaWidth(token) + TypeScript.width(token));
        _super.prototype.visitToken.call(this, token);
    };
    BlankLinesWalker.prototype.findConsecutiveBlankLinesFromTriva = function (triviaList, currentPosition) {
        var _this = this;
        triviaList.forEach(function (triviaItem) {
            if (triviaItem.isNewLine()) {
                _this.newLinesInARowSeenSoFar += 1;
                if (_this.newLinesInARowSeenSoFar >= 3) {
                    var failure = _this.createFailure(currentPosition, 1, Rule.FAILURE_STRING);
                    _this.addFailure(failure);
                }
            }
            else {
                _this.newLinesInARowSeenSoFar = 0;
            }
            currentPosition += triviaItem.fullWidth();
        });
    };
    return BlankLinesWalker;
})(Lint.RuleWalker);
