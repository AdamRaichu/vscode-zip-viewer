/**
 * @author AdamRaichu
 * @file Exports {@link cmds}, a wrapper for registering the command handlers
 */

/**
 *
 */
const vscode = require("vscode");
const JSZip = require("jszip");
import { gzip } from "pako";
import gzMap from "./gz-map.json";
import sharedApi from "./shared";

var o = vscode.window.createOutputChannel("Zip Viewer");

/**
 * A wrapper for registering the commands for this extension
 */
export default class cmds {
  /**
   * The method which registers the commands.
   * @static
   * @returns {void} Nothing
   */
  static register() {
    vscode.commands.registerCommand("zipViewer.extract", function () {
      var config = vscode.workspace.getConfiguration().zipViewer;
      vscode.window.showOpenDialog({ title: "Zip File", openLabel: "Extract" }).then(function (files) {
        if (typeof files === "undefined") {
          return;
        }
        vscode.window
          .showOpenDialog({
            title: "Target Folder",
            canSelectFiles: false,
            canSelectFolders: true,
          })
          .then(function (targetPath) {
            if (typeof targetPath === "undefined") {
              return;
            }
            var z = new JSZip();
            vscode.workspace.fs.readFile(files[0]).then(function (Ui8A) {
              z.loadAsync(Ui8A).then(
                function (zip) {
                  var keys = Object.keys(zip.files);
                  for (var c = 0; c < keys.length; c++) {
                    var f = zip.files[keys[c]];
                    if (f.name.endsWith("/")) {
                    } else {
                      function temp(t) {
                        t.async("uint8array").then(function (u8) {
                          o.appendLine(`[DEBUG] Wrote ${t.name}`);
                          vscode.workspace.fs.writeFile(vscode.Uri.joinPath(targetPath[0], files[0].path.split("/").pop() + config.unzippedSuffix, t.name), u8);
                        });
                      }
                      temp(f);
                    }
                  }
                },
                function (err) {
                  console.error(err);
                  vscode.window.showErrorMessage(`JSZip encountered an error trying to unzip ${files[0].path}`);
                }
              );
            });
          });
      });
    });
    vscode.commands.registerCommand("zipViewer.zip", function (folderToZip) {
      if (typeof folderToZip === "undefined") {
        vscode.window
          .showOpenDialog({
            title: "Folder to zip",
            canSelectFiles: false,
            canSelectFolders: true,
          })
          .then(zipFolder);
      } else {
        zipFolder([folderToZip]);
      }
    });
    vscode.commands.registerCommand("zipViewer.openFileWithEditor", function () {
      vscode.window
        .showOpenDialog({
          title: "Zip file to open",
          canSelectFiles: true,
          canSelectFolders: false,
        })
        .then(function (file) {
          vscode.window.showQuickPick(["Zip", "GZip"], { title: "Compression Type" }).then(function (editorChoice) {
            vscode.commands.executeCommand("vscode.openWith", file[0], `zipViewer.${editorChoice}Edit`);
          });
        });
    });
    vscode.commands.registerCommand("zipViewer.gzip", function (fileToZip) {
      if (typeof fileToZip === "undefined") {
        vscode.window
          .showOpenDialog({
            title: "File to gzip",
            canSelectFiles: true,
            canSelectFolders: false,
          })
          .then(gzipFolder);
      } else {
        gzipFolder([fileToZip]);
      }
    });
  }
}

/**
 * Used to create a zip file from a given folder `uri[]`
 * @param {vscode.Uri[]} folderToZip
 * @returns {void} No return value
 */
