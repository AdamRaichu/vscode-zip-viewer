# Known Issues

Below is a list of known issues and the versions they affect.

## Subfolder contents not included when zipping a folder

- Status: Fixed
- Affects: All versions <= v3.4.3
- Issue: [#26](https://github.com/AdamRaichu/vscode-zip-viewer/issues/26)

When zipping a folder with the command `zipViewer.zip`, the zipped file, although readable as expected by JSZip (and therefore the extension), did not correctly compress subfolders and their contents (tested on Windows).
