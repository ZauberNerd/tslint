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
        return this.applyWithWalker(new UnusedExpressionWalker(syntaxTree, this.getOptions()));
    };
    Rule.FAILURE_STRING = "expected an assignment or function call";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var UnusedExpressionWalker = (function (_super) {
    __extends(UnusedExpressionWalker, _super);
    function UnusedExpressionWalker(syntaxTree, options) {
        _super.call(this, syntaxTree, options);
        this.expressionIsUnused = true;
    }
    UnusedExpressionWalker.prototype.visitExpressionStatement = function (node) {
        this.expressionIsUnused = true;
        var position = this.getPosition() + TypeScript.leadingTriviaWidth(node);
        _super.prototype.visitExpressionStatement.call(this, node);
        if (this.expressionIsUnused) {
            if (node.expression.kind() === 14 /* StringLiteral */) {
                var expressionText = node.expression.text();
                if (expressionText === "\"use strict\"" || expressionText === "'use strict'") {
                    return;
                }
            }
            else if (node.expression.kind() === 171 /* DeleteExpression */) {
                return;
            }
            this.addFailure(this.createFailure(position, TypeScript.width(node), Rule.FAILURE_STRING));
        }
    };
    UnusedExpressionWalker.prototype.visitBinaryExpression = function (node) {
        _super.prototype.visitBinaryExpression.call(this, node);
        switch (node.kind()) {
            case 175 /* AssignmentExpression */:
            case 176 /* AddAssignmentExpression */:
            case 177 /* SubtractAssignmentExpression */:
            case 178 /* MultiplyAssignmentExpression */:
            case 179 /* DivideAssignmentExpression */:
            case 180 /* ModuloAssignmentExpression */:
            case 181 /* AndAssignmentExpression */:
            case 182 /* ExclusiveOrAssignmentExpression */:
            case 183 /* OrAssignmentExpression */:
            case 184 /* LeftShiftAssignmentExpression */:
            case 185 /* SignedRightShiftAssignmentExpression */:
            case 186 /* UnsignedRightShiftAssignmentExpression */:
                this.expressionIsUnused = false;
                break;
            default:
                this.expressionIsUnused = true;
        }
    };
    UnusedExpressionWalker.prototype.visitPrefixUnaryExpression = function (node) {
        _super.prototype.visitPrefixUnaryExpression.call(this, node);
        switch (node.kind()) {
            case 169 /* PreIncrementExpression */:
            case 170 /* PreDecrementExpression */:
                this.expressionIsUnused = false;
                break;
            default:
                this.expressionIsUnused = true;
        }
    };
    UnusedExpressionWalker.prototype.visitPostfixUnaryExpression = function (node) {
        _super.prototype.visitPostfixUnaryExpression.call(this, node);
        this.expressionIsUnused = false;
    };
    UnusedExpressionWalker.prototype.visitBlock = function (node) {
        _super.prototype.visitBlock.call(this, node);
        this.expressionIsUnused = true;
    };
    UnusedExpressionWalker.prototype.visitSimpleArrowFunctionExpression = function (node) {
        _super.prototype.visitSimpleArrowFunctionExpression.call(this, node);
        this.expressionIsUnused = true;
    };
    UnusedExpressionWalker.prototype.visitParenthesizedArrowFunctionExpression = function (node) {
        _super.prototype.visitParenthesizedArrowFunctionExpression.call(this, node);
        this.expressionIsUnused = true;
    };
    UnusedExpressionWalker.prototype.visitInvocationExpression = function (node) {
        _super.prototype.visitInvocationExpression.call(this, node);
        this.expressionIsUnused = false;
    };
    UnusedExpressionWalker.prototype.visitConditionalExpression = function (node) {
        this.visitNodeOrToken(node.condition);
        this.expressionIsUnused = true;
        this.visitToken(node.questionToken);
        this.visitNodeOrToken(node.whenTrue);
        var firstExpressionIsUnused = this.expressionIsUnused;
        this.expressionIsUnused = true;
        this.visitToken(node.colonToken);
        this.visitNodeOrToken(node.whenFalse);
        var secondExpressionIsUnused = this.expressionIsUnused;
        this.expressionIsUnused = firstExpressionIsUnused || secondExpressionIsUnused;
    };
    return UnusedExpressionWalker;
})(Lint.RuleWalker);
