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
        return this.applyWithWalker(new NoBitwiseWalker(syntaxTree, this.getOptions()));
    };
    Rule.FAILURE_STRING = "forbidden bitwise operation";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var NoBitwiseWalker = (function (_super) {
    __extends(NoBitwiseWalker, _super);
    function NoBitwiseWalker() {
        _super.apply(this, arguments);
    }
    NoBitwiseWalker.prototype.visitNode = function (node) {
        var kind = node.kind();
        if (kind === 192 /* BitwiseAndExpression */ || kind === 181 /* AndAssignmentExpression */ || kind === 190 /* BitwiseOrExpression */ || kind === 183 /* OrAssignmentExpression */ || kind === 191 /* BitwiseExclusiveOrExpression */ || kind === 182 /* ExclusiveOrAssignmentExpression */ || kind === 203 /* LeftShiftExpression */ || kind === 184 /* LeftShiftAssignmentExpression */ || kind === 204 /* SignedRightShiftExpression */ || kind === 185 /* SignedRightShiftAssignmentExpression */ || kind === 205 /* UnsignedRightShiftExpression */ || kind === 186 /* UnsignedRightShiftAssignmentExpression */ || kind === 167 /* BitwiseNotExpression */) {
            this.addFailure(this.createFailure(this.getPosition() + TypeScript.leadingTriviaWidth(node), TypeScript.width(node), Rule.FAILURE_STRING));
        }
        _super.prototype.visitNode.call(this, node);
    };
    return NoBitwiseWalker;
})(Lint.RuleWalker);
