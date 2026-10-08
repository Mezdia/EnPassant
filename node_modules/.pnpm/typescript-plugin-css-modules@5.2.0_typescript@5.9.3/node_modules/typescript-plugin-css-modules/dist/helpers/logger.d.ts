import type tsModule from 'typescript/lib/tsserverlibrary';
export interface Logger {
    log: (message: string) => void;
    error: (error: unknown) => void;
}
export declare const createLogger: (info: tsModule.server.PluginCreateInfo) => Logger;
