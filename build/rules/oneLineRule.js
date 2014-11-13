var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var OPTION_BRACE = "check-open-brace";
var OPTION_CATCH = "check-catch";
var OPTION_ELSE = "check-else";
var OPTION_WHITESPACE = "check-whitespace";
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (syntaxTree) {
        var braceWalker = new BraceWalker(syntaxTree, this.getOptions());
        return this.applyWithWalker(braceWalker);
    };
    Rule.BRACE_FAILURE_STRING = "misplaced opening brace";
    Rule.CATCH_FAILURE_STRING = "misplaced 'catch'";
    Rule.ELSE_FAILURE_STRING = "misplaced 'else'";
    Rule.WHITESPACE_FAILURE_STRING = "missing whitespace";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var BraceWalker = (function (_super) {
    __extends(BraceWalker, _super);
    function BraceWalker() {
        _super.apply(this, arguments);
    }
    BraceWalker.prototype.visitToken = function (token) {
        var failure;
        var kind = token.kind();
        var lastState = this.getLastState();
        if (kind === 70 /* OpenBraceToken */ && lastState !== undefined) {
            var lastKind = lastState.token.kind();
            if (lastKind === 73 /* CloseParenToken */ || lastKind === 22 /* DoKeyword */ || lastKind === 23 /* ElseKeyword */ || lastKind === 11 /* IdentifierName */ || lastKind === 14 /* StringLiteral */ || lastKind === 38 /* TryKeyword */ || lastKind === 107 /* EqualsToken */) {
                var lastLine = this.getLine(lastState.position);
                var currentLine = this.getLine(this.getPosition());
                var position = this.getPosition() + TypeScript.leadingTriviaWidth(token);
                if (this.hasOption(OPTION_BRACE) && currentLine !== lastLine) {
                    failure = this.createFailure(position, TypeScript.width(token), Rule.BRACE_FAILURE_STRING);
                }
                else if (this.hasOption(OPTION_WHITESPACE) && !this.hasTrailingWhiteSpace(lastState.token)) {
                    failure = this.createFailure(position, TypeScript.width(token), Rule.WHITESPACE_FAILURE_STRING);
                }
            }
        }
        if (failure) {
            this.addFailure(failure);
        }
        _super.prototype.visitToken.call(this, token);
    };
    BraceWalker.prototype.visitElseClause = function (node) {
        var lastState = this.getLastState();
        var position = this.getPosition() + TypeScript.leadingTriviaWidth(node);
        if (this.hasOption(OPTION_ELSE) && lastState !== undefined && !this.hasTrailingWhiteSpace(lastState.token)) {
            var failure = this.createFailure(position, TypeScript.width(node.elseKeyword), Rule.ELSE_FAILURE_STRING);
            this.addFailure(failure);
        }
        _super.prototype.visitElseClause.call(this, node);
    };
    BraceWalker.prototype.visitCatchClause = function (node) {
        var lastState = this.getLastState();
        var position = this.getPosition() + TypeScript.leadingTriviaWidth(node);
        if (this.hasOption(OPTION_CATCH) && lastState !== undefined && !this.hasTrailingWhiteSpace(lastState.token)) {
            var failure = this.createFailure(position, TypeScript.width(node.catchKeyword), Rule.CATCH_FAILURE_STRING);
            this.addFailure(failure);
        }
        _super.prototype.visitCatchClause.call(this, node);
    };
    BraceWalker.prototype.getLine = function (position) {
        return this.getSyntaxTree().lineMap().getLineAndCharacterFromPosition(position).line();
    };
    BraceWalker.prototype.hasTrailingWhiteSpace = function (token) {
        var trivia = token.trailingTrivia();
        if (trivia.count() < 1) {
            return false;
        }
        var kind = trivia.syntaxTriviaAt(0).kind();
        return (kind === 4 /* WhitespaceTrivia */);
    };
    return BraceWalker;
})(Lint.StateAwareRuleWalker);
