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
        return this.applyWithWalker(new JsdocWalker(syntaxTree, this.getOptions()));
    };
    Rule.ALIGNMENT_FAILURE_STRING = "asterisks in jsdoc must be aligned";
    Rule.FORMAT_FAILURE_STRING = "jsdoc is not formatted correctly on this line";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var JsdocWalker = (function (_super) {
    __extends(JsdocWalker, _super);
    function JsdocWalker() {
        _super.apply(this, arguments);
    }
    JsdocWalker.prototype.visitToken = function (token) {
        var tokenWidth = TypeScript.width(token);
        this.findFailuresForTrivia(token.leadingTrivia().toArray(), this.getPosition());
        this.findFailuresForTrivia(token.trailingTrivia().toArray(), this.getPosition() + token.leadingTriviaWidth() + tokenWidth);
        _super.prototype.visitToken.call(this, token);
    };
    JsdocWalker.prototype.findFailuresForTrivia = function (triviaList, startingPosition) {
        var _this = this;
        var currentPosition = startingPosition;
        triviaList.forEach(function (triviaItem) {
            if (triviaItem.kind() === 6 /* MultiLineCommentTrivia */) {
                var commentText = triviaItem.fullText();
                var lines = commentText.split("\n");
                var jsdocPosition = currentPosition;
                var firstLine = lines[0];
                var isJsdocMatch = firstLine.match(/^\s*\/\*\*/);
                if (isJsdocMatch != null) {
                    var lineMap = _this.getSyntaxTree().lineMap();
                    if (lines.length === 1) {
                        var firstLineMatch = firstLine.match(/^\s*\/\*\* (.* )?\*\/$/);
                        if (firstLineMatch == null) {
                            _this.addFailureAt(jsdocPosition, firstLine.length, Rule.FORMAT_FAILURE_STRING);
                        }
                        currentPosition += triviaItem.fullWidth();
                        return;
                    }
                    var indexToMatch = firstLine.indexOf("**") + lineMap.getLineAndCharacterFromPosition(currentPosition).character();
                    var otherLines = lines.splice(1, lines.length - 2);
                    jsdocPosition += firstLine.length + 1;
                    otherLines.forEach(function (line) {
                        var asteriskMatch = line.match(/^\s*\*( |$)/);
                        if (asteriskMatch == null) {
                            _this.addFailureAt(jsdocPosition, line.length, Rule.FORMAT_FAILURE_STRING);
                        }
                        var asteriskIndex = line.indexOf("*");
                        if (asteriskIndex !== indexToMatch) {
                            _this.addFailureAt(jsdocPosition, line.length, Rule.ALIGNMENT_FAILURE_STRING);
                        }
                        jsdocPosition += line.length + 1;
                    });
                    var lastLine = lines[lines.length - 1];
                    var endBlockCommentMatch = lastLine.match(/^\s*\*\/$/);
                    if (endBlockCommentMatch == null) {
                        _this.addFailureAt(jsdocPosition, lastLine.length, Rule.FORMAT_FAILURE_STRING);
                    }
                    var lastAsteriskIndex = lastLine.indexOf("*");
                    if (lastAsteriskIndex !== indexToMatch) {
                        _this.addFailureAt(jsdocPosition, lastLine.length, Rule.ALIGNMENT_FAILURE_STRING);
                    }
                }
            }
            currentPosition += triviaItem.fullWidth();
        });
    };
    JsdocWalker.prototype.addFailureAt = function (currentPosition, width, failureString) {
        var failure = this.createFailure(currentPosition, width, failureString);
        this.addFailure(failure);
    };
    return JsdocWalker;
})(Lint.RuleWalker);
