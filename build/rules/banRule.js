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
        var options = this.getOptions();
        var banFunctionWalker = new BanFunctionWalker(syntaxTree, options);
        var functionsToBan = options.ruleArguments;
        functionsToBan.forEach(function (functionToBan) {
            banFunctionWalker.addBannedFunction(functionToBan);
        });
        return this.applyWithWalker(banFunctionWalker);
    };
    Rule.FAILURE_STRING_PART = "function invocation disallowed: ";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var BanFunctionWalker = (function (_super) {
    __extends(BanFunctionWalker, _super);
    function BanFunctionWalker() {
        _super.apply(this, arguments);
        this.bannedFunctions = [];
    }
    BanFunctionWalker.prototype.addBannedFunction = function (bannedFunction) {
        this.bannedFunctions.push(bannedFunction);
    };
    BanFunctionWalker.prototype.visitInvocationExpression = function (node) {
        var _this = this;
        var expression = node.expression;
        if (expression.kind() === 213 /* MemberAccessExpression */ && TypeScript.childCount(expression) >= 3) {
            var firstToken = TypeScript.firstToken(expression);
            var secondToken = TypeScript.childAt(expression, 1);
            var thirdToken = TypeScript.childAt(expression, 2);
            var firstText = firstToken.text();
            var thirdText = TypeScript.fullText(thirdToken);
            if (secondToken.kind() === 76 /* DotToken */) {
                this.bannedFunctions.forEach(function (bannedFunction) {
                    if (firstText === bannedFunction[0] && thirdText === bannedFunction[1]) {
                        var position = _this.getPosition() + TypeScript.leadingTriviaWidth(node);
                        var failure = _this.createFailure(position, TypeScript.width(expression), Rule.FAILURE_STRING_PART + firstText + "." + thirdText);
                        _this.addFailure(failure);
                    }
                });
            }
        }
        _super.prototype.visitInvocationExpression.call(this, node);
    };
    return BanFunctionWalker;
})(Lint.RuleWalker);
exports.BanFunctionWalker = BanFunctionWalker;
