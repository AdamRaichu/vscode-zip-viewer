/**
 * @author adamraichu
 * @file Exports {@link ZipEdit}, an implementation of a CustomReadonlyEditorProvider
 */
import ZipDoc from "./ZipDoc.js";
import extTypes from "./ext.json";
import mime from "./mime.json";
const vscode = require("vscode");

/**
 * A `CustomReadonlyEditorProvider` for zip files
 * @class
 * @implements {vscode.CustomReadonlyEditorProvider}
 */
export default class ZipEdit {
  /**
   * Registers the editor provider
   * @static
   * @returns {vscode.Disposable}
   */
  static register() {
    return vscode.window.registerCustomEditorProvider(ZipEdit.viewType, new ZipEdit());
  }

  /**
   * The `viewType` of the editor as found in the manifest
   * @static
   * @readonly
   */
  static viewType = "zipViewer.ZipEdit";

  /**
   * Creates an instance of ZipEdit
   * @returns An implemenation of a `CustomReadonlyEditorProvider`
   */
  constructor() {}

  /**
   * The method called when opening a file with the custom editor
   * @async
   * @param {ZipDoc} document
   * @param {vscode.WebviewPanel} panel
   * @param {vscode.CancellationToken} _token
   */
  async resolveCustomEditor(document, panel, _token) {
    var extUri = vscode.extensions.getExtension("adamraichu.zip-viewer").extensionUri;

    panel.webview.options = {
      enableScripts: true,
    };
    panel.webview.html = `<!DOCTYPE html>
<html>
<head>
  <script src="${panel.webview.asWebviewUri(vscode.Uri.joinPath(extUri, "dist", "ZipEditor.js"))}"></script>
  <link rel="stylesheet" href="${panel.webview.asWebviewUri(vscode.Uri.joinPath(extUri, "media", "ZipEditor.css"))}">
  <script>var mime = ${JSON.stringify(mime)}</script>
</head>

<body>
  <h1 id="loading">Loading zip file content...</h1>
  <div id="toolbar">
    <vscode-button id="extract-select">Extract Selected Files Only</vscode-button>
  </div>
  <div id="target"></div>
  <hr>
  <h1>File Preview</h1>
  <h3 id="uri"></h3>
  <div id="preview"></div>
</body>

</html>`;
    panel.webview.onDidReceiveMessage((message) => {
      if (message.command === "DOMContentLoaded") {
        document.getFileData(document.uri).then(
          function (f) {
            panel.webview.postMessage({ command: "files", f: JSON.stringify(f.files), uri: document.uri.toString() });
            console.debug(f.files);
            if (Object.keys(f.files).length === 0) {
              vscode.window.showInformationMessage("This zip file does not appear to contain any files.");
            }
            panel.webview.onDidReceiveMessage((/**@type {Object}*/ msg) => {
              if (msg.command === "get") {
                const config = vscode.workspace.getConfiguration("zipViewer");

                /**
                 * @type {String}
                 */
                var ext = msg.uri.split(".").pop().toLowerCase();
                var posted = false;

                // check if string
                for (var i = 0; i < extTypes.string.length; i++) {
                  if (ext === extTypes.string[i]) {
                    posted = true;
                    postStringData();
                  }
                }

                // check if image
                for (var i = 0; i < extTypes.image.length; i++) {
                  if (ext === extTypes.image[i]) {
                    posted = true;
                    f.files[msg.uri].async("base64").then(function (b64) {
                      panel.webview.postMessage({ command: "content", type: "image", base64: b64, ext: ext, uri: msg.uri });
                    });
                  }
                }

                // check if in settings (`zipViewer.textFileAssociations`)
                const textFileAssociations = config.get("textFileAssociations");
                for (var i = 0; i < textFileAssociations.length; i++) {
                  if (document.uri.fsPath.substring(vscode.workspace.workspaceFolders[0].uri.fsPath.length) === textFileAssociations[i].zipPath && msg.uri === textFileAssociations[i].subfilePath) {
                    posted = true;
                    postStringData();
                  }
                }

                // if not already posted
                if (!posted) {
                  vscode.window
                    .showErrorMessage(
                      `The file extension ${ext} is not on the list of text or image files. If you would like to request support for this file type, please choose the option below.`,
                      "Request file type support",
                      "This is a text file",
                      "Ignore"
                    )
                    .then(function (choice) {
                      switch (choice) {
                        case "Request file type support":
                          var title = `[editor]:+Support+${ext}+in+preview`;
                          var body = `Please+add+support+for+\`.${ext}\`+files+to+the+editor+preview.%0A%0A*Generated by \`adamraichu.zip-viewer\`*`;
                          vscode.env.openExternal(`https://github.com/AdamRaichu/vscode-zip-viewer/issues/new?title=${title}&body=${body}`);
                          break;
                        case "This is a text file":
                          postStringData();
                          vscode.window.showInformationMessage("Would you like to always open this subfile as a text file? (This updates a workspace setting.)", "Yes", "No").then(function (yn) {
                            if (yn === "Yes") {
                              textFileAssociations.push({ zipPath: document.uri.fsPath.substring(vscode.workspace.workspaceFolders[0].uri.fsPath.length), subfilePath: msg.uri });
                              config.update("textFileAssociations", textFileAssociations, vscode.ConfigurationTarget.Workspace);
                            }
                          });
                          break;
                      }
                    });
                }

                function postStringData() {
                  f.files[msg.uri].async("string").then(function (s) {
                    panel.webview.postMessage({ command: "content", type: "string", string: s, uri: msg.uri });
                  });
                }
              } else if (msg.command === "selective-extract") {
                /**
                 * @type {String[]}
                 */
                var uriList = JSON.parse(msg.uriList);
                if (uriList.length === 0) {
                  vscode.window.showErrorMessage("No files are selected.");
                  return;
                }
                vscode.window.showOpenDialog({ title: "Target Folder", canSelectFiles: false, canSelectFolders: true }).then(function (targetPath) {
                  if (typeof targetPath === "undefined") return;
                  vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, title: "Extracting Selected Files" }, async function (progress, _token) {
                    progress.report({ increment: 0 });
                    var inc = 100 / uriList.length;
                    var config = vscode.workspace.getConfiguration().zipViewer;
                    for (var c = 0; c < uriList.length; c++) {
                      await f.files[uriList[c]]
                        .async("uint8array", function (meta) {
                          progress.report({ increment: inc * (meta.percent / 100) });
                        })
                        .then(
                          function (data) {
                            vscode.workspace.fs.writeFile(vscode.Uri.joinPath(targetPath[0], document.uri.path.split("/").pop() + config.unzippedSuffix, f.files[uriList[c]].name), data);
                          },
                          function (err) {
                            console.error(err);
                          }
                        );
                    }
                    return;
                  });
                });
              }
            });
          },
          function (err) {
            vscode.window.showErrorMessage("JSZip encountered an error trying to load your zip file: " + err);
          }
        );
      }
    });
  }

  /**
   * The method used to create a ZipDoc for the editor
   * @async
   * @param {vscode.Uri} uri The uri of the resource being opened
   * @param {vscode.CustomDocumentOpenContext} _context
   * @param {vscode.CancellationToken} _token
   * @returns {ZipDoc} An instance of `ZipDoc` with the provided uri
   */
  async openCustomDocument(uri, _context, _token) {
    return new ZipDoc(uri);
  }
}
