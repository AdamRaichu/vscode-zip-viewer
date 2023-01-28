export default class GZipDoc {
  /**
   *
   * @param {vscode.Uri} uri
   */
  constructor(uri) {
    this._uri = uri;
  }

  async dispose() {}

  get uri() {
    return this._uri;
  }
}
