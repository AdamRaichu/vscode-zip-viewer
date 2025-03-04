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
          .then(gzipFile);
      } else {
        gzipFile([fileToZip]);
      }
    });
  }
}

/**
 * Used to create a zip file from a given folder `uri[]`
 * @param {vscode.Uri[]} folderToZip
 * @returns {void} No return value
 */
async function zipFolder(folderToZip) {
  if (typeof folderToZip === "undefined") {
    return;
  }
  // var targetPath = [sharedApi.uri.getParent(folderToZip[0])];
  var targetPath = (await vscode.window.showOpenDialog({ title: "Target Folder", canSelectFiles: false, canSelectFolders: true }))[0];
  if (typeof targetPath === "undefined") {
    return;
  }
  var z = new JSZip();
  var barItem = vscode.window.createStatusBarItem();
  barItem.text = "$(loading~spin) Creating zip file...";
  barItem.show();
  /**
   * Zip a folder using `workspace.findFiles`
   * @param {vscode.Uri} uri The uri of the folder to zip
   */
  async function zipUsingFindFiles(uri) {
    const files = await vscode.workspace.findFiles(new vscode.RelativePattern(uri, "**/**"));
    for (var i in files) {
      const name = files[i].path.substring(uri.path.length);
      const file = await vscode.workspace.fs.readFile(vscode.Uri.joinPath(uri, name));
      const splitPath = name.split("/");
      var current = z;
      for (var i = 0; i < splitPath.length - 1; i++) {
        current = current.folder(splitPath[i]);
      }
      current.file(splitPath.pop(), file);
      barItem.text = `$(loading~spin) Creating zip file. Reading ${name}`;
    }
    z.generateAsync({ type: "uint8array" }, function (metadata) {
      barItem.text = `$(loading~spin) Zip file compression ${metadata.percent.toFixed(2)}% complete`;
    }).then(function (zip) {
      barItem.text = "$(loading~spin) Saving...";
      vscode.workspace.fs.writeFile(vscode.Uri.joinPath(targetPath, folderToZip[0].path.split("/").pop() + ".zip"), zip).then(
        function () {
          barItem.hide();
          barItem.dispose();
        },
        function (err) {
          console.error(err);
          vscode.showErrorMessage("An error occured trying to save your zip file.");
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
  zipUsingFindFiles(folderToZip[0]);
}

/**
 * Compresses a file
 * @param {vscode.Uri[]} fileToZip The file to compress
 * @returns void
 */
function gzipFile(fileToZip) {
  var config = vscode.workspace.getConfiguration().zipViewer;
  var _uri = fileToZip[0].toString().split("/");
  var fileName = _uri.pop();
  var _fileName = fileName.split(".");
  var ext;
  if (!config.useLegacyGzipNamingConvention) {
    ext = _fileName[_fileName.length - 1];
  } else {
    ext = _fileName.pop();
  }
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
    vscode.workspace.fs.writeFile(vscode.Uri.parse(_uri.join("/")), gzip(data)).then(function () {
      if (config.deleteOldFileWhenGzipping) {
        vscode.workspace.fs.delete(fileToZip[0]);
      }
    });
  });
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
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
