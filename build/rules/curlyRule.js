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
        return this.applyWithWalker(new CurlyWalker(syntaxTree, this.getOptions()));
    };
    Rule.DO_FAILURE_STRING = "do statements must be braced";
    Rule.ELSE_FAILURE_STRING = "else statements must be braced";
    Rule.FOR_FAILURE_STRING = "for statements must be braced";
    Rule.IF_FAILURE_STRING = "if statements must be braced";
    Rule.WHILE_FAILURE_STRING = "while statements must be braced";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var CurlyWalker = (function (_super) {
    __extends(CurlyWalker, _super);
    function CurlyWalker() {
        _super.apply(this, arguments);
    }
    CurlyWalker.prototype.visitForInStatement = function (node) {
        if (!this.isStatementBraced(node.statement)) {
            this.addFailureForNode(node, Rule.FOR_FAILURE_STRING);
        }
        _super.prototype.visitForInStatement.call(this, node);
    };
    CurlyWalker.prototype.visitForStatement = function (node) {
        if (!this.isStatementBraced(node.statement)) {
            this.addFailureForNode(node, Rule.FOR_FAILURE_STRING);
        }
        _super.prototype.visitForStatement.call(this, node);
    };
    CurlyWalker.prototype.visitIfStatement = function (node) {
        if (!this.isStatementBraced(node.statement)) {
            this.addFailureForNode(node, Rule.IF_FAILURE_STRING);
        }
        _super.prototype.visitIfStatement.call(this, node);
    };
    CurlyWalker.prototype.visitElseClause = function (node) {
        if (node.statement.kind() !== 148 /* IfStatement */ && !this.isStatementBraced(node.statement)) {
            this.addFailureForNode(node, Rule.ELSE_FAILURE_STRING);
        }
        _super.prototype.visitElseClause.call(this, node);
    };
    CurlyWalker.prototype.visitDoStatement = function (node) {
        if (!this.isStatementBraced(node.statement)) {
            this.addFailureForNode(node, Rule.DO_FAILURE_STRING);
        }
        _super.prototype.visitDoStatement.call(this, node);
    };
    CurlyWalker.prototype.visitWhileStatement = function (node) {
        if (!this.isStatementBraced(node.statement)) {
            this.addFailureForNode(node, Rule.WHILE_FAILURE_STRING);
        }
        _super.prototype.visitWhileStatement.call(this, node);
    };
    CurlyWalker.prototype.isStatementBraced = function (node) {
        var childCount = TypeScript.childCount(node);
        if (childCount === 3) {
            if (TypeScript.childAt(node, 0).kind() === TypeScript.SyntaxKind.FirstPunctuation && TypeScript.childAt(node, 1).kind() === 1 /* List */ && TypeScript.childAt(node, 2).kind() === 71 /* CloseBraceToken */) {
                return true;
            }
        }
        return false;
    };
    CurlyWalker.prototype.addFailureForNode = function (node, failure) {
        var leadingWidth = TypeScript.leadingTriviaWidth(node);
        var start = this.getPosition() + leadingWidth;
        var end = TypeScript.width(node);
        this.addFailure(this.createFailure(start, end, failure));
    };
    return CurlyWalker;
})(Lint.RuleWalker);
