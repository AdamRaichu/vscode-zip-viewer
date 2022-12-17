const vscode = require("vscode");
import ZipDoc from "./doc";

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
  <style>
    body.mc .folder::before {
      background-image: url(${panel.webview.asWebviewUri(vscode.Uri.joinPath(extUri, "media", "img", "folder-grass.png"))});
      background-size: contain;
      width: 24px;
      height: 24px;
      display: inline-block;
      content: "";
    }
    body.vsix .folder::before {
      background-image: url(${panel.webview.asWebviewUri(vscode.Uri.joinPath(extUri, "media", "img", "folder-vscode.png"))});
      background-size: contain;
      width: 24px;
      height: 24px;
      display: inline-block;
      content: "";
    }
    .folder::before {
      background-image: url(${panel.webview.asWebviewUri(vscode.Uri.joinPath(extUri, "media", "img", "folder.png"))});
      background-size: contain;
      width: 24px;
      height: 24px;
      display: inline-block;
      content: "";
    }
  </style>
</head>

<body>
  <h1 id="loading">Loading zip file content...</h1>
  <div id="target"></div>
</body>

</html>`;
    panel.webview.onDidReceiveMessage((message) => {
      if (message.command === "DOMContentLoaded") {
        document.getFileData(document.uri).then(function (f) {
          panel.webview.postMessage({ command: "files", f: JSON.stringify(f), uri: document.uri.toString() });
        });
      }
    });
  }

  async openCustomDocument(uri, _context, _token) {
    return new ZipDoc(uri);
  }
}
