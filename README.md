# VSCode Zip Viewer <!-- markdownlint-disable MD033 -->

<div align="center">

[![Last Updated](https://img.shields.io/visual-studio-marketplace/last-updated/adamraichu.zip-viewer?color=%2300008b&logo=visual%20studio%20code&logoColor=%23007ACC)](https://marketplace.visualstudio.com/items?itemName=AdamRaichu.zip-viewer)
[![VSCode Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/adamraichu.zip-viewer?color=00008b&logo=Visual%20Studio%20Code&logoColor=%23007ACC)](https://marketplace.visualstudio.com/items?itemName=AdamRaichu.zip-viewer)
[![Install Count](https://img.shields.io/visual-studio-marketplace/i/adamraichu.zip-viewer?color=darkblue&label=Install%20Count&logo=visual%20studio%20code&logoColor=%23007ACC)](https://marketplace.visualstudio.com/items?itemName=AdamRaichu.zip-viewer)
[![Rating](https://img.shields.io/visual-studio-marketplace/stars/adamraichu.zip-viewer?color=darkblue&label=Rating&logo=visual%20studio%20code&logoColor=%23007ACC)](https://marketplace.visualstudio.com/items?itemName=AdamRaichu.zip-viewer&ssr=false#review-details)

[![GitHub issues](https://img.shields.io/github/issues/adamraichu/vscode-zip-viewer)](https://github.com/adamraichu/vscode-zip-viewer/issues)
[![GitHub stars](https://img.shields.io/github/stars/adamraichu/vscode-zip-viewer)](https://github.com/adamraichu/vscode-zip-viewer/stargazers)
[![GitHub license](https://img.shields.io/github/license/adamraichu/vscode-zip-viewer)](https://github.com/AdamRaichu/vscode-zip-viewer/blob/main/LICENSE)

</div>

An extension which allows for the manipulation of zip files in VS Code.

## Usage

### Supported File Types

All functions for this extension are designed to support the following built-in list.
If you know of another alias for zip files, please open an issue [here][new-zip-type].

- `.zip`
- `.vsix`
- `.mcworld`
- `.mcpack`
- `.mcaddon`
- `.jar`

### Installation

Install from the VSCode Extension panel.
Search `adamraichu.zip-viewer`.

### Viewing Zip File Contents

The editor will display a list of the files inside the zip being previewed.
Next to each file name is a `Get Preview` button.
Clicking on this button will, if available for the file type, display the contents below.
If the type is not available to the preset list, the extension will show an error message.

If you would like to open a zip file with a file extension that does not match the built in list, use the command `Zip Viewer: Open a zip file with the custom editor`.
The extension will prompt you to choose a file.
The file you select will be opened with the zip file editor.

### Creating a Zip

To create a zip file, run the command `Zip Viewer: Create a zip file from folder`.
The extension will prompt you to select a folder to copy & compress.
Then it will prompt you to pick a target folder, where the compressed folder will be stored.
The zip file's name will be of the pattern `<folderToCompressName>.zip`.
You may rename it if you wish.

**Important**: Each file read when creating a zip file applies to your api rate limit, so it is not recommended to zip large folders using this extension.
Exceeding the API limit will cause the process to fail, so consider downloading the folder and zipping locally on your device.

### Extract a Zip

To extract a zip file, run the command `Zip Viewer: Extract (unzip) a zip file from workspace`.
The extension will prompt you to select a zip file, then it will prompt you to choose a target folder.
The contents of the zip file will be deposited in that folder.
The new folder's name will be `<zipFileName><zipViewer.unzippedSuffix>`.

The extension contributes a setting `zipViewer.zipTypes`.
If the file you chose does not end with a string in that array, the extension will give an error message.
You can edit this setting in the settings editor.
This setting is ignored if `zipViewer.picky` is set to false.

## Known Issues

You can view issues [here](https://github.com/AdamRaichu/vscode-zip-viewer/issues).

## Changelog

You can view the changelog [here](CHANGELOG.md).

## See Also

If you found this extension useful, you may also enjoy [PDF Viewer][pdf-viewer] or [Font Preview][font-preview]

[new-zip-type]: https://github.com/AdamRaichu/vscode-zip-viewer/issues/new?assignees=AdamRaichu&labels=enhancement%2Cgood+first+issue&template=suggest_ext.yml&title=%5BFeature%5D+Suggested+file+extension%3A+
[pdf-viewer]: https://marketplace.visualstudio.com/items?itemName=AdamRaichu.pdf-viewer
[font-preview]: https://marketplace.visualstudio.com/items?itemName=AdamRaichu.zip-viewer
