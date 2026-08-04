/// <reference types="@rstest/core/globals" />

import fs from 'node:fs/promises';
import path from 'node:path';

it('should serialize CSS into a custom section in tasm.json', async () => {
  const content = await fs.readFile(
    path.resolve(__dirname, '.rspeedy/tasm.json'),
    'utf-8',
  );
  const { customSections } = JSON.parse(content);

  expect(customSections.existing).toStrictEqual({
    content: 'existing content',
  });
  expect(customSections['shared-styles']).toEqual({
    encoding: 'CSS',
    content: {
      ruleList: [
        expect.objectContaining({
          type: 'StyleRule',
          selectorText: expect.objectContaining({ value: '.card' }),
          style: [
            expect.objectContaining({ name: 'color', value: 'red' }),
            expect.objectContaining({ name: 'display', value: 'flex' }),
          ],
        }),
      ],
    },
  });
});
