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
        return this.applyWithWalker(new NoTrailingCommaWalker(syntaxTree, this.getOptions()));
    };
    Rule.FAILURE_STRING = "trailing comma";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var NoTrailingCommaWalker = (function (_super) {
    __extends(NoTrailingCommaWalker, _super);
    function NoTrailingCommaWalker() {
        _super.apply(this, arguments);
    }
    NoTrailingCommaWalker.prototype.visitObjectLiteralExpression = function (node) {
        var propertyAssignments = node.propertyAssignments;
        var lastPosition = this.positionAfter(node.openBraceToken, propertyAssignments);
        lastPosition -= TypeScript.trailingTriviaWidth(propertyAssignments) + 1;
        if (propertyAssignments.separatorCount() === propertyAssignments.length && propertyAssignments.length > 0) {
            this.addFailure(this.createFailure(lastPosition, 1, Rule.FAILURE_STRING));
        }
        _super.prototype.visitObjectLiteralExpression.call(this, node);
    };
    return NoTrailingCommaWalker;
})(Lint.RuleWalker);