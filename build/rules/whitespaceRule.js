var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var OPTION_BRANCH = "check-branch";
var OPTION_DECL = "check-decl";
var OPTION_OPERATOR = "check-operator";
var OPTION_SEPARATOR = "check-separator";
var OPTION_TYPE = "check-type";
var OPTION_TYPECAST = "check-typecast";
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (syntaxTree) {
        return this.applyWithWalker(new WhitespaceWalker(syntaxTree, this.getOptions()));
    };
    Rule.FAILURE_STRING = "missing whitespace";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var WhitespaceWalker = (function (_super) {
    __extends(WhitespaceWalker, _super);
    function WhitespaceWalker(syntaxTree, options) {
        _super.call(this, syntaxTree, options);
        this.lastPosition = TypeScript.fullWidth(this.getSyntaxTree().sourceUnit());
    }
    WhitespaceWalker.prototype.visitToken = function (token) {
        _super.prototype.visitToken.call(this, token);
        var kind = token.kind();
        if ((this.hasOption(OPTION_BRANCH) && this.isBranchKind(kind)) || (this.hasOption(OPTION_SEPARATOR) && this.isSeparatorKind(kind)) || (this.hasOption(OPTION_DECL) && kind === 107 /* EqualsToken */) || (this.hasOption(OPTION_TYPE) && kind === 106 /* ColonToken */)) {
            this.checkForLeadingSpace(this.getPosition(), token.trailingTrivia());
        }
    };
    WhitespaceWalker.prototype.visitBinaryExpression = function (node) {
        var operator = node.operatorToken;
        if (this.hasOption(OPTION_OPERATOR) && operator.kind() !== 79 /* CommaToken */) {
            var position = this.positionAfter(node.left);
            this.checkForLeadingSpace(position, TypeScript.trailingTrivia(node.left));
            position += operator.fullWidth();
            this.checkForLeadingSpace(position, operator.trailingTrivia());
        }
        _super.prototype.visitBinaryExpression.call(this, node);
    };
    WhitespaceWalker.prototype.visitSimpleArrowFunctionExpression = function (node) {
        var position = this.positionAfter(node.parameter);
        this.checkEqualsGreaterThan(node.equalsGreaterThanToken, node.parameter, position);
        _super.prototype.visitSimpleArrowFunctionExpression.call(this, node);
    };
    WhitespaceWalker.prototype.visitParenthesizedArrowFunctionExpression = function (node) {
        var position = this.positionAfter(node.callSignature);
        this.checkEqualsGreaterThan(node.equalsGreaterThanToken, node.callSignature, position);
        _super.prototype.visitParenthesizedArrowFunctionExpression.call(this, node);
    };
    WhitespaceWalker.prototype.visitConstructorType = function (node) {
        var position = this.positionAfter(node.newKeyword, node.typeParameterList, node.parameterList);
        this.checkEqualsGreaterThan(node.equalsGreaterThanToken, node.parameterList, position);
        _super.prototype.visitConstructorType.call(this, node);
    };
    WhitespaceWalker.prototype.visitFunctionType = function (node) {
        var position = this.positionAfter(node.typeParameterList, node.parameterList);
        this.checkEqualsGreaterThan(node.equalsGreaterThanToken, node.parameterList, position);
        _super.prototype.visitFunctionType.call(this, node);
    };
    WhitespaceWalker.prototype.checkEqualsGreaterThan = function (equalsGreaterThanToken, previousNode, position) {
        if (this.hasOption(OPTION_OPERATOR)) {
            this.checkForLeadingSpace(position, TypeScript.trailingTrivia(previousNode));
            position += equalsGreaterThanToken.fullWidth();
            this.checkForLeadingSpace(position, equalsGreaterThanToken.trailingTrivia());
        }
    };
    WhitespaceWalker.prototype.visitConditionalExpression = function (node) {
        if (this.hasOption(OPTION_OPERATOR)) {
            var position = this.positionAfter(node.condition);
            this.checkForLeadingSpace(position, TypeScript.trailingTrivia(node.condition));
            position += node.questionToken.fullWidth();
            this.checkForLeadingSpace(position, node.questionToken.trailingTrivia());
            position += TypeScript.fullWidth(node.whenTrue);
            this.checkForLeadingSpace(position, TypeScript.trailingTrivia(node.whenTrue));
        }
        _super.prototype.visitConditionalExpression.call(this, node);
    };
    WhitespaceWalker.prototype.visitVariableDeclarator = function (node) {
        var position = this.positionAfter(node.propertyName, node.typeAnnotation);
        if (this.hasOption(OPTION_DECL) && node.equalsValueClause !== null) {
            if (node.typeAnnotation !== null) {
                this.checkForLeadingSpace(position, TypeScript.trailingTrivia(node.typeAnnotation));
            }
            else {
                this.checkForLeadingSpace(position, node.propertyName.trailingTrivia());
            }
        }
        _super.prototype.visitVariableDeclarator.call(this, node);
    };
    WhitespaceWalker.prototype.visitImportDeclaration = function (node) {
        if (this.hasOption(OPTION_DECL)) {
            var position = this.positionAfter(node.importKeyword, node.identifier);
            this.checkForLeadingSpace(position, node.identifier.trailingTrivia());
        }
        _super.prototype.visitImportDeclaration.call(this, node);
    };
    WhitespaceWalker.prototype.visitExportAssignment = function (node) {
        if (this.hasOption(OPTION_DECL)) {
            var position = this.positionAfter(node.exportKeyword);
            this.checkForLeadingSpace(position, node.exportKeyword.trailingTrivia());
        }
        _super.prototype.visitExportAssignment.call(this, node);
    };
    WhitespaceWalker.prototype.visitCastExpression = function (node) {
        if (this.hasOption(OPTION_TYPECAST)) {
            var typeWidth = TypeScript.fullWidth(node.type);
            var position = this.getPosition() + node.lessThanToken.fullWidth() + typeWidth + node.greaterThanToken.fullWidth();
            this.checkForLeadingSpace(position, node.greaterThanToken.trailingTrivia());
        }
        _super.prototype.visitCastExpression.call(this, node);
    };
    WhitespaceWalker.prototype.isBranchKind = function (kind) {
        return (kind === 17 /* CatchKeyword */ || kind === 26 /* ForKeyword */ || kind === 28 /* IfKeyword */ || kind === 34 /* SwitchKeyword */ || kind === 42 /* WhileKeyword */ || kind === 43 /* WithKeyword */);
    };
    WhitespaceWalker.prototype.isSeparatorKind = function (kind) {
        return (kind === 79 /* CommaToken */ || kind === 78 /* SemicolonToken */);
    };
    WhitespaceWalker.prototype.checkForLeadingSpace = function (position, trivia) {
        var failure = null;
        if (position === this.lastPosition) {
            return;
        }
        if (trivia.count() < 1) {
            failure = this.createFailure(position, 1, Rule.FAILURE_STRING);
        }
        else {
            var kind = trivia.syntaxTriviaAt(0).kind();
            if (kind !== 4 /* WhitespaceTrivia */ && kind !== 5 /* NewLineTrivia */) {
                failure = this.createFailure(position, 1, Rule.FAILURE_STRING);
            }
        }
        if (failure) {
            this.addFailure(failure);
        }
    };
    return WhitespaceWalker;
})(Lint.RuleWalker);
