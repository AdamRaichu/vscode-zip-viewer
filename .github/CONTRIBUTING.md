# Contributing

All changes should be proposed in an issue and/or pull request. Below are guidelines for specific scenarios.

## Adding/updating a `package.nsl.*.json file`

A separate pull request should be made for each file created/changed.

## Adding a new file extension to editors

To allow the editor to recognize a new file extension, there are a couple places you need to edit.

- `{package.json}.contributes.customEditors`
- **(Deprecated)** ~~`{package.json}.contributes.configuration[0].properties.["zipViewer.zipTypes"].default` (Regular Zip only)~~
- README ~L50 for Zip, ~L135 for GZip
- Bump package version [min].
- Update CHANGELOG.

Sample commit message:

```
add `.ext` file extension to supported list

bump package version [min]

update changelog
```

Once you edit those places, go ahead and make a pull request.
