import { ungzip } from "pako";
import GZipDoc from "./GZipDoc.js";
import extTypes from "./ext.json";
const vscode = require("vscode");

export default class GZipEdit {
  static register() {
    return vscode.window.registerCustomEditorProvider(GZipEdit.viewType, new GZipEdit());
  }

  static viewType = "zipViewer.GZipEdit";

  constructor() {}

  async openCustomDocument(uri, _context, _token) {
    return new GZipDoc(uri);
  }

  /**
   * The method called when opening a file with the custom editor
   * @async
   * @param {GZipDoc} document
   * @param {vscode.WebviewPanel} panel
   * @param {vscode.CancellationToken} _token
   */
  async resolveCustomEditor(document, panel, _token) {
    var config = vscode.workspace.getConfiguration().zipViewer;
    if (config.gzipEditorEnabled) {
      panel.webview.html = this.htmlList.followPopup;
      doesItExist(document.uri.toString().split("."), document);
    } else {
      panel.webview.html = this.htmlList.editorDisabled;
    }
  }

  htmlList = {
    editorDisabled:
      "<!DOCTYPE html><html><head></head><body><h1>The GZip editor has been disabled.</h1><p>You have disabled the GZip editor. Enable the setting `zipViewer.gzipEditorEnabled` to enable the editor.</p></body></html>",
    followPopup: "<!DOCTYPE html><html><head></head><body><h1>Please follow popup instructions.</h1></body></html>",
  };
}

/**
 *
 * @param {vscode.Uri} _uri
 * @param {GZipDoc} document
 */
async function showFile(uri, document) {
  vscode.workspace.fs.readFile(document.uri).then(async function (data) {
    await vscode.workspace.fs.writeFile(uri, ungzip(data)).then(function () {
      vscode.commands.executeCommand("vscode.open", uri);
    });
  });
}

/**
 * A wrapper to check to see if file exists before writing.
 * @param {String[]} _uri Expects `uri.toString().split(".")`
 * @param {GZipDoc} document The CustomDocument data that needs to be passed on
 */
function doesItExist(_uri, document) {
  var config = vscode.workspace.getConfiguration().zipViewer;
  _uri.pop();
  _uri[_uri.length - 2] += config.unzippedSuffix;
  var uri = vscode.Uri.parse(_uri.join("."));
  vscode.workspace.fs.stat(uri).then(
    function () {
      doesItExist((_uri.join(".") + "_gz.file").toString().split("."));
    },
    function () {
      showFile(uri, document);
    }
  );
}
