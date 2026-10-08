import Processor from 'postcss/lib/processor';
import { CSSExports } from 'icss-utils';
import { RawSourceMap } from 'source-map-js';
import type tsModule from 'typescript/lib/tsserverlibrary';
import { Options } from '../options';
import { Logger } from './logger';
export declare const enum FileType {
    css = "css",
    less = "less",
    sass = "sass",
    scss = "scss",
    styl = "styl"
}
export declare const getFileType: (fileName: string) => FileType;
export interface CSSExportsWithSourceMap {
    classes: CSSExports;
    css?: string;
    sourceMap?: RawSourceMap;
}
export declare const getCssExports: ({ css, fileName, logger, options, processor, compilerOptions, directory, }: {
    css: string;
    fileName: string;
    logger: Logger;
    options: Options;
    processor: Processor;
    compilerOptions: tsModule.CompilerOptions;
    directory: string;
}) => CSSExportsWithSourceMap;
