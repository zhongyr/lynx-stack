import { CSSCustomSectionWebpackPlugin } from '../../../../lib/index.js';
import {
  LynxEncodePlugin,
  LynxTemplatePlugin,
} from '@lynx-js/template-webpack-plugin';

/** @type {import('@rspack/core').Configuration} */
export default {
  target: 'node',
  plugins: [
    new LynxEncodePlugin(),
    new LynxTemplatePlugin(),
    (compiler) => {
      compiler.hooks.thisCompilation.tap(
        'existing-custom-section',
        compilation => {
          const hooks = LynxTemplatePlugin.getLynxTemplatePluginHooks(
            compilation,
          );
          hooks.beforeEncode.tap('existing-custom-section', (args) => {
            args.encodeData.customSections.existing = {
              content: 'existing content',
            };
            return args;
          });
        },
      );
    },
    new CSSCustomSectionWebpackPlugin({
      cssPath: './custom-sections/css/custom.css',
      passKey: 'shared-styles',
    }),
  ],
};
