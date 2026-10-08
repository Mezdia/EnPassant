import type tsModule from 'typescript/lib/tsserverlibrary';
import { Options } from '../options';
import { Logger } from './logger';
import Processor from 'postcss/lib/processor';
export declare const getDtsSnapshot: (ts: typeof tsModule, processor: Processor, fileName: string, options: Options, logger: Logger, compilerOptions: tsModule.CompilerOptions, directory: string) => tsModule.IScriptSnapshot;
