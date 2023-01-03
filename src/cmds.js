/**
 * @author AdamRaichu
 * @file Exports {@link cmds}, a wrapper for registering the command handlers
 */

/**
 *
 */
const vscode = require("vscode");
const JSZip = require("jszip");

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
            var zipTypes = config.zipTypes;
            for (var ext = 0; ext < zipTypes.length; ext++) {
              if (files[0].path.endsWith(zipTypes[ext]) || !config.picky) {
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
                return;
              }
            }
            vscode.window.showErrorMessage(
              "Selected file does not have a supported file extension. Edit the setting `zipViewer.zipTypes` to add a file extension, but please go to the extension repository and open an issue so it can be added to the built in list."
            );
          });
      });
    });
    vscode.commands.registerCommand("zipViewer.zip", function () {
      vscode.window
        .showOpenDialog({
          title: "Folder to zip",
          canSelectFiles: false,
          canSelectFolders: true,
        })
        .then(function (folderToZip) {
          if (typeof folderToZip === "undefined") {
            o.appendLine(`[DEBUG] Process aborted`);
            return;
          }
          o.appendLine(`[DEBUG] folderToZip: ${folderToZip}`);
          vscode.window
            .showOpenDialog({
              title: "Target folder",
              canSelectFiles: false,
              canSelectFolders: true,
            })
            .then(function (targetPath) {
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
                        o.appendLine(`[DEBUG] Read ${uri.path.substr(folderToZip[0].path.length) + files[d][0]}`);
                        count++;
                        if (files[d][1] === 1) {
                          vscode.workspace.fs.readFile(vscode.Uri.joinPath(uri, files[d][0])).then(function (file) {
                            z.file(uri.path.substr(folderToZip[0].path.length) + files[d][0], file);
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
            });
        });
    });
    vscode.commands.registerCommand("zipViewer.openFileWithEditor", function () {
      vscode.window
        .showOpenDialog({
          title: "Zip file to open",
          canSelectFiles: true,
          canSelectFolders: false,
        })
        .then(function (file) {
          vscode.commands.executeCommand("vscode.openWith", file[0], "zipViewer.ZipEdit");
        });
    });
  }
}
