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
        return this.applyWithWalker(new NoDebuggerWalker(syntaxTree, this.getOptions()));
    };
    Rule.FAILURE_STRING = "use of debugger statements is disallowed";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var NoDebuggerWalker = (function (_super) {
    __extends(NoDebuggerWalker, _super);
    function NoDebuggerWalker() {
        _super.apply(this, arguments);
    }
    NoDebuggerWalker.prototype.visitToken = function (token) {
        this.handleToken(token);
        _super.prototype.visitToken.call(this, token);
    };
    NoDebuggerWalker.prototype.handleToken = function (token) {
        if (token.kind() === 19 /* DebuggerKeyword */) {
            var position = this.getPosition() + TypeScript.leadingTriviaWidth(token);
            this.addFailure(this.createFailure(position, TypeScript.width(token), Rule.FAILURE_STRING));
        }
    };
    return NoDebuggerWalker;
})(Lint.RuleWalker);
