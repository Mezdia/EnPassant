import sass from 'sass';
export declare function resolveUrls(url: string, extensions?: string[]): string[];
/**
 * Creates a sass importer which resolves Webpack-style tilde-imports.
 */
export declare const sassTildeImporter: sass.FileImporter<'sync'>;
