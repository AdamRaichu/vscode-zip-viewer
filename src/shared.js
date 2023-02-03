const vscode = require("vscode");

const sharedApi = {
  uri: {
    /**
     * A function to get the parent folder of a Uri.
     * @param {vscode.Uri} uri Uri to get parent of.
     * @returns {vscode.Uri} Uri of the parent folder
     */
    getParent: function (uri) {
      var a = uri.toString().split("/");
      a.pop();
      return vscode.Uri.parse(a.join("/"));
    },
  },
  fs: {
    /**
     * A fuction to check if a file exists.
     * @param {vscode.Uri} uri Uri to check if exists
     * @returns {Promise<Boolean>} Whether the file exists
     * @async
     */
    fileExists: function (uri) {
      return new Promise(function (resolve) {
        vscode.workspace.fs.stat(uri).then(
          function () {
            resolve(true);
          },
          function () {
            resolve(false);
          }
        );
      });
    },
  },
};

export default sharedApi;