function zipFolder(folderToZip) {
  if (typeof folderToZip === "undefined") {
    o.appendLine(`[DEBUG] Process aborted`);
    return;
  }
  o.appendLine(`[DEBUG] folderToZip: ${folderToZip}`);
  var targetPath = [sharedApi.uri.getParent(folderToZip[0])];
  if (typeof targetPath === "undefined") {
    o.appendLine(`[DEBUG] Process aborted`);
    return;
  }
  o.appendLine(`[DEBUG] targetPath: ${targetPath}`);
  var z = new JSZip(),
    barItem = vscode.window.createStatusBarItem(),
    count = 0;
  barItem.text = "$(loading~spin) Creating zip file...";
  barItem.show();
  function main(uri) {
    vscode.workspace.fs.readDirectory(uri).then(
      function (files) {
        for (var f in files) {
          function temp(d) {
            var name = uri.path.substr(folderToZip[0].path.length) + files[d][0];
            o.appendLine(`[DEBUG] Read ${name}`);
            count++;
            if (files[d][1] === 1) {
              vscode.workspace.fs.readFile(vscode.Uri.joinPath(uri, files[d][0])).then(function (file) {
                var splitPath = name.split("/");
                var current = z;
                for (var i = 0; i < splitPath.length - 1; i++) {
                  current = current.folder(splitPath[i]);
                }
                current.file(name, file);
                barItem.text = `$(loading~spin) Creating zip file. Reading ${name}`;
              });
            } else if (files[d][1] === 2) {
              main(vscode.Uri.joinPath(uri, files[d][0], "/"));
            }
          }
          temp(f);
        }
      },
      function (err) {
        console.error(err);
        vscode.showErrorMessage("An error occured creating your zip file.");
        o.appendLine(`[ERROR] Process failed`);
        barItem.text = "$(error) Zip file creation failed";
        barItem.backgroundColor = new vscode.ThemeColor("statusBarItem.errorBackground");
        setTimeout(function () {
          barItem.hide();
          barItem.dispose();
        }, 5000);
      }
    );
  }
  main(folderToZip[0]);
  var last = -1,
    same = 0;
  var i = setInterval(function () {
    if (last < count) {
      last++;
      same = 0;
    }
    if (last === count) {
      same++;
    }
    if (same >= 20) {
      clearInterval(i);
      gen();
    }
  }, 100);
  function gen() {
    z.generateAsync({ type: "uint8array" }, function (metadata) {
      barItem.text = `$(loading~spin) Zip file compression ${metadata.percent.toFixed(2)}% complete`;
    }).then(function (zip) {
      barItem.text = "$(loading~spin) Saving...";
      vscode.workspace.fs.writeFile(vscode.Uri.joinPath(targetPath[0], folderToZip[0].path.split("/").pop() + ".zip"), zip).then(
        function () {
          barItem.hide();
          barItem.dispose();
          o.appendLine("[INFO] Process completed.");
        },
        function (err) {
          console.error(err);
          vscode.showErrorMessage("An error occured trying to save your zip file.");
          o.appendLine(`[ERROR] Process failed`);
          barItem.text = "$(error) Zip file save failed";
          barItem.backgroundColor = new vscode.ThemeColor("statusBarItem.errorBackground");
          setTimeout(function () {
            barItem.hide();
            barItem.dispose();
          }, 3000);
        }
      );
    });
  }
}

/**
 * Compresses a file
 * @param {vscode.Uri[]} fileToZip The file to compress
 * @returns void
 */
function gzipFolder(fileToZip) {
  var config = vscode.workspace.getConfiguration().zipViewer;
  var _uri = fileToZip[0].toString().split("/");
  var fileName = _uri.pop();
  var _fileName = fileName.split(".");
  var ext = _fileName.pop();
  var newExt = "UNSET";
  for (var i = 0; i < gzMap.mappings.length; i++) {
    if (gzMap.mappings[i].inflated === ext) {
      newExt = gzMap.mappings[i].compressed;
    }
  }
  if (newExt === "UNSET") {
    newExt = "gz";
  }
  _fileName.push(newExt);
  _uri.push(_fileName.join("."));
  vscode.workspace.fs.readFile(fileToZip[0]).then(async function (data) {
    console.log(ifExists(_uri));
    vscode.workspace.fs.writeFile(vscode.Uri.parse(_uri.join("/")), gzip(data)).then(function () {
      if (config.deleteOldFileWhenGzipping) {
        vscode.workspace.fs.delete(fileToZip[0]);
      }
    });
  });
}

async function ifExists(_uri) {
  return sharedApi.fs.fileExists(vscode.Uri.parse(_uri.join("/"))).then(async function (exists) {
    if (exists) {
      _uri[_uri.length - 1] += "_";
      return await ifExists(_uri);
    }
    return _uri;
  });
}
