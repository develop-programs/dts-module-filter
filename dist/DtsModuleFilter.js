"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ts = __importStar(require("typescript"));
var fs = __importStar(require("fs"));
var typescript_1 = require("typescript");
/**
 *convert module-dts to namespace-dts
 *
 * @export
 * @param {{
 *   src: string; // Source file path
 *   dest?: string; // Path of output file
 *   removeImport?:RegExp; // Conditions of import removal
 *   namespace?: string; // Name of the namespace
 * }} params
 */
function DtsModuleFilter(params) {
    var data = fs.readFileSync(params.src, "utf8");
    var getRemoveList = function (node, list) {
        if (!list)
            list = [];
        if (params.namespace) { //module to namespace
            if (node.kind === typescript_1.SyntaxKind.ImportDeclaration ||
                node.kind === typescript_1.SyntaxKind.ExportDeclaration) {
                list.push({ start: node.getFullStart(), length: node.getFullWidth() });
            }
            else if (node.kind === typescript_1.SyntaxKind.ModuleDeclaration) {
                list.push({
                    start: node.getStart(),
                    length: node.getText().indexOf("{") + 1
                });
                var point_1 = node.getText().lastIndexOf("}");
                list.push({
                    start: node.getStart() + point_1,
                    length: node.getText().length - point_1
                });
            }
        }
        else if (params.removeImport) { // remove import
            if (node.kind === typescript_1.SyntaxKind.ImportDeclaration) {
                var flag_1 = false;
                node.forEachChild(function (child) {
                    if (child.kind === typescript_1.SyntaxKind.StringLiteral) {
                        var path = child.getText().match(/^["'](.*)["']$/);
                        if (path && path.length == 2 && params.removeImport.test(path[1]))
                            flag_1 = true;
                    }
                });
                if (flag_1)
                    list.push({ start: node.getFullStart(), length: node.getFullWidth() });
            }
        }
        node.forEachChild(function (node) {
            getRemoveList(node, list);
        });
        return list;
    };
    var src = ts.createSourceFile("temp.ts", data, ts.ScriptTarget.ES2017, true);
    var list = getRemoveList(src);
    list.sort(function (a, b) {
        return a.start - b.start;
    });
    var data2 = "";
    if (params.namespace) {
        data2 += "declare namespace " + params.namespace + " {\n";
    }
    var point = 0;
    for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
        var node = list_1[_i];
        data2 += data.slice(point, node.start);
        point = node.start + node.length;
    }
    data2 += data.slice(point);
    if (params.namespace) {
        data2 += "}\n";
    }
    fs.writeFileSync(params.dest || params.src, data2);
}
exports.DtsModuleFilter = DtsModuleFilter;
//# sourceMappingURL=DtsModuleFilter.js.map