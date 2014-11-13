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
        return this.applyWithWalker((new NoAnyWalker(syntaxTree, this.getOptions())));
    };
    Rule.FAILURE_STRING = "type decoration of 'any' is forbidden";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var NoAnyWalker = (function (_super) {
    __extends(NoAnyWalker, _super);
    function NoAnyWalker() {
        _super.apply(this, arguments);
    }
    NoAnyWalker.prototype.visitToken = function (token) {
        this.handleToken(token);
        _super.prototype.visitToken.call(this, token);
    };
    NoAnyWalker.prototype.handleToken = function (token) {
        if (token.kind() === 60 /* AnyKeyword */) {
            var position = this.getPosition() + TypeScript.leadingTriviaWidth(token);
            this.addFailure(this.createFailure(position, TypeScript.width(token), Rule.FAILURE_STRING));
        }
    };
    return NoAnyWalker;
})(Lint.RuleWalker);
