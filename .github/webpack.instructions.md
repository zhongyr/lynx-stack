---
applyTo: "packages/webpack/**/*"
---

When a webpack plugin needs to modify TASM encode input, tap `LynxTemplatePlugin.getLynxTemplatePluginHooks(compilation).beforeEncode` and merge into `encodeData` instead of editing the emitted bundle.
For file-backed plugin inputs, resolve relative paths from `compiler.context` and add each resolved path to `compilation.fileDependencies` so watch mode rebuilds when the input changes.
