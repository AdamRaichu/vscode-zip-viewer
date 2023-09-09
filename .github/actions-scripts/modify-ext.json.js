const argv = require("minimist-lite")(process.argv.slice(2));
const fs = require("fs");

var extJson = JSON.parse(fs.readFileSync("./src/ext.json", "utf-8"));
extJson.string.push(...JSON.parse(`["` + argv.e.replaceAll(",", '","') + `"]`));
extJson.string.sort();
fs.writeFileSync("./src/ext.json", JSON.stringify(extJson, null, 2));
