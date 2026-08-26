"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
var server_js_1 = require("./server.js");
var port = Number((_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000);
var host = (_b = process.env.HOST) !== null && _b !== void 0 ? _b : "0.0.0.0";
try {
    var app = await (0, server_js_1.buildServer)();
    await app.listen({
        port: port,
        host: host,
    });
    console.log("AMPDA API running on http://localhost:".concat(port));
}
catch (error) {
    console.error("Failed to start AMPDA API:", error);
    process.exit(1);
}
