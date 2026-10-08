# Installation
> `npm install --save @types/postcss-modules-local-by-default`

# Summary
This package contains type definitions for postcss-modules-local-by-default (https://github.com/css-modules/postcss-modules-local-by-default).

# Details
Files were exported from https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/postcss-modules-local-by-default.
## [index.d.ts](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/postcss-modules-local-by-default/index.d.ts)
````ts
import { PluginCreator } from "postcss";

declare namespace localByDefault {
    interface Options {
        mode?: "global" | "local" | "pure" | undefined;
        rewriteUrl?: ((global: boolean, url: string) => string) | undefined;
    }
}

declare const creator: PluginCreator<localByDefault.Options>;

export = creator;

````

### Additional Details
 * Last updated: Tue, 07 Nov 2023 09:09:39 GMT
 * Dependencies: [postcss](https://npmjs.com/package/postcss)

# Credits
These definitions were written by [Jeow Li Huan](https://github.com/huan086).
