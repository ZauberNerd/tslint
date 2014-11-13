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
        var documentRegistry = ts.createDocumentRegistry();
        var languageServiceHost = new Lint.LanguageServiceHost(syntaxTree, TypeScript.fullText(syntaxTree.sourceUnit()));
        var languageService = ts.createLanguageService(languageServiceHost, documentRegistry);
        return this.applyWithWalker(new NoUseBeforeDeclareWalker(syntaxTree, this.getOptions(), languageService));
    };
    Rule.FAILURE_STRING_PREFIX = "variable '";
    Rule.FAILURE_STRING_POSTFIX = "' used before declaration";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var NoUseBeforeDeclareWalker = (function (_super) {
    __extends(NoUseBeforeDeclareWalker, _super);
    function NoUseBeforeDeclareWalker(syntaxTree, options, languageService) {
        _super.call(this, syntaxTree, options);
        this.fileName = syntaxTree.fileName();
        this.languageService = languageService;
        this.classStartPosition = 0;
    }
    NoUseBeforeDeclareWalker.prototype.visitClassDeclaration = function (node) {
        this.classStartPosition = this.getPosition();
        _super.prototype.visitClassDeclaration.call(this, node);
        this.classStartPosition = 0;
    };
    NoUseBeforeDeclareWalker.prototype.visitImportDeclaration = function (node) {
        var position = this.positionAfter(node.importKeyword);
        this.validateUsageForVariable(node.identifier.text(), position);
        _super.prototype.visitImportDeclaration.call(this, node);
    };
    NoUseBeforeDeclareWalker.prototype.visitVariableDeclarator = function (node) {
        var position = this.getPosition() + node.propertyName.leadingTriviaWidth();
        this.validateUsageForVariable(node.propertyName.text(), position);
        _super.prototype.visitVariableDeclarator.call(this, node);
    };
    NoUseBeforeDeclareWalker.prototype.validateUsageForVariable = function (name, position) {
        var _this = this;
        var references = this.languageService.getReferencesAtPosition(this.fileName, position);
        if (references) {
            references.forEach(function (reference) {
                var referencePosition = reference.textSpan.start();
                if (_this.classStartPosition <= referencePosition && referencePosition < position) {
                    var failureString = Rule.FAILURE_STRING_PREFIX + name + Rule.FAILURE_STRING_POSTFIX;
                    var failure = _this.createFailure(referencePosition, name.length, failureString);
                    _this.addFailure(failure);
                }
            });
        }
    };
    return NoUseBeforeDeclareWalker;
})(Lint.RuleWalker);