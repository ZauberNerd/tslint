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
        return this.applyWithWalker(new NameWalker(syntaxTree, this.getOptions()));
    };
    Rule.FAILURE_STRING = "name must be in pascal case";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var NameWalker = (function (_super) {
    __extends(NameWalker, _super);
    function NameWalker() {
        _super.apply(this, arguments);
    }
    NameWalker.prototype.visitClassDeclaration = function (node) {
        var className = node.identifier.text();
        if (!this.isPascalCased(className)) {
            var position = this.positionAfter(node.modifiers, node.classKeyword);
            this.addFailureAt(position, TypeScript.width(node.identifier));
        }
        _super.prototype.visitClassDeclaration.call(this, node);
    };
    NameWalker.prototype.visitInterfaceDeclaration = function (node) {
        var interfaceName = node.identifier.text();
        if (!this.isPascalCased(interfaceName)) {
            var position = this.positionAfter(node.modifiers, node.interfaceKeyword);
            this.addFailureAt(position, TypeScript.width(node.identifier));
        }
        _super.prototype.visitInterfaceDeclaration.call(this, node);
    };
    NameWalker.prototype.isPascalCased = function (name) {
        if (name.length <= 0) {
            return true;
        }
        var firstCharacter = name.charAt(0);
        return ((firstCharacter === firstCharacter.toUpperCase()) && name.indexOf("_") === -1);
    };
    NameWalker.prototype.addFailureAt = function (position, width) {
        var failure = this.createFailure(position, width, Rule.FAILURE_STRING);
        this.addFailure(failure);
    };
    return NameWalker;
})(Lint.RuleWalker);
