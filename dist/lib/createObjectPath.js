"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var slapdash_1 = require("slapdash");
function createObjectPath(root, path) {
    path = slapdash_1.isArray(path) ? path : path.split('.');
    return slapdash_1.reduce(path, function (acc, nextPath) {
        acc[nextPath] = acc[nextPath] || {};
        return acc[nextPath];
    }, root);
}
exports.createObjectPath = createObjectPath;
//# sourceMappingURL=createObjectPath.js.map