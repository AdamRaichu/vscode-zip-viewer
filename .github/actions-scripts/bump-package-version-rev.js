const fs = require("fs");

var packageJson = JSON.parse(fs.readFileSync("./package.json", "utf-8"));
packageVersion = packageJson.version.split(".");
packageVersion[2] = JSON.stringify(JSON.parse(packageVersion[2]) + 1);
packageJson.version = packageVersion.join(".");

fs.writeFileSync("./package.json", JSON.stringify(packageJson, null, 2));
