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
        return this.applyWithWalker(new UnreachableWalker(syntaxTree, this.getOptions()));
    };
    Rule.FAILURE_STRING = "unreachable code";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var UnreachableWalker = (function (_super) {
    __extends(UnreachableWalker, _super);
    function UnreachableWalker(syntaxTree, options) {
        _super.call(this, syntaxTree, options);
        this.hasReturned = false;
    }
    UnreachableWalker.prototype.visitNode = function (node) {
        var previousReturned = this.hasReturned;
        if (node.kind() === 130 /* FunctionDeclaration */) {
            this.hasReturned = false;
        }
        if (this.hasReturned) {
            this.hasReturned = false;
            var position = this.getPosition() + TypeScript.leadingTriviaWidth(node);
            this.addFailure(this.createFailure(position, TypeScript.width(node), Rule.FAILURE_STRING));
        }
        _super.prototype.visitNode.call(this, node);
        if (node.kind() === 130 /* FunctionDeclaration */) {
            this.hasReturned = previousReturned;
        }
    };
    UnreachableWalker.prototype.visitBlock = function (node) {
        _super.prototype.visitBlock.call(this, node);
        this.hasReturned = false;
    };
    UnreachableWalker.prototype.visitCaseSwitchClause = function (node) {
        _super.prototype.visitCaseSwitchClause.call(this, node);
        this.hasReturned = false;
    };
    UnreachableWalker.prototype.visitDefaultSwitchClause = function (node) {
        _super.prototype.visitDefaultSwitchClause.call(this, node);
        this.hasReturned = false;
    };
    UnreachableWalker.prototype.visitIfStatement = function (node) {
        _super.prototype.visitIfStatement.call(this, node);
        this.hasReturned = false;
    };
    UnreachableWalker.prototype.visitElseClause = function (node) {
        _super.prototype.visitElseClause.call(this, node);
        this.hasReturned = false;
    };
    UnreachableWalker.prototype.visitOptionalNode = function (node) {
        if (node != null && node.kind() === 236 /* ElseClause */) {
            this.hasReturned = false;
        }
        _super.prototype.visitOptionalNode.call(this, node);
    };
    UnreachableWalker.prototype.visitBreakStatement = function (node) {
        _super.prototype.visitBreakStatement.call(this, node);
        this.hasReturned = true;
    };
    UnreachableWalker.prototype.visitContinueStatement = function (node) {
        _super.prototype.visitContinueStatement.call(this, node);
        this.hasReturned = true;
    };
    UnreachableWalker.prototype.visitReturnStatement = function (node) {
        _super.prototype.visitReturnStatement.call(this, node);
        this.hasReturned = true;
    };
    UnreachableWalker.prototype.visitThrowStatement = function (node) {
        _super.prototype.visitThrowStatement.call(this, node);
        this.hasReturned = true;
    };
    return UnreachableWalker;
})(Lint.RuleWalker);