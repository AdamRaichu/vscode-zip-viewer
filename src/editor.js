const vscode = require("vscode");
import ZipDoc from "./doc";
import extTypes from "./ext.json";
import mime from "./mime.json";

export default class ZipEdit {
  static register() {
    return vscode.window.registerCustomEditorProvider(ZipEdit.viewType, new ZipEdit());
  }

  static viewType = "zipViewer.ZipEdit";

  constructor() {}

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
  <textarea readonly id="preview"></textarea>
</body>

</html>`;
    panel.webview.onDidReceiveMessage((message) => {
      if (message.command === "DOMContentLoaded") {
        document.getFileData(document.uri).then(function (f) {
          panel.webview.postMessage({ command: "files", f: JSON.stringify(f.files), uri: document.uri.toString() });
          panel.webview.onDidReceiveMessage((msg) => {
            if (msg.command === "get") {
              var ext = msg.uri.split(".").pop();

              // check if string
              for (var i = 0; i < extTypes.string.length; i++) {
                if (ext === extTypes.string[i]) {
                  f.files[msg.uri].async("string").then(function (s) {
                    panel.webview.postMessage({ command: "content", type: "string", string: s });
                  });
                }
              }

              // check if image
              for (var i = 0; i < extTypes.image.length; i++) {
                if (ext === extTypes.image[i]) {
                  f.files[msg.uri].async("base64").then(function (b64) {
                    panel.webview.postMessage({ command: "content", type: "image", base64: b64, ext: ext });
                  });
                }
              }
            }
          });
        });
      }
    });
  }

  async openCustomDocument(uri, _context, _token) {
    return new ZipDoc(uri);
  }
}
