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
        return this.applyWithWalker(new EofWalker(syntaxTree, this.getOptions()));
    };
    Rule.FAILURE_STRING = "file should end with a newline";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var EofWalker = (function (_super) {
    __extends(EofWalker, _super);
    function EofWalker() {
        _super.apply(this, arguments);
    }
    EofWalker.prototype.visitToken = function (token) {
        this.handleToken(token);
        _super.prototype.visitToken.call(this, token);
    };
    EofWalker.prototype.handleToken = function (token) {
        var lastState = this.getLastState();
        if (lastState !== undefined && token.kind() === 10 /* EndOfFileToken */) {
            var endsWithNewLine = false;
            var previousToken = lastState.token;
            if (previousToken !== null && this.hasNewLineAtEnd(previousToken.trailingTrivia())) {
                endsWithNewLine = true;
            }
            if (token.hasLeadingTrivia() && !this.hasNewLineAtEnd(token.leadingTrivia())) {
                endsWithNewLine = false;
            }
            if (!endsWithNewLine) {
                this.addFailure(this.createFailure(this.getPosition(), 1, Rule.FAILURE_STRING));
            }
        }
    };
    EofWalker.prototype.hasNewLineAtEnd = function (triviaList) {
        if (triviaList.count() <= 0 || !triviaList.hasNewLine()) {
            return false;
        }
        return triviaList.last().isNewLine();
    };
    return EofWalker;
})(Lint.StateAwareRuleWalker);