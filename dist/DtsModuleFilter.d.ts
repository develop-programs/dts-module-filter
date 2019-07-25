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
export declare function DtsModuleFilter(params: {
    src: string;
    dest?: string;
    removeImport?: RegExp;
    namespace?: string;
}): void;
