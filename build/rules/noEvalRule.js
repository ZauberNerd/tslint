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
        return this.applyWithWalker(new NoEvalWalker(syntaxTree, this.getOptions()));
    };
    Rule.FAILURE_STRING = "forbidden eval";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var NoEvalWalker = (function (_super) {
    __extends(NoEvalWalker, _super);
    function NoEvalWalker() {
        _super.apply(this, arguments);
    }
    NoEvalWalker.prototype.visitInvocationExpression = function (node) {
        var expression = node.expression;
        if (TypeScript.isToken(expression) && expression.kind() === 11 /* IdentifierName */) {
            var firstToken = TypeScript.firstToken(expression);
            if (firstToken.text() === "eval") {
                var position = this.getPosition() + TypeScript.leadingTriviaWidth(node);
                this.addFailure(this.createFailure(position, TypeScript.width(firstToken), Rule.FAILURE_STRING));
            }
        }
        _super.prototype.visitInvocationExpression.call(this, node);
    };
    return NoEvalWalker;
})(Lint.RuleWalker);
