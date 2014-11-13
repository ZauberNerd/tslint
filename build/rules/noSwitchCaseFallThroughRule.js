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
        return this.applyWithWalker(new NoSwitchCaseFallThroughWalker(syntaxTree, this.getOptions()));
    };
    Rule.FAILURE_STRING_PART = "Expected a 'break' before ";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var NoSwitchCaseFallThroughWalker = (function (_super) {
    __extends(NoSwitchCaseFallThroughWalker, _super);
    function NoSwitchCaseFallThroughWalker() {
        _super.apply(this, arguments);
    }
    NoSwitchCaseFallThroughWalker.prototype.visitSwitchStatement = function (node) {
        var isFallingThrough = false;
        var position = this.positionAfter(node.switchKeyword, node.openParenToken, node.expression, node.closeParenToken, node.openBraceToken);
        var switchClauses = node.switchClauses;
        for (var i = 0; i < switchClauses.length; i++) {
            var child = switchClauses[i];
            var kind = child.kind();
            var fullWidth = TypeScript.fullWidth(child);
            if (kind === 234 /* CaseSwitchClause */) {
                position += fullWidth;
                var switchClause = child;
                isFallingThrough = this.fallsThrough(switchClause.statements);
                if (isFallingThrough && switchClause.statements.length > 0 && ((switchClauses.length - 1) > i)) {
                    if (!this.fallThroughAllowed(switchClauses[i + 1])) {
                        this.addFailure(this.createFailure(position - TypeScript.trailingTriviaWidth(child), 1, Rule.FAILURE_STRING_PART + "'case'"));
                    }
                }
            }
            else {
                if (isFallingThrough && !this.fallThroughAllowed(child)) {
                    var failureString = Rule.FAILURE_STRING_PART + "'default'";
                    this.addFailure(this.createFailure(position - TypeScript.trailingTriviaWidth(child), 1, failureString));
                }
                position += fullWidth;
            }
        }
        _super.prototype.visitSwitchStatement.call(this, node);
    };
    NoSwitchCaseFallThroughWalker.prototype.fallThroughAllowed = function (nextCaseOrDefaultStatement) {
        var childCount = TypeScript.childCount(nextCaseOrDefaultStatement);
        var firstChild = TypeScript.childAt(nextCaseOrDefaultStatement, 0);
        var triviaList = childCount > 0 ? TypeScript.leadingTrivia(firstChild) : null;
        if (triviaList) {
            for (var i = 0; i < triviaList.count(); i++) {
                var trivia = triviaList.syntaxTriviaAt(i);
                if (trivia.isComment()) {
                    if (trivia.fullText() === "/* falls through */") {
                        return true;
                    }
                }
            }
        }
        return false;
    };
    NoSwitchCaseFallThroughWalker.prototype.fallsThrough = function (list) {
        for (var i = 0; i < list.length; i++) {
            var nodeKind = list[i].kind();
            if (nodeKind === 153 /* BreakStatement */ || nodeKind === 158 /* ThrowStatement */ || nodeKind === 151 /* ReturnStatement */) {
                return false;
            }
        }
        return true;
    };
    return NoSwitchCaseFallThroughWalker;
})(Lint.RuleWalker);
exports.NoSwitchCaseFallThroughWalker = NoSwitchCaseFallThroughWalker;
