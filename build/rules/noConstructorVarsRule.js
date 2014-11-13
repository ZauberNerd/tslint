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
        return this.applyWithWalker(new NoConstructorVariableDeclarationsWalker(syntaxTree, this.getOptions()));
    };
    Rule.FAILURE_STRING_PART = " cannot be declared in the constructor";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var NoConstructorVariableDeclarationsWalker = (function (_super) {
    __extends(NoConstructorVariableDeclarationsWalker, _super);
    function NoConstructorVariableDeclarationsWalker() {
        _super.apply(this, arguments);
    }
    NoConstructorVariableDeclarationsWalker.prototype.visitConstructorDeclaration = function (node) {
        var parameterList = node.callSignature.parameterList;
        var position = this.positionAfter(node.modifiers, node.constructorKeyword, parameterList.openParenToken);
        var parameters = parameterList.parameters;
        for (var i = 0; i < TypeScript.childCount(parameters); i++) {
            var element = TypeScript.childAt(parameters, i);
            if (element.kind() !== 243 /* Parameter */) {
                position += TypeScript.fullWidth(element);
                continue;
            }
            var parameter = element;
            if (TypeScript.childCount(parameter.modifiers) > 0) {
                this.addFailure(this.createFailure(position, TypeScript.fullWidth(parameter.modifiers), "'" + parameter.identifier.text() + "'" + Rule.FAILURE_STRING_PART));
            }
            position += TypeScript.fullWidth(parameter);
        }
        _super.prototype.visitConstructorDeclaration.call(this, node);
    };
    return NoConstructorVariableDeclarationsWalker;
})(Lint.RuleWalker);
exports.NoConstructorVariableDeclarationsWalker = NoConstructorVariableDeclarationsWalker;
