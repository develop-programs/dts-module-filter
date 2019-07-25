import * as path from "path";
import * as filter from "../src/DtsModuleFilter";

/*
filter.DtsModuleFilter({
  src: path.resolve(__dirname, "jwf.d.ts"),
  dest: path.resolve(__dirname, "temp.d.ts"),
  removeImport:/\.(scss|css)$/
});
*/


filter.DtsModuleFilter({
  src: path.resolve(__dirname, "jwf.d.ts"),
  dest: path.resolve(__dirname, "temp.d.ts"),
  namespace:"JWF"
});