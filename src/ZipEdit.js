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
   * @type {vscode.ExtensionContext}
   */
  static context;

  /**
   * Registers the editor provider
   * @static
   * @returns {vscode.Disposable}
   */
  static register(ctx) {
    ZipEdit.context = ctx;
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
   * @returns An implementation of a `CustomReadonlyEditorProvider`
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

    console.log(ZipEdit.context.storageUri);

    var customCSS = vscode.workspace.getConfiguration("zipViewer").get("ZipEdit.additionalCSS");
    if (customCSS.includes("</style>")) {
      customCSS = "";
      vscode.window.showErrorMessage(
        "Hey! The custom CSS that you are trying to load contains the string `</style>`, which probably means someone is trying to do something nefarious. Don't worry, I prevented it from loading, but please check both your user settings and the workspace settings (zipViewer.ZipEdit.additionalCSS). (If it's in the workspace settings, maybe consider not using this workspace since someone is trying to attack you.)"
      );
    }

    panel.webview.options = {
      enableScripts: true,
    };
    panel.webview.html = `<!DOCTYPE html>
<html>
<head>
  <script defer src="${panel.webview.asWebviewUri(vscode.Uri.joinPath(extUri, "dist", "ZipEditor.js"))}"></script>
  <link rel="stylesheet" href="${panel.webview.asWebviewUri(vscode.Uri.joinPath(extUri, "media", "ZipEditor.css"))}">
  <style>${customCSS}</style>
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
    var zipFileData;
    document.getFileData(document.uri).then(
      function (_f) {
        zipFileData = _f;
        panel.webview.postMessage({ command: "files", f: JSON.stringify(zipFileData.files), uri: document.uri.toString() });
        if (Object.keys(zipFileData.files).length === 0) {
          vscode.window.showInformationMessage("This zip file does not appear to contain any files.");
        }
      },
      function (err) {
        vscode.window.showErrorMessage("JSZip encountered an error trying to load your zip file: " + err);
      }
    );
    panel.webview.onDidReceiveMessage(async (msg) => {
      if (msg.command === "get") {
        const config = vscode.workspace.getConfiguration("zipViewer");

        /**
         * @type {string}
         */
        var ext = msg.uri.split(".").pop().toLowerCase();
        var handled = false;

        if (extTypes.string.includes(ext)) {
          handled = true;
          postStringData();
        }

        // check if image
        if (extTypes.image.includes(ext)) {
          handled = true;
          zipFileData.files[msg.uri].async("base64").then(function (b64) {
            panel.webview.postMessage({ command: "content", type: "image", base64: b64, ext: ext, uri: msg.uri });
          });
        }

        if (ext === "pdf") {
          handled = true;
          var pdfViewerExt = vscode.extensions.getExtension("AdamRaichu.pdf-viewer");
          if (typeof pdfViewerExt === "undefined") {
            vscode.window
              .showInformationMessage(
                "You need to install the extension `AdamRaichu.pdf-viewer` to preview pdf files. Would you like to install this extension? If so, click yes, install the extension, then try previewing this subfile again.",
                "Yes",
                "No"
              )
              .then(function (choice) {
                switch (choice) {
                  case "Yes":
                    vscode.commands.executeCommand("workbench.extensions.search", "@id:AdamRaichu.pdf-viewer");
                    break;
                  case "No":
                    break;
                  default:
                    break;
                }
              });
          } else {
            if (!pdfViewerExt.isActive) {
              await pdfViewerExt.activate();
            }
            const PdfViewerApi = pdfViewerExt.exports.getV1Api();
            const fileData = await zipFileData.files[msg.uri].async("base64");
            const provider = PdfViewerApi.PdfFileDataProvider.fromBase64String(fileData).withName("Preview of " + msg.uri);
            PdfViewerApi.previewPdfFile(provider);
          }
        }

        // check if in settings (`zipViewer.textFileAssociations`)
        const textFileAssociations = config.get("textFileAssociations");
        for (var i = 0; i < textFileAssociations.length; i++) {
          if (document.uri.fsPath.substring(vscode.workspace.workspaceFolders[0].uri.fsPath.length) === textFileAssociations[i].zipPath && msg.uri === textFileAssociations[i].subfilePath) {
            handled = true;
            postStringData();
          }
        }

        // if not already posted
        if (!handled) {
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
          zipFileData.files[msg.uri].async("string").then(function (s) {
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
              await zipFileData.files[uriList[c]]
                .async("uint8array", function (meta) {
                  progress.report({ increment: inc * (meta.percent / 100) });
                })
                .then(
                  function (data) {
                    vscode.workspace.fs.writeFile(vscode.Uri.joinPath(targetPath[0], document.uri.path.split("/").pop() + config.unzippedSuffix, zipFileData.files[uriList[c]].name), data);
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
