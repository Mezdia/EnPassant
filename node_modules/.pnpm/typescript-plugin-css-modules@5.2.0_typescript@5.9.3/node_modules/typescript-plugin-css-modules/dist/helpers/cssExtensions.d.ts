export type isCSSFn = (fileName: string) => boolean;
export type isRelativeCSSFn = (fileName: string) => boolean;
export declare const createIsCSS: (customMatcher?: RegExp) => isCSSFn;
export declare const createIsRelativeCSS: (isCSS: isCSSFn) => isRelativeCSSFn;
