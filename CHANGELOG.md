# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

View files in a zip as a tree.

## [1.2.0] - 2022-11-23 (1.1.3-pre)

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
