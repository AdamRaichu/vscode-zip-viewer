/**
 * @file media/editor.js provides scripts for use in ZipEdit
 */

/**
 *
 */
const vscode = acquireVsCodeApi();

document.addEventListener("DOMContentLoaded", function () {
  vscode.postMessage({ command: "DOMContentLoaded" });
  /**
   * @type {HTMLButtonElement}
   */
  var extract = this.getElementById("extract-select");
  extract.addEventListener("click", function () {
    /**
     * @type {NodeListOf<HTMLInputElement>}
     */
    var boxes = document.querySelectorAll("#target input[type=checkbox]");
    /**
     * @type {NodeListOf<HTMLSpanElement>}
     */
    var selected = [];
    for (var i = 0; i < boxes.length; i++) {
      if (boxes[i].checked) {
        selected.push(boxes[i].nextElementSibling.innerText);
      }
    }
    vscode.postMessage({ command: "selective-extract", uriList: JSON.stringify(selected) });
  });
});

window.addEventListener("message", (e) => {
  if (e.data.command === "files") {
    document.getElementById("loading").remove();

    var target = document.getElementById("target");
    var files = JSON.parse(e.data.f);
    var keys = Object.keys(files);
    for (var c = 0; c < keys.length; c++) {
      if (files[keys[c]].dir) {
        continue;
      }
      var d = document.createElement("div");
      var i = document.createElement("input");
      i.type = "checkbox";
      d.appendChild(i);

      var p = document.createElement("span");
      p.innerText = keys[c];
      p.addEventListener("click", function () {
        vscode.postMessage({ command: "get", uri: this.innerText });
      });

      d.appendChild(p);
      target.appendChild(d);
    }
  } else if (e.data.command === "content") {
    /**
     * @type {HTMLDivElement}
     */
    var preview = document.getElementById("preview");
    /**
     * @type {HTMLHeadingElement}
     */
    var previewTitle = document.getElementById("uri");
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
    previewTitle.innerText = e.data.uri;
    preview.scrollIntoView({ behavior: "smooth" });
  }
});
