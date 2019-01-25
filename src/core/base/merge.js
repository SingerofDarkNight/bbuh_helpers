import * as deepmerge from 'deepmerge';

function overwriteMerge(destinationArray, sourceArray, options) {
    return sourceArray;
}

export default function CustomMerge(x, y) {
    return deepmerge(x, y, { arrayMerge: overwriteMerge });
}
