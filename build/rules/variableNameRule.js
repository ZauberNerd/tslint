var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var OPTION_LEADING_UNDERSCORE = "allow-leading-underscore";
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (syntaxTree) {
        return this.applyWithWalker(new VariableNameWalker(syntaxTree, this.getOptions()));
    };
    Rule.FAILURE_STRING = "variable name must be in camelcase or uppercase";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var VariableNameWalker = (function (_super) {
    __extends(VariableNameWalker, _super);
    function VariableNameWalker() {
        _super.apply(this, arguments);
    }
    VariableNameWalker.prototype.visitVariableDeclarator = function (node) {
        var propertyName = node.propertyName;
        var variableName = propertyName.text();
        var position = this.getPosition() + propertyName.leadingTriviaWidth();
        if (!this.isCamelCase(variableName) && !this.isUpperCase(variableName)) {
            this.addFailure(this.createFailure(position, TypeScript.width(propertyName), Rule.FAILURE_STRING));
        }
        _super.prototype.visitVariableDeclarator.call(this, node);
    };
    VariableNameWalker.prototype.visitVariableStatement = function (node) {
        for (var i = 0; i < TypeScript.childCount(node.modifiers); i++) {
            if (TypeScript.childAt(node.modifiers, i).kind() === 63 /* DeclareKeyword */) {
                return;
            }
        }
        _super.prototype.visitVariableStatement.call(this, node);
    };
    VariableNameWalker.prototype.isCamelCase = function (name) {
        if (name.length <= 0) {
            return true;
        }
        var firstCharacter = name.charAt(0);
        var rest = name.substring(1);
        return (firstCharacter === firstCharacter.toLowerCase() && rest.indexOf("_") === -1 && (firstCharacter !== "_" || this.hasOption(OPTION_LEADING_UNDERSCORE)));
    };
    VariableNameWalker.prototype.isUpperCase = function (name) {
        return (name === name.toUpperCase());
    };
    return VariableNameWalker;
})(Lint.RuleWalker);