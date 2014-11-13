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
        return this.applyWithWalker((new TypedefWhitespaceWalker(syntaxTree, this.getOptions())));
    };
    Rule.FAILURE_STRING = "missing type declaration";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var TypedefWhitespaceWalker = (function (_super) {
    __extends(TypedefWhitespaceWalker, _super);
    function TypedefWhitespaceWalker() {
        _super.apply(this, arguments);
    }
    TypedefWhitespaceWalker.prototype.visitCallSignature = function (node) {
        this.checkSpace("call-signature", node, node.typeAnnotation);
        _super.prototype.visitCallSignature.call(this, node);
    };
    TypedefWhitespaceWalker.prototype.visitCatchClause = function (node) {
        this.checkSpace("catch-clause", node, node.typeAnnotation);
        _super.prototype.visitCatchClause.call(this, node);
    };
    TypedefWhitespaceWalker.prototype.visitIndexSignature = function (node) {
        this.checkSpace("index-signature", node, node.typeAnnotation);
        _super.prototype.visitIndexSignature.call(this, node);
    };
    TypedefWhitespaceWalker.prototype.visitParameter = function (node) {
        this.checkSpace("parameter", node, node.typeAnnotation);
        _super.prototype.visitParameter.call(this, node);
    };
    TypedefWhitespaceWalker.prototype.visitPropertySignature = function (node) {
        this.checkSpace("property-signature", node, node.typeAnnotation);
        _super.prototype.visitPropertySignature.call(this, node);
    };
    TypedefWhitespaceWalker.prototype.visitVariableDeclarator = function (node) {
        this.checkSpace("variable-declarator", node, node.typeAnnotation);
        _super.prototype.visitVariableDeclarator.call(this, node);
    };
    TypedefWhitespaceWalker.prototype.checkSpace = function (option, node, typeAnnotation) {
        if (this.hasOption(option) && typeAnnotation) {
            var typeAnnotationChildIndex = this.getTypeAnnotationIndex(node);
            var precedingChild = this.findPrecedingChild(node, typeAnnotationChildIndex);
            var trailingTrivia = TypeScript.trailingTrivia(precedingChild);
            var hasLeadingWhitespace = this.hasLeadingWhitespace(trailingTrivia);
            if (hasLeadingWhitespace !== (this.getOption(option) === "space")) {
                var position = this.positionAfter(precedingChild);
                var message = "expected " + this.getOption(option) + " in " + option;
                var failure = this.createFailure(position, 1, message);
                this.addFailure(failure);
            }
        }
    };
    TypedefWhitespaceWalker.prototype.hasOption = function (option) {
        var allOptions = this.getOptions();
        if (!allOptions || allOptions.length === 0) {
            return false;
        }
        var options = allOptions[0];
        if (!options) {
            return false;
        }
        return !!options[option];
    };
    TypedefWhitespaceWalker.prototype.getOption = function (option) {
        var allOptions = this.getOptions();
        if (!allOptions || allOptions.length === 0) {
            return undefined;
        }
        var options = allOptions[0];
        return options[option];
    };
    TypedefWhitespaceWalker.prototype.getTypeAnnotationIndex = function (node) {
        var index = 0;
        var current = TypeScript.childAt(node, index);
        while (!(current instanceof TypeScript.Syntax.Concrete.TypeAnnotationSyntax)) {
            index++;
            current = TypeScript.childAt(node, index);
        }
        return index;
    };
    TypedefWhitespaceWalker.prototype.findPrecedingChild = function (node, startIndex) {
        var offset = 0;
        var precedingChild;
        while (!precedingChild) {
            offset++;
            precedingChild = TypeScript.childAt(node, startIndex - offset);
        }
        return precedingChild;
    };
    TypedefWhitespaceWalker.prototype.hasLeadingWhitespace = function (trivia) {
        if (trivia.count() < 1) {
            return false;
        }
        else {
            var kind = trivia.syntaxTriviaAt(0).kind();
            if (kind !== 4 /* WhitespaceTrivia */ && kind !== 5 /* NewLineTrivia */) {
                return false;
            }
        }
        return true;
    };
    return TypedefWhitespaceWalker;
})(Lint.RuleWalker);
