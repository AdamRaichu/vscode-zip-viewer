/**
 * @file media/ZipEditor.js provides scripts for use in ZipEdit
 */

/**
 *
 */
const vscode = acquireVsCodeApi();
const uikit = require("@vscode/webview-ui-toolkit");
const oldState = vscode.getState();
var currentState = {};
if (oldState) {
  currentState = JSON.parse(JSON.stringify(oldState));
  displayFileList(oldState.files);
  displaySubfilePreview(oldState.previewData);
}

uikit.provideVSCodeDesignSystem().register(uikit.vsCodeButton(), uikit.vsCodeCheckbox());

/**
 * @type {HTMLButtonElement}
 */
var extract = document.getElementById("extract-select");
extract.addEventListener("click", function () {
  /**
   * @type {NodeListOf<HTMLInputElement>}
   */
  var boxes = document.querySelectorAll("#target vscode-checkbox");
  /**
   * @type {NodeListOf<HTMLSpanElement>}
   */
  var selected = [];
  for (var i = 0; i < boxes.length; i++) {
    if (boxes[i].checked) {
      selected.push(boxes[i].nextElementSibling.nextElementSibling.innerText);
    }
  }
  vscode.postMessage({ command: "selective-extract", uriList: JSON.stringify(selected) });
});

function displayFileList(files) {
  document.getElementById("loading")?.remove();

  currentState.files = files;
  vscode.setState(currentState);

  var target = document.getElementById("target");
  var keys = Object.keys(files);
  for (var c = 0; c < keys.length; c++) {
    if (files[keys[c]].dir) {
      continue;
    }
    var d = document.createElement("div");

    var i = document.createElement("vscode-checkbox");

    var p = document.createElement("vscode-button");
    p.innerText = "Get Preview";
    p.addEventListener("click", function () {
      vscode.postMessage({ command: "get", uri: this.nextElementSibling.innerText });
    });

    var l = document.createElement("span");
    l.innerText = keys[c];

    d.appendChild(i);
    d.appendChild(p);
    d.appendChild(l);
    target.appendChild(d);
  }
}

function displaySubfilePreview(data) {
  if (typeof data === "undefined") {
    return;
  }

  currentState.previewData = data;
  vscode.setState(currentState);

  /**
   * @type {HTMLDivElement}
   */
  var preview = document.getElementById("preview");
  /**
   * @type {HTMLHeadingElement}
   */
  var previewTitle = document.getElementById("uri");
  if (data.type === "string") {
    preview.innerHTML = "";
    var t = document.createElement("textarea");
    t.readOnly = true;
    t.innerHTML = data.string;
    preview.appendChild(t);
  } else if (data.type === "image") {
    preview.innerHTML = "";
    var i = document.createElement("img");
    i.src = `data:${mime["." + data.ext]};base64,${data.base64}`;
    preview.appendChild(i);
  }
  previewTitle.innerText = data.uri;
  preview.scrollIntoView({ behavior: "smooth" });
}

window.addEventListener("message", (e) => {
  if (e.data.command === "files") {
    displayFileList(JSON.parse(e.data.f));
  } else if (e.data.command === "content") {
    displaySubfilePreview(e.data);
  }
});
