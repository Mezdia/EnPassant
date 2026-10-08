import { type AcceptedPlugin } from 'postcss';
interface FilterPluginsOptions {
    plugins: AcceptedPlugin[];
    exclude?: string[];
}
export declare const filterPlugins: ({ plugins, exclude }: FilterPluginsOptions) => AcceptedPlugin[];
export {};
