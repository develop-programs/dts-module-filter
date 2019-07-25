# dts-module-filter

## Description

- Convert module-dts to namespace-dts
- Remove unnecessary imports from module-dts

## usage

- Definition
  
```.ts
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
})
```

- call

When removing only a specific impot

```.ts
filter.DtsModuleFilter({
  src: path.resolve(__dirname, "jwf.d.ts"),
  dest: path.resolve(__dirname, "temp.d.ts"), // Default is overwrite
  removeImport:/\.(scss|css)$/
});
```

When converting to namespace

```.ts
filter.DtsModuleFilter({
  src: path.resolve(__dirname, "jwf.d.ts"),
  dest: path.resolve(__dirname, "temp.d.ts"), // Default is overwrite
  namespace:"JWF"
});
```

## When using from WebPack

This is the description method for converting to namespace by dts-module-filter after combining files using dts-bundle

webpack.config.js

```.js
class DtsBundlePlugin {
  constructor(params) {
    this.params = params;
  }
  apply(compiler) {
    compiler.hooks.afterEmit.tap("DtsBundlePlugin", () => {
      const params = this.params;
      require("dts-bundle").bundle(params);
      require("dts-module-filter").DtsModuleFilter({
        src: params.out,
        namespace: params.name
      });
    });
  }
}

module.exports = {
  plugins: [
    new DtsBundlePlugin({
      name: "JWF",
      main: path.resolve(__dirname, "SRC-DTS"),
      out: path.resolve(__dirname, "DEST-DTS")
    })
  ]
};
```

## License

- [MIT License](https://opensource.org/licenses/mit-license.php)  
