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
        return this.applyWithWalker(new NoArgWalker(syntaxTree, this.getOptions()));
    };
    Rule.FAILURE_STRING = "access forbidden to arguments property";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var NoArgWalker = (function (_super) {
    __extends(NoArgWalker, _super);
    function NoArgWalker() {
        _super.apply(this, arguments);
    }
    NoArgWalker.prototype.visitMemberAccessExpression = function (node) {
        var expression = node.expression;
        var name = node.name;
        var position = this.getPosition() + TypeScript.leadingTriviaWidth(node.expression);
        if (TypeScript.isToken(expression) && name.text() === "callee") {
            var tokenExpression = expression;
            if (tokenExpression.text() === "arguments") {
                this.addFailure(this.createFailure(position, TypeScript.width(expression), Rule.FAILURE_STRING));
            }
        }
        _super.prototype.visitMemberAccessExpression.call(this, node);
    };
    return NoArgWalker;
})(Lint.RuleWalker);