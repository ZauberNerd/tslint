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
        return this.applyWithWalker(new NoStringLiteralWalker(syntaxTree, this.getOptions()));
    };
    Rule.FAILURE_STRING = "object access via string literals is disallowed";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var NoStringLiteralWalker = (function (_super) {
    __extends(NoStringLiteralWalker, _super);
    function NoStringLiteralWalker() {
        _super.apply(this, arguments);
    }
    NoStringLiteralWalker.prototype.visitElementAccessExpression = function (node) {
        this.handleElementAccessExpression(node);
        _super.prototype.visitElementAccessExpression.call(this, node);
    };
    NoStringLiteralWalker.prototype.handleElementAccessExpression = function (node) {
        var argument = node.argumentExpression;
        var id = TypeScript.fullText(argument);
        if (argument.kind() !== 14 /* StringLiteral */ || id.length < 2) {
            return;
        }
        var unquotedString = id.substring(1, id.length - 1);
        var simpleText = TypeScript.SimpleText.fromString(unquotedString);
        var isValidIdentifier = TypeScript.Scanner.isValidIdentifier(simpleText, 1 /* ES5 */);
        if (isValidIdentifier) {
            var position = this.positionAfter(node.expression, node.openBracketToken);
            this.addFailure(this.createFailure(position, TypeScript.width(argument), Rule.FAILURE_STRING));
        }
    };
    return NoStringLiteralWalker;
})(Lint.RuleWalker);