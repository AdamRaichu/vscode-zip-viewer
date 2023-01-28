const pako = require("pako");
const fs = require("fs");

console.log(pako.ungzip(fs.readFileSync("./tests/vscode-zip-viewer-2.5.0.tar.gz"), { to: "string" }));
