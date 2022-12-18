const vscode = require("vscode");
const JSZip = require("jszip");

export default class ZipDoc {
  constructor(uri) {
    this._uri = uri;
  }

  async dispose() {}

  get uri() {
    return this._uri;
  }

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
