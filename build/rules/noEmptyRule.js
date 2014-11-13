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
        return this.applyWithWalker(new BlockWalker(syntaxTree, this.getOptions()));
    };
    Rule.FAILURE_STRING = "block is empty";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var BlockWalker = (function (_super) {
    __extends(BlockWalker, _super);
    function BlockWalker() {
        _super.apply(this, arguments);
        this.ignoredBlocks = [];
    }
    BlockWalker.prototype.visitBlock = function (node) {
        var hasCommentAfter = node.openBraceToken.trailingTrivia().hasComment();
        var hasCommentBefore = node.closeBraceToken.leadingTrivia().hasComment();
        var isSkipped = this.ignoredBlocks.indexOf(node) !== -1;
        if (TypeScript.childCount(node.statements) <= 0 && !hasCommentAfter && !hasCommentBefore && !isSkipped) {
            var position = this.getPosition() + TypeScript.leadingTriviaWidth(node);
            var width = TypeScript.width(node);
            this.addFailure(this.createFailure(position, width, Rule.FAILURE_STRING));
        }
        _super.prototype.visitBlock.call(this, node);
    };
    BlockWalker.prototype.visitConstructorDeclaration = function (node) {
        var isSkipped = false;
        var parameters = node.callSignature.parameterList.parameters;
        for (var i = 0; i < parameters.length; i++) {
            var param = parameters[i];
            for (var j = 0; j < TypeScript.childCount(param.modifiers); j++) {
                var modifier = TypeScript.childAt(param.modifiers, j).kind();
                if (modifier === 57 /* PublicKeyword */ || modifier === 55 /* PrivateKeyword */) {
                    isSkipped = true;
                    this.ignoredBlocks.push(node.block);
                    break;
                }
            }
            if (isSkipped) {
                break;
            }
        }
        _super.prototype.visitConstructorDeclaration.call(this, node);
    };
    return BlockWalker;
})(Lint.RuleWalker);
