// Copyright 2026 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import path from 'node:path';

import type { Compiler } from '@rspack/core';

import { cssChunksToMap } from '@lynx-js/css-serializer';
import type { Plugin as CSSPlugin } from '@lynx-js/css-serializer';
import { LynxTemplatePlugin } from '@lynx-js/template-webpack-plugin';

/**
 * The options for {@link CSSCustomSectionWebpackPlugin}.
 *
 * @public
 */
export interface CSSCustomSectionWebpackPluginOptions {
  /**
   * The CSS file to serialize. Relative paths are resolved from the Rspack
   * compiler context.
   */
  cssPath: string;

  /**
   * The key used by the Lynx runtime to retrieve the custom section.
   */
  passKey: string;

  /**
   * Plugins passed to the CSS serializer.
   */
  cssPlugins?: CSSPlugin[];
}

/**
 * Serializes a CSS file into a TASM custom section.
 *
 * @public
 */
export class CSSCustomSectionWebpackPlugin {
  name = 'CSSCustomSectionWebpackPlugin';

  constructor(
    private options: CSSCustomSectionWebpackPluginOptions,
  ) {}

  apply(compiler: Compiler): void {
    const cssPath = path.resolve(compiler.context, this.options.cssPath);

    compiler.hooks.thisCompilation.tap(this.name, (compilation) => {
      compilation.fileDependencies.add(cssPath);

      const hooks = LynxTemplatePlugin.getLynxTemplatePluginHooks(compilation);

      hooks.beforeEncode.tapPromise(this.name, async (args) => {
        const inputFileSystem = compiler.inputFileSystem;
        if (!inputFileSystem) {
          throw new compiler.webpack.WebpackError(
            'The Rspack input file system is not available.',
          );
        }

        const css = await new Promise<string>((resolve, reject) => {
          inputFileSystem.readFile(cssPath, (error, content) => {
            if (error) {
              reject(
                new compiler.webpack.WebpackError(
                  `Failed to read CSS file "${cssPath}": ${error.message}`,
                ),
              );
              return;
            }

            resolve(content?.toString() ?? '');
          });
        });

        const { cssMap } = cssChunksToMap(
          [css],
          this.options.cssPlugins ?? [],
          args.encodeData.compilerOptions.enableCSSSelector,
        );

        args.encodeData.customSections = {
          ...args.encodeData.customSections,
          [this.options.passKey]: {
            encoding: 'CSS',
            content: {
              ruleList: cssMap[0] ?? [],
            },
          },
        };

        return args;
      });
    });
  }
}
