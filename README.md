# VSCode Zip Viewer <!-- markdownlint-disable MD033 -->

<div align="center">

[![Last Updated](https://img.shields.io/visual-studio-marketplace/last-updated/adamraichu.zip-viewer?color=%2300008b&logo=visual%20studio%20code&logoColor=%23007ACC)](https://marketplace.visualstudio.com/items?itemName=AdamRaichu.zip-viewer)
[![VSCode Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/adamraichu.zip-viewer?color=00008b&logo=Visual%20Studio%20Code&logoColor=%23007ACC)](https://marketplace.visualstudio.com/items?itemName=AdamRaichu.zip-viewer)
[![Install Count](https://img.shields.io/visual-studio-marketplace/i/adamraichu.zip-viewer?color=darkblue&label=Install%20Count&logo=visual%20studio%20code&logoColor=%23007ACC)](https://marketplace.visualstudio.com/items?itemName=AdamRaichu.zip-viewer)
[![Rating](https://img.shields.io/visual-studio-marketplace/stars/adamraichu.zip-viewer?color=darkblue&label=Rating&logo=visual%20studio%20code&logoColor=%23007ACC)][review]

[![GitHub issues by-label](https://img.shields.io/github/issues/adamraichu/vscode-zip-viewer/confirmed?color=orange&logo=github)](https://github.com/AdamRaichu/vscode-zip-viewer/labels/confirmed)
[![GitHub stars](https://img.shields.io/github/stars/adamraichu/vscode-zip-viewer)][stargazers]
[![GitHub license](https://img.shields.io/github/license/adamraichu/vscode-zip-viewer)](https://github.com/AdamRaichu/vscode-zip-viewer/blob/main/LICENSE)

</div>

An extension which allows for the manipulation of zip files in VS Code.

## Learn how it works with a video (click below)

[![Video Thumbnail](./thumbnail.jpg)](https://youtu.be/eMttQGBadaI)

> This extension recently hit 1000 downloads.
> It's crazy to think that 1000 people have seen something that I built!
>
> If this extension has helped you at all, please consider [leaving a review][review] on the marketplace and/or [starring the repository][stargazers] on GitHub.

- [Installation](#installation)
- [Usage (Regular Zip Compression)](#usage-regular-zip-compression)
  - [Supported File Types](#supported-file-types)
  - [Viewing Zip File Contents (Custom Editor)](#viewing-zip-file-contents-custom-editor)
  - [Creating a Zip](#creating-a-zip)
  - [Extract a Zip](#extract-a-zip)
    - [Selective Extraction](#selective-extraction)
- [Usage (GNU Zip Compression)](#usage-gnu-zip-compression)
  - [Supported File Types (gzip)](#supported-file-types-gzip)
- [Known Issues](#known-issues)
- [Changelog](#changelog)
- [See Also](#see-also)

## Installation

Install from the VSCode Extension panel.
Search `adamraichu.zip-viewer`.

## Usage (Regular Zip Compression)

### Supported File Types

All functions for this extension are designed to support the following built-in list.
If you know of another alias for zip files, please open an issue [here][new-zip-type].

- `.crx`
- `.ipa`
- `.jar`
- `.mcaddon`
- `.mcpack`
- `.mcproject`
- `.mctemplate`
- `.mcworld`
- `.pbit`
- `.pbix`
- `.vsix`
- `.xlsx`
- and of course, `.zip`

### Viewing Zip File Contents (Custom Editor)

The editor will display a list of the files inside the zip being previewed.
Next to each file name is a `Get Preview` button.
Clicking on this button will, if available for the file type, display the contents below.
If the type is not available to the preset list, the extension will show an error message.

You tell the extension that the file you would like to preview is a text file.
If you do so, it will preview it as if it were a text file.
Selecting this option will generate another prompt, asking if you would like to always open this file as a text file.
Selecting "Yes" will update `settings.json` in the `.vscode` folder of the workspace.

If you would like to open a zip file with a file extension that does not match the built in list, use the command `Zip Tools: Open a zip file with the custom editor`.
The extension will prompt you to choose a file.
The file you select will be opened with the zip file editor.

#### Selective Extraction

Next to each file name there is a checkbox.
At the top of the editor is a button labeled `Extract Selected Files Only`.
When you click that button, the extension will prompt you to select a Target Folder.
The extension will then extract the selected files to that location.

### Creating a Zip

To create a zip file, run the command `Zip Tools: Create a zip file from folder`.
The extension will prompt you to select a folder to copy & compress.
The zip file's name will be of the pattern `<folderToCompressName>.zip`.
The zip file will be created in the same folder as the folder you zipped.

Alternatively, you can right click a folder in the Explorer menu, and select the command name in the context menu.

> **Important**: Each file read when creating a zip file applies to your api rate limit, so it is not recommended to zip large folders using this extension.
> Exceeding the API limit will cause the process to fail, so consider downloading the folder and zipping locally on your device.

### Extract a Zip

To extract a zip file, run the command `Zip Tools: Extract (unzip) a zip file from workspace`.
The extension will prompt you to select a zip file, then it will prompt you to choose a target folder.
The contents of the zip file will be deposited in that folder.
The new folder's name will be `<zipFileName><zipViewer.unzippedSuffix>`.

**(Deprecated)** ~~The extension contributes a setting `zipViewer.zipTypes`. If the file you chose does not end with a string in that array, the extension will give an error message.You can edit this setting in the settings editor. This setting is ignored if `zipViewer.picky` is set to false.~~

## Usage (GNU Zip Compression)

The extension now contributes a custom "editor" for files compressed with GNU Zip (gzip) compression.

When you open a file with one of the following file extensions, the extension will decompress the file, and write a new file to the workspace.
Here is an example demonstrating the naming convention.

You open a file called `smile.svg.svgz`.
The extension decompresses it, and creates a file called `smile<unzippedSuffix>.svg`.

You can disable this editor by setting `zipViewer.gzipEditorEnabled` to false.

You can compress a file by right clicking it in the explorer menu, or running the command `Zip Tools: Compress file with GZip compression.`

### Supported File Types (gzip)

- `.gz`
- `.gzip`
- `.svgz`
- `.emz`
- `.tg`
- `.tgz`

## Known Issues

You can view issues [here][known-issues].

## Changelog

You can view the changelog [here](CHANGELOG.md).

## See Also

If you found this extension useful, you may also want to check out [PDF Viewer][pdf-viewer], [Font Preview][font-preview], or [Docx Renderer][docx-renderer].

[new-zip-type]: https://github.com/AdamRaichu/vscode-zip-viewer/issues/new?assignees=AdamRaichu&labels=enhancement%2Cgood+first+issue&template=suggest_ext.yml&title=%5BFeature%5D+Suggested+file+extension%3A+
[pdf-viewer]: https://marketplace.visualstudio.com/items?itemName=AdamRaichu.pdf-viewer
[font-preview]: https://marketplace.visualstudio.com/items?itemName=AdamRaichu.font-viewer
[review]: https://marketplace.visualstudio.com/items?itemName=AdamRaichu.zip-viewer&ssr=false#review-details
[stargazers]: https://github.com/adamraichu/vscode-zip-viewer/stargazers
[known-issues]: https://github.com/AdamRaichu/vscode-zip-viewer/blob/main/known_issues.md
[docx-renderer]: https://marketplace.visualstudio.com/items?itemName=AdamRaichu.docx-viewer
