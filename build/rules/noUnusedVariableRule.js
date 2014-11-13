var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var OPTION_CHECK_PARAMETERS = "check-parameters";
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (syntaxTree) {
        var documentRegistry = ts.createDocumentRegistry();
        var languageServiceHost = new Lint.LanguageServiceHost(syntaxTree, TypeScript.fullText(syntaxTree.sourceUnit()));
        var languageService = ts.createLanguageService(languageServiceHost, documentRegistry);
        return this.applyWithWalker(new NoUnusedVariablesWalker(syntaxTree, this.getOptions(), languageService));
    };
    Rule.FAILURE_STRING = "unused variable: ";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var NoUnusedVariablesWalker = (function (_super) {
    __extends(NoUnusedVariablesWalker, _super);
    function NoUnusedVariablesWalker(syntaxTree, options, languageService) {
        _super.call(this, syntaxTree, options);
        this.fileName = syntaxTree.fileName();
        this.skipVariableDeclaration = false;
        this.skipParameterDeclaration = false;
        this.languageService = languageService;
    }
    NoUnusedVariablesWalker.prototype.visitImportDeclaration = function (node) {
        if (!this.hasModifier(node.modifiers, 47 /* ExportKeyword */)) {
            var position = this.positionAfter(node.importKeyword);
            this.validateReferencesForVariable(node.identifier.text(), position);
        }
        _super.prototype.visitImportDeclaration.call(this, node);
    };
    NoUnusedVariablesWalker.prototype.visitVariableDeclarator = function (node) {
        var propertyName = node.propertyName, variableName = propertyName.text(), position = this.getPosition() + propertyName.leadingTriviaWidth();
        if (!this.skipVariableDeclaration) {
            this.validateReferencesForVariable(variableName, position);
        }
        _super.prototype.visitVariableDeclarator.call(this, node);
    };
    NoUnusedVariablesWalker.prototype.visitMethodSignature = function (node) {
        this.skipParameterDeclaration = true;
        _super.prototype.visitMethodSignature.call(this, node);
        this.skipParameterDeclaration = false;
    };
    NoUnusedVariablesWalker.prototype.visitIndexSignature = function (node) {
        this.skipParameterDeclaration = true;
        _super.prototype.visitIndexSignature.call(this, node);
        this.skipParameterDeclaration = false;
    };
    NoUnusedVariablesWalker.prototype.visitVariableStatement = function (node) {
        if (this.hasModifier(node.modifiers, 47 /* ExportKeyword */)) {
            this.skipVariableDeclaration = true;
        }
        _super.prototype.visitVariableStatement.call(this, node);
        this.skipVariableDeclaration = false;
    };
    NoUnusedVariablesWalker.prototype.visitFunctionDeclaration = function (node) {
        var variableName = node.identifier.text();
        var position = this.positionAfter(node.modifiers, node.functionKeyword);
        if (!this.hasModifier(node.modifiers, 47 /* ExportKeyword */)) {
            this.validateReferencesForVariable(variableName, position);
        }
        _super.prototype.visitFunctionDeclaration.call(this, node);
    };
    NoUnusedVariablesWalker.prototype.visitParameter = function (node) {
        var variableName = node.identifier.text();
        var position = this.positionAfter(node.dotDotDotToken, node.modifiers) + TypeScript.leadingTriviaWidth(node);
        if (!this.hasModifier(node.modifiers, 57 /* PublicKeyword */) && !this.skipParameterDeclaration && this.hasOption(OPTION_CHECK_PARAMETERS)) {
            this.validateReferencesForVariable(variableName, position);
        }
        _super.prototype.visitParameter.call(this, node);
    };
    NoUnusedVariablesWalker.prototype.visitMemberVariableDeclaration = function (node) {
        var modifiers = node.modifiers;
        if (!this.hasModifier(modifiers, 55 /* PrivateKeyword */)) {
            this.skipVariableDeclaration = true;
        }
        _super.prototype.visitMemberVariableDeclaration.call(this, node);
        this.skipVariableDeclaration = false;
    };
    NoUnusedVariablesWalker.prototype.visitMemberFunctionDeclaration = function (node) {
        var modifiers = node.modifiers;
        var variableName = node.propertyName.text();
        var position = this.positionAfter(node.modifiers);
        if (this.hasModifier(modifiers, 55 /* PrivateKeyword */)) {
            this.validateReferencesForVariable(variableName, position);
        }
        _super.prototype.visitMemberFunctionDeclaration.call(this, node);
    };
    NoUnusedVariablesWalker.prototype.hasModifier = function (modifiers, modifierKind) {
        for (var i = 0, n = modifiers.length; i < n; i++) {
            var modifier = modifiers[i];
            if (modifier.kind() === modifierKind) {
                return true;
            }
        }
        return false;
    };
    NoUnusedVariablesWalker.prototype.validateReferencesForVariable = function (name, position) {
        var references = this.languageService.getReferencesAtPosition(this.fileName, position);
        if (references.length <= 1) {
            var failureString = Rule.FAILURE_STRING + "'" + name + "'";
            var failure = this.createFailure(position, name.length, failureString);
            this.addFailure(failure);
        }
    };
    return NoUnusedVariablesWalker;
})(Lint.RuleWalker);