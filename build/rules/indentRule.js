var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var OPTION_USE_TABS = "tabs";
var OPTION_USE_SPACES = "spaces";
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (syntaxTree) {
        return this.applyWithWalker(new IndentWalker(syntaxTree, this.getOptions()));
    };
    Rule.FAILURE_STRING_TABS = "tab indentation expected";
    Rule.FAILURE_STRING_SPACES = "space indentation expected";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var IndentWalker = (function (_super) {
    __extends(IndentWalker, _super);
    function IndentWalker(syntaxTree, options) {
        _super.call(this, syntaxTree, options);
        if (this.hasOption(OPTION_USE_TABS)) {
            this.regExp = new RegExp(" ");
            this.failureString = Rule.FAILURE_STRING_TABS;
        }
        else if (this.hasOption(OPTION_USE_SPACES)) {
            this.regExp = new RegExp("\t");
            this.failureString = Rule.FAILURE_STRING_SPACES;
        }
    }
    IndentWalker.prototype.visitToken = function (token) {
        if (this.hasOption(OPTION_USE_TABS) || this.hasOption(OPTION_USE_SPACES)) {
            var position = this.getPosition() + token.leadingTriviaWidth();
            if (!token.hasLeadingComment() && token.leadingTrivia().fullText().match(this.regExp)) {
                this.addFailure(this.createFailure(position, token.fullWidth(), this.failureString));
            }
        }
        _super.prototype.visitToken.call(this, token);
    };
    return IndentWalker;
})(Lint.RuleWalker);
