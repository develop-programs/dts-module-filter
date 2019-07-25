import * as ts from "typescript";
import * as fs from "fs";
import { SyntaxKind } from "typescript";

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
export function DtsModuleFilter(params: {
  src: string;
  dest?: string;
  removeImport?:RegExp;
  namespace?: string;
}) {
  let data = fs.readFileSync(params.src, "utf8");
  const getRemoveList = (node: ts.Node, list?: { start:number; length:number }[]) => {
    if (!list) list = [];

    if (params.namespace) { //module to namespace
      if (
        node.kind === SyntaxKind.ImportDeclaration ||
        node.kind === SyntaxKind.ExportDeclaration
      ) {
        list.push({ start: node.getFullStart(), length: node.getFullWidth() });
      } else if (node.kind === SyntaxKind.ModuleDeclaration) {
        list.push({
          start: node.getStart(),
          length: node.getText().indexOf("{") + 1
        });
        const point = node.getText().lastIndexOf("}");
        list.push({
          start: node.getStart() + point,
          length: node.getText().length - point
        });
      }
    }else if(params.removeImport){ // remove import
        if (node.kind === SyntaxKind.ImportDeclaration){
          let flag = false;
          node.forEachChild((child)=>{
            if(child.kind === SyntaxKind.StringLiteral){
              const path = child.getText().match(/^["'](.*)["']$/);
              if(path && path.length == 2 && params.removeImport!.test(path[1]))
                flag = true;
            }
          })
          if(flag)
            list.push({ start: node.getFullStart(), length: node.getFullWidth() });
        }
    }
    node.forEachChild(node => {
      getRemoveList(node, list);
    });
    return list;
  };

  const src = ts.createSourceFile(
    "temp.ts",
    data,
    ts.ScriptTarget.ES2017,
    true
  );
  const list = getRemoveList(src);
  list.sort((a, b) => {
    return a.start - b.start;
  });
  let data2 = "";

  if (params.namespace) {
    data2 += `declare namespace ${params.namespace} {\n`;
  }

  let point = 0;
  for (const node of list) {
    data2 += data.slice(point, node.start);
    point = node.start + node.length;
  }
  data2 += data.slice(point);
  if (params.namespace) {
    data2 += `}\n`;
  }
  fs.writeFileSync(params.dest || params.src, data2);
}
