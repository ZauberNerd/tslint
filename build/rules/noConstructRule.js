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
        return this.applyWithWalker(new NoConstructWalker(syntaxTree, this.getOptions()));
    };
    Rule.FAILURE_STRING = "undesirable constructor use";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var NoConstructWalker = (function (_super) {
    __extends(NoConstructWalker, _super);
    function NoConstructWalker() {
        _super.apply(this, arguments);
    }
    NoConstructWalker.prototype.visitObjectCreationExpression = function (node) {
        var constructorName = TypeScript.fullText(node.expression).trim();
        if (NoConstructWalker.FORBIDDEN_CONSTRUCTORS.indexOf(constructorName) !== -1) {
            var position = this.getPosition() + TypeScript.leadingTriviaWidth(node);
            var width = TypeScript.fullWidth(node.newKeyword) + TypeScript.fullWidth(node.expression);
            var failure = this.createFailure(position, width, Rule.FAILURE_STRING);
            this.addFailure(failure);
        }
        _super.prototype.visitObjectCreationExpression.call(this, node);
    };
    NoConstructWalker.FORBIDDEN_CONSTRUCTORS = [
        "Boolean",
        "Number",
        "String"
    ];
    return NoConstructWalker;
})(Lint.RuleWalker);
