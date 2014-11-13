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
        return this.applyWithWalker(new LabelPosWalker(syntaxTree, this.getOptions()));
    };
    Rule.FAILURE_STRING = "unexpected label on statement";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var LabelPosWalker = (function (_super) {
    __extends(LabelPosWalker, _super);
    function LabelPosWalker() {
        _super.apply(this, arguments);
    }
    LabelPosWalker.prototype.visitLabeledStatement = function (node) {
        var width = TypeScript.width(node.identifier);
        var position = this.getPosition() + TypeScript.leadingTriviaWidth(node);
        this.isValidLabel = false;
        _super.prototype.visitLabeledStatement.call(this, node);
        if (!this.isValidLabel) {
            var failure = this.createFailure(position, width, Rule.FAILURE_STRING);
            this.addFailure(failure);
        }
    };
    LabelPosWalker.prototype.visitDoStatement = function (node) {
        this.isValidLabel = true;
        _super.prototype.visitDoStatement.call(this, node);
    };
    LabelPosWalker.prototype.visitForStatement = function (node) {
        this.isValidLabel = true;
        _super.prototype.visitForStatement.call(this, node);
    };
    LabelPosWalker.prototype.visitForInStatement = function (node) {
        this.isValidLabel = true;
        _super.prototype.visitForInStatement.call(this, node);
    };
    LabelPosWalker.prototype.visitWhileStatement = function (node) {
        this.isValidLabel = true;
        _super.prototype.visitWhileStatement.call(this, node);
    };
    LabelPosWalker.prototype.visitSwitchStatement = function (node) {
        this.isValidLabel = true;
        _super.prototype.visitSwitchStatement.call(this, node);
    };
    return LabelPosWalker;
})(Lint.RuleWalker);