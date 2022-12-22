/**
 * @file media/editor.js provides scripts for use in ZipEdit
 */

/**
 *
 */
const vscode = acquireVsCodeApi();

document.addEventListener("DOMContentLoaded", function () {
  vscode.postMessage({ command: "DOMContentLoaded" });
});

window.addEventListener("message", (e) => {
  if (e.data.command === "files") {
    document.getElementById("loading").remove();
    if (e.data.uri.endsWith(".mcworld") || e.data.uri.endsWith(".mcpack") || e.data.uri.endsWith(".mcaddon")) {
      document.body.classList.add("mc");
    } else if (e.data.uri.endsWith(".vsix")) {
      document.body.classList.add("vsix");
    }

    var target = document.getElementById("target");
    var files = JSON.parse(e.data.f);
    var keys = Object.keys(files);
    for (var c = 0; c < keys.length; c++) {
      var p = document.createElement("p");
      p.innerText = keys[c];
      if (files[keys[c]].dir) {
        p.classList.add("folder");
        p.title = "Can't get a preview of a folder.";
      } else {
        p.addEventListener("click", function () {
          vscode.postMessage({ command: "get", uri: this.innerText });
          console.debug("Request for info posted");
        });
      }

      target.appendChild(p);
    }
  } else if (e.data.command === "content") {
    console.debug("Received response");
    /**
     * @type {HTMLDivElement}
     */
    var preview = document.getElementById("preview");
    /**
     * @type {HTMLHeadingElement}
     */
    var previewTitle = document.getElementById("uri");
    if (e.data.type === "string") {
      console.debug("Response is type string");
      preview.innerHTML = "";
      var t = document.createElement("textarea");
      t.readOnly = true;
      t.innerHTML = e.data.string;
      preview.appendChild(t);
    } else if (e.data.type === "image") {
      console.debug("Response is type image");
      preview.innerHTML = "";
      var i = document.createElement("img");
      i.src = `data:${mime["." + e.data.ext]};base64,${e.data.base64}`;
      preview.appendChild(i);
    }
    previewTitle.innerText = e.data.uri;
    preview.scrollIntoView({ behavior: "smooth" });
  }
});
