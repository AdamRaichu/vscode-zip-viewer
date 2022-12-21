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
      } else {
        p.addEventListener("click", function () {
          vscode.postMessage({ command: "get", uri: this.innerText });
        });
      }

      target.appendChild(p);
    }
  } else if (e.data.command === "content") {
    var preview = document.getElementById("preview");
    if (e.data.type === "string") {
      preview.innerHTML = "";
      var t = document.createElement("textarea");
      t.readOnly = true;
      t.innerHTML = e.data.string;
      preview.appendChild(t);
    } else if (e.data.type === "image") {
      preview.innerHTML = "";
      var i = document.createElement("img");
      i.src = `data:${mime["." + e.data.ext]};base64,${e.data.base64}`;
      preview.appendChild(i);
    }
    preview.scrollIntoView({ behavior: "smooth" });
  }
});
