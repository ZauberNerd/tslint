var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var OPTION_VARIABLES_BEFORE_FUNCTIONS = "variables-before-functions";
var OPTION_STATIC_BEFORE_INSTANCE = "static-before-instance";
var OPTION_PUBLIC_BEFORE_PRIVATE = "public-before-private";
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (syntaxTree) {
        return this.applyWithWalker(new MemberOrderingWalker(syntaxTree, this.getOptions()));
    };
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
function getModifiers(isMethod, modifiers) {
    var modifierStrings = modifiers.map(function (x) {
        return x.text();
    });
    return {
        isMethod: isMethod,
        isPrivate: modifierStrings.indexOf("private") !== -1,
        isInstance: modifierStrings.indexOf("static") === -1
    };
}
function toString(modifiers) {
    return [
        modifiers.isPrivate ? "private" : "public",
        modifiers.isInstance ? "instance" : "static",
        "member",
        modifiers.isMethod ? "function" : "variable"
    ].join(" ");
}
var MemberOrderingWalker = (function (_super) {
    __extends(MemberOrderingWalker, _super);
    function MemberOrderingWalker(syntaxTree, options) {
        _super.call(this, syntaxTree, options);
    }
    MemberOrderingWalker.prototype.visitClassDeclaration = function (node) {
        this.previous = {
            isMethod: false,
            isPrivate: false,
            isInstance: false
        };
        _super.prototype.visitClassDeclaration.call(this, node);
    };
    MemberOrderingWalker.prototype.visitMemberFunctionDeclaration = function (node) {
        this.checkAndSetModifiers(node, getModifiers(true, node.modifiers));
        _super.prototype.visitMemberFunctionDeclaration.call(this, node);
    };
    MemberOrderingWalker.prototype.visitMemberVariableDeclaration = function (node) {
        this.checkAndSetModifiers(node, getModifiers(false, node.modifiers));
        _super.prototype.visitMemberVariableDeclaration.call(this, node);
    };
    MemberOrderingWalker.prototype.checkAndSetModifiers = function (node, current) {
        if (!this.canAppearAfter(this.previous, current)) {
            var position = this.getPosition() + TypeScript.leadingTriviaWidth(node);
            var message = "Declaration of " + toString(current) + " not allowed to appear after declaration of " + toString(this.previous);
            this.addFailure(this.createFailure(position, TypeScript.width(node), message));
        }
        this.previous = current;
    };
    MemberOrderingWalker.prototype.canAppearAfter = function (previous, current) {
        if (this.hasOption(OPTION_VARIABLES_BEFORE_FUNCTIONS) && previous.isMethod !== current.isMethod) {
            return Number(previous.isMethod) < Number(current.isMethod);
        }
        if (this.hasOption(OPTION_STATIC_BEFORE_INSTANCE) && previous.isInstance !== current.isInstance) {
            return Number(previous.isInstance) < Number(current.isInstance);
        }
        if (this.hasOption(OPTION_PUBLIC_BEFORE_PRIVATE) && previous.isPrivate !== current.isPrivate) {
            return Number(previous.isPrivate) < Number(current.isPrivate);
        }
        return true;
    };
    return MemberOrderingWalker;
})(Lint.RuleWalker);
exports.MemberOrderingWalker = MemberOrderingWalker;
