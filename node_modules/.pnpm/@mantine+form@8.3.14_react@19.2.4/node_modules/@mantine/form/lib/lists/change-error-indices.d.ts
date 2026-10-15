/**
 * Changes the indices of every error that is after the given `index` with the given `change` at the given `path`.
 * This requires that the errors are in the format of `path.index` and that the index is a number.
 */
export declare function changeErrorIndices<T extends Record<PropertyKey, any>>(path: PropertyKey, index: number | undefined, errors: T, change: 1 | -1): T;
