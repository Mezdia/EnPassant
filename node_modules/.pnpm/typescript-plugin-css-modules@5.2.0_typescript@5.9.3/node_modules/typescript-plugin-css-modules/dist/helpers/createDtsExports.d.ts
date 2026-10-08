import { Options } from '../options';
import { CSSExportsWithSourceMap } from './getCssExports';
import { Logger } from './logger';
export declare const createDtsExports: ({ cssExports, fileName, logger, options, }: {
    cssExports: CSSExportsWithSourceMap;
    fileName: string;
    logger: Logger;
    options: Options;
}) => string;
