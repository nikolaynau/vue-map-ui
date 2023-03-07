import { parse, resolve } from 'path';
import { promises as fs, existsSync } from 'fs';
import fg from 'fast-glob';
import { name as libraryName } from '../package.json';

const baseDir = resolve(__dirname, '../dist/types');
const mainDts = resolve(baseDir, 'index.d.ts');

async function run() {
  const files = await fg('**/VMap*.vue', {
    absolute: true,
    cwd: resolve(__dirname, '../src')
  });
  const components: Array<{ name: string; attrsType }> = [];
  for (const file of files) {
    const name = parse(file).name;
    const attrsType = `${name.slice(1)}Attributes`;
    components.push({ name, attrsType });
  }
  const fileContent = `declare global {
  namespace JSX {
    interface IntrinsicElements {
      ${components
        .map(
          ({ name, attrsType }) =>
            `${name}: import('${libraryName}').${attrsType};`
        )
        .join('\n      ')}
    }
  }
}

export {};
`;
  if (!existsSync(baseDir)) {
    await fs.mkdir(baseDir);
  }
  await fs.writeFile(resolve(baseDir, 'attrs.d.ts'), fileContent);

  if (!existsSync(mainDts)) {
    throw new Error('Main declaration file not found. Abort');
  }

  let dtsContent = (await fs.readFile(mainDts)).toString();
  dtsContent = '/// <reference path="attrs.d.ts" />\n\n' + dtsContent;

  await fs.writeFile(mainDts, dtsContent);
}

run();
