var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var OPTION_SPACE = "check-space";
var OPTION_LOWERCASE = "check-lowercase";
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (syntaxTree) {
        return this.applyWithWalker(new CommentWalker(syntaxTree, this.getOptions()));
    };
    Rule.LOWERCASE_FAILURE = "comment must start with lowercase letter";
    Rule.LEADING_SPACE_FAILURE = "comment must start with a space";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var CommentWalker = (function (_super) {
    __extends(CommentWalker, _super);
    function CommentWalker() {
        _super.apply(this, arguments);
    }
    CommentWalker.prototype.visitToken = function (token) {
        var tokenWidth = TypeScript.width(token);
        this.findFailuresForTrivia(token.leadingTrivia().toArray(), this.getPosition());
        this.findFailuresForTrivia(token.trailingTrivia().toArray(), this.getPosition() + token.leadingTriviaWidth() + tokenWidth);
        _super.prototype.visitToken.call(this, token);
    };
    CommentWalker.prototype.findFailuresForTrivia = function (triviaList, startingPosition) {
        var _this = this;
        var currentPosition = startingPosition;
        triviaList.forEach(function (triviaItem) {
            if (triviaItem.kind() === 7 /* SingleLineCommentTrivia */) {
                var commentText = triviaItem.fullText();
                var startPosition = currentPosition + 2;
                var endPosition = triviaItem.fullWidth() - 2;
                if (_this.hasOption(OPTION_SPACE)) {
                    if (!_this.startsWithSpace(commentText)) {
                        var leadingSpaceFailure = _this.createFailure(startPosition, endPosition, Rule.LEADING_SPACE_FAILURE);
                        _this.addFailure(leadingSpaceFailure);
                    }
                }
                if (_this.hasOption(OPTION_LOWERCASE)) {
                    if (!_this.startsWithLowercase(commentText)) {
                        var lowercaseFailure = _this.createFailure(startPosition, endPosition, Rule.LOWERCASE_FAILURE);
                        _this.addFailure(lowercaseFailure);
                    }
                }
            }
            currentPosition += triviaItem.fullWidth();
        });
    };
    CommentWalker.prototype.startsWithSpace = function (commentText) {
        if (commentText.length <= 2) {
            return true;
        }
        if ((/^#(end)?region/).test(commentText.substring(2))) {
            return true;
        }
        var firstCharacter = commentText.charAt(2);
        return firstCharacter === " " || firstCharacter === "/";
    };
    CommentWalker.prototype.startsWithLowercase = function (commentText) {
        if (commentText.length <= 2) {
            return true;
        }
        var firstCharacterMatch = commentText.match(/^\/\/\s*(\w)/);
        if (firstCharacterMatch != null) {
            var firstCharacter = firstCharacterMatch[1];
            return firstCharacter === firstCharacter.toLowerCase();
        }
        else {
            return true;
        }
    };
    return CommentWalker;
})(Lint.RuleWalker);
