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
        return this.applyWithWalker(new UseStrictWalker(syntaxTree, this.getOptions()));
    };
    Rule.FAILURE_STRING = "missing 'use strict'";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var UseStrictWalker = (function (_super) {
    __extends(UseStrictWalker, _super);
    function UseStrictWalker() {
        _super.apply(this, arguments);
    }
    UseStrictWalker.prototype.createScope = function () {
        return {};
    };
    UseStrictWalker.prototype.visitModuleDeclaration = function (node) {
        var childCount = TypeScript.childCount(node.modifiers);
        if (this.getCurrentDepth() === 2 && !(childCount > 0 && TypeScript.childAt(node.modifiers, 0).kind() === 63 /* DeclareKeyword */)) {
            if (this.hasOption(UseStrictWalker.OPTION_CHECK_MODULE)) {
                this.checkUseStrict(node, node.moduleElements);
            }
        }
        _super.prototype.visitModuleDeclaration.call(this, node);
    };
    UseStrictWalker.prototype.visitFunctionDeclaration = function (node) {
        if (this.getCurrentDepth() === 2) {
            if (node.block && this.hasOption(UseStrictWalker.OPTION_CHECK_FUNCTION)) {
                this.checkUseStrict(node, node.block.statements);
            }
        }
        _super.prototype.visitFunctionDeclaration.call(this, node);
    };
    UseStrictWalker.prototype.checkUseStrict = function (node, syntaxList) {
        var isFailure = true;
        if (syntaxList.length > 0) {
            var firstStatement = syntaxList[0];
            if (firstStatement.kind() === 150 /* ExpressionStatement */ && TypeScript.childCount(firstStatement) === 2) {
                var firstChild = TypeScript.childAt(firstStatement, 0);
                var secondChild = TypeScript.childAt(firstStatement, 1);
                if (TypeScript.isToken(firstChild)) {
                    var firstToken = TypeScript.firstToken(firstChild);
                    if (TypeScript.tokenValueText(firstToken) === UseStrictWalker.USE_STRICT_STRING) {
                        if (secondChild.kind() === 78 /* SemicolonToken */) {
                            isFailure = false;
                        }
                    }
                }
            }
        }
        if (isFailure) {
            this.addUseStrictFailure(node);
        }
    };
    UseStrictWalker.prototype.addUseStrictFailure = function (node) {
        var position = this.getPosition() + TypeScript.leadingTriviaWidth(node);
        this.addFailure(this.createFailure(position, TypeScript.width(TypeScript.firstToken(node)), Rule.FAILURE_STRING));
    };
    UseStrictWalker.OPTION_CHECK_FUNCTION = "check-function";
    UseStrictWalker.OPTION_CHECK_MODULE = "check-module";
    UseStrictWalker.USE_STRICT_STRING = "use strict";
    return UseStrictWalker;
})(Lint.ScopeAwareRuleWalker);