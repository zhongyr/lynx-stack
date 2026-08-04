# @zhongyr/lynx-css-custom-section-webpack-plugin

An unofficial Lynx add-on that serializes a CSS file into a TASM custom
section during an Rspack build. The Lynx runtime can retrieve the section by
the configured `passKey`.

## Installation

```bash
pnpm add -D @zhongyr/lynx-css-custom-section-webpack-plugin
```

The package supports `@lynx-js/template-webpack-plugin` 0.14.x starting at
0.14.1, and Rspack 2.x starting at 2.1.5. Lynx custom sections require Lynx
2.16 or later.

## Usage

```js
import { CSSCustomSectionWebpackPlugin } from '@zhongyr/lynx-css-custom-section-webpack-plugin';

export default {
  tools: {
    rspack(config, { appendPlugins }) {
      appendPlugins(
        new CSSCustomSectionWebpackPlugin({
          cssPath: './src/shared.css',
          passKey: 'shared-styles',
        }),
      );
    },
  },
};
```

Relative `cssPath` values are resolved from the Rspack compiler context. The
file is registered as a compilation dependency, so watch mode rebuilds when it
changes.

The plugin merges the following shape into the encoded TASM data without
overwriting other custom sections:

```json
{
  "customSections": {
    "shared-styles": {
      "encoding": "CSS",
      "content": {
        "ruleList": []
      }
    }
  }
}
```

Pass CSS Serializer plugins through `cssPlugins` when custom parsing behavior
is required.

## License

Apache-2.0. This package is derived from the Lynx Stack project and retains its
original copyright and license notices.
