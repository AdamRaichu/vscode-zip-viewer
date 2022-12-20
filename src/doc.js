/**
 * @author AdamRaichu
 * @file Exports {@link ZipDoc}, an implementation of vscode.CustomDocument
 */

/**
 *
 */
const JSZip = require("jszip");
const vscode = require("vscode");

/**
 * A `CustomDocument` for zip files
 * @class
 * @implements {vscode.CustomDocument}
 */
export default class ZipDoc {
  /**
   * Creates an instance of ZipDoc
   * @param {vscode.Uri} uri
   */
  constructor(uri) {
    this._uri = uri;
  }

  /**
   * The method called when the document is closed
   * @async
   * @returns {Promise<void>}
   */
  async dispose() {}

  /**
   * A getter property which returns the uri of the opened resource
   * @returns {vscode.Uri} The uri this document represents
   */
  get uri() {
    return this._uri;
  }

  /**
   * A function which returns a JSZip object representing the zip file
   * @param {vscode.Uri} uri
   * @returns {JSZip} A promise of the JSZip zip object
   */
  async getFileData(uri) {
    return new Promise(function (resolve, reject) {
      var z = new JSZip();
      z.loadAsync(vscode.workspace.fs.readFile(uri)).then(
        function (f) {
          resolve(f);
        },
        function (err) {
          reject(err);
        }
      );
    });
  }
}
