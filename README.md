# VSCode Zip Viewer <!-- markdownlint-disable MD033 -->

<div align="center">

[![GitHub issues](https://img.shields.io/github/issues/adamraichu/vscode-zip-viewer)](https://github.com/adamraichu/vscode-zip-viewer/issues)
[![GitHub stars](https://img.shields.io/github/stars/adamraichu/vscode-zip-viewer)](https://github.com/adamraichu/vscode-zip-viewer/stargazers)
[![GitHub license](https://img.shields.io/github/license/adamraichu/vscode-zip-viewer)](https://github.com/AdamRaichu/vscode-zip-viewer/blob/main/LICENSE)

</div>

This extension allows you to unzip zip files in VSCode.

## Usage

### Installation

Install from the VSCode Extension panel.
Search `adamraichu.zip-viewer`.

### Extract a Zip

To extract a zip file, run the command `Zip Viewer: Extract a zip file from workspace`. The extension will prompt you to select a zip file, then it will prompt you to choose a target folder. The contents of the zip file will be deposited in that folder.

The extension contributes a setting `zipViewer.zipTypes`. If the file you chose does not end with a string in that array, the extension will give an error message. You can edit this setting in settings.json. This setting is ignored if `zipViewer.picky` is set to false.

## Known Issues

You can view issues [here](https://github.com/AdamRaichu/vscode-zip-viewer/issues).

## Changelog

You can view the changelog [here](CHANGELOG).
