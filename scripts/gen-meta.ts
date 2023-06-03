import { parse, resolve } from 'path';
import { promises as fs, existsSync } from 'fs';
import fg from 'fast-glob';

const baseDir = resolve(__dirname, '../dist');

async function run() {
  const files = await fg('**/VMap*.vue', {
    absolute: true,
    cwd: resolve(__dirname, '../src')
  });
  const components: string[] = [];
  for (const file of files) {
    components.push(parse(file).name);
  }
  const fileContent = JSON.stringify(components, null, 2);
  if (!existsSync(baseDir)) {
    await fs.mkdir(baseDir);
  }
  await fs.writeFile(resolve(baseDir, 'components.json'), fileContent);
}

run();
