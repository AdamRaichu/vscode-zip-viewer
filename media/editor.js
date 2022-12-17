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
    for (var i = 0; i < keys.length; i++) {
      var p = document.createElement("p");
      p.innerText = keys[i];
      if (files[keys[i]].dir) {
        p.classList.add("folder");
      }

      document.body.appendChild(p);
    }
  }
});
