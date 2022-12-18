"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.citySchema = void 0;
const typebox_1 = require("@sinclair/typebox");
//the object we expect:
exports.citySchema = typebox_1.Type.Object({
    name: typebox_1.Type.String(),
    european: typebox_1.Type.Boolean(),
    country: typebox_1.Type.String(),
    inhabitans: typebox_1.Type.Integer(),
    region: typebox_1.Type.Optional(typebox_1.Type.String()),
}, { additionalProperties: false });
//we have inferred a planetData type that can be used in our code.
//# sourceMappingURL=cities.js.map