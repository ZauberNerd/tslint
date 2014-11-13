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
        return this.applyWithWalker(new RadixWalker(syntaxTree, this.getOptions()));
    };
    Rule.FAILURE_STRING = "missing radix parameter";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var RadixWalker = (function (_super) {
    __extends(RadixWalker, _super);
    function RadixWalker() {
        _super.apply(this, arguments);
    }
    RadixWalker.prototype.visitInvocationExpression = function (node) {
        var expression = node.expression;
        if (TypeScript.isToken(expression) && expression.kind() === 11 /* IdentifierName */) {
            var firstToken = TypeScript.firstToken(expression);
            var arguments = node.argumentList.arguments;
            if (firstToken.text() === "parseInt" && arguments.length < 2) {
                var position = this.getPosition() + TypeScript.leadingTriviaWidth(node);
                this.addFailure(this.createFailure(position, TypeScript.width(node), Rule.FAILURE_STRING));
            }
        }
        _super.prototype.visitInvocationExpression.call(this, node);
    };
    return RadixWalker;
})(Lint.RuleWalker);
