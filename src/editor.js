/**
 * @author adamraichu
 * @file Exports {@link ZipEdit}, an implementation of a CustomReadonlyEditorProvider
 */
import ZipDoc from "./doc.js";
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
  <script src="${panel.webview.asWebviewUri(vscode.Uri.joinPath(extUri, "media", "editor.js"))}"></script>
  <link rel="stylesheet" href="${panel.webview.asWebviewUri(vscode.Uri.joinPath(extUri, "media", "editor.css"))}">
  <script>var mime = ${JSON.stringify(mime)}</script>
</head>

<body>
  <h1 id="loading">Loading zip file content...</h1>
  <div id="target"></div>
  <hr>
  <h1>File Preview</h1>
  <div id="preview"></div>
</body>

</html>`;
    panel.webview.onDidReceiveMessage((message) => {
      if (message.command === "DOMContentLoaded") {
        document.getFileData(document.uri).then(function (f) {
          panel.webview.postMessage({ command: "files", f: JSON.stringify(f.files), uri: document.uri.toString() });
          panel.webview.onDidReceiveMessage((msg) => {
            if (msg.command === "get") {
              console.debug(`Received a request for ${msg.uri}`);
              /**
               * @type {String}
               */
              var ext = msg.uri.split(".").pop();
              console.debug(ext);

              // check if string
              for (var i = 0; i < extTypes.string.length; i++) {
                if (ext === extTypes.string[i]) {
                  console.debug("File is type string");
                  f.files[msg.uri].async("string").then(function (s) {
                    panel.webview.postMessage({ command: "content", type: "string", string: s });
                    console.debug("Info posted");
                  });
                }
              }

              // check if image
              for (var i = 0; i < extTypes.image.length; i++) {
                if (ext === extTypes.image[i]) {
                  console.debug("File is type image");
                  f.files[msg.uri].async("base64").then(function (b64) {
                    panel.webview.postMessage({ command: "content", type: "image", base64: b64, ext: ext });
                    console.debug("Info posted");
                  });
                }
              }
            }
          });
        });
      }
    });
  }

  /**
   * The method used to create a ZipDoc for the editor
   * @async
   * @param {vscode.Uri} uri
   * @param {vscode.CustomDocumentOpenContext} _context
   * @param {vscode.CancellationToken} _token
   * @returns {ZipDoc} An instance of `ZipDoc` with the provided uri
   */
  async openCustomDocument(uri, _context, _token) {
    return new ZipDoc(uri);
  }
}
