import { parse, resolve } from 'path';
import { promises as fs, existsSync } from 'fs';
import fg from 'fast-glob';
import { name } from '../package.json';

const baseDir = resolve(__dirname, '../');

async function run() {
  const files = await fg('**/VMap*.vue', {
    absolute: true,
    cwd: resolve(__dirname, '../src')
  });
  const components: string[] = [];
  for (const file of files) {
    components.push(parse(file).name);
  }
  const fileContent = `// GlobalComponents for Volar
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    ${components
      .map(
        componentName =>
          `${componentName}: typeof import('${name}')['${componentName}'];`
      )
      .join('\n    ')}
  }
}

export {};
`;
  if (!existsSync(baseDir)) {
    await fs.mkdir(baseDir);
  }
  await fs.writeFile(resolve(baseDir, 'global.d.ts'), fileContent);
}

run();
