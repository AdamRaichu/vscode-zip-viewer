# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

Add a progress counter to the preview that updates before content is loaded.

Old to new file extension mappings for gzip decompressor.

## [3.1.0] - 2023-1-31

Add a context menu item to folders in the explorer view.

Remove the target path selection from `zipViewer.zip`.
It would be confusing in the context of the context menu command activation.

## [3.0.0] - 2023-1-28

A new "editor" for files compressed with GNU Zip compression. Supports `.gz`, `.gzip`, `.svgz`, `.emz`, and `.tg`. See README for more information.

Update command `openFileWithEditor` to allow for compression type selection.

## [2.5.0] - 2023-1-25

Add `.xlsx` file extension to built-in supported list ([#15](https://github.com/AdamRaichu/vscode-zip-viewer/issues/15)).

## [2.4.1] - 2023-1-24

Add `.ipa` file extension to built-in supported list.

The default value of the setting `zipViewer.picky` is now `false`.

## [2.3.2] - 2023-1-10

Add `.pbit` and `.pbix` file extensions ([#12](https://github.com/AdamRaichu/vscode-zip-viewer/issues/12)).

## [2.3.0] - 2023-1-2

Selective extraction is now available.
See README for usage.

## [2.2.0] - 2022-12-30

Add command `zipViewer.openFileWithEditor`.
This command allows the user to open a zip file that has a file extension not on the built in list with the custom editor.

## [2.1.7] - 2022-12-26

Support `.jar` files.

## [2.1.0] - 2022-12-22 (2.0.[1-5]-pre)

Internal file list now has a "Get Preview" button.
If the file extension matches a hardcoded list of known type/extension pairs, the editor will display a preview of the file and scroll the preview into view.

## [2.0.1] - 2022-12-17 (2.0.0-pre)

Added:

- Custom Read-only Editor
  - When attempting to open any of the zip types built into the extension (see README), a webview which lists all file names inside the zip file will appear. At this time the interface is very simple, but more is hopefully on the way.

## [1.2.0] - 2022-12-13 (1.1.3-pre)

Added:

- Command "Zip Viewer: Create a zip file from folder" (`AdamRaichu.zipViewer.zip`)
  - Prompts user to select a folder to zip.
  - Prompts user to select a target folder.
  - Creates a file with the name `<folderToZipName>.zip` in the target folder.

## [1.1.2] - 2022-11-21

Extension now has setting `zipViewer.unzippedSuffix`, which controls the string added to the end of file names when unzipping.

## [1.1.1] - 2022-11-19

Extension now has setting `zipViewer.zipTypes` and `zipViewer.picky`. See [1.1.0-pre](#110-pre---2022-11-15) and README.

## [1.1.0-pre] - 2022-11-15

**Note**: This is a pre-release version of the extension. It needs to be manually user-enabled.

Added settings `zipViewer.zipTypes` and `zipViewer.picky`. See README for more information.

## [1.0.0] - 2022-11-12

### Features

- Command "Zip: Extract a zip file from workspace" (`AdamRaichu.zipViewer.extract`)

  - Prompts user to select a zip file and a target folder.
  - Creates a folder in target folder with same name as zip file (minus file extension).
  - Extracts all files to that location.

- Supported File Extensions
  - `.zip`
  - `.vsix`
  - `.mcworld`
  - `.mcpack`
  - `.mcaddon`

---

[_back to top_](#changelog)
