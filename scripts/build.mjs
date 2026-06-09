import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const dist = join(root, 'dist');

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

await cp(join(root, 'index.html'), join(dist, 'index.html'));
await cp(join(root, 'src'), join(dist, 'src'), { recursive: true });
await cp(join(root, 'docs'), join(dist, 'docs'), { recursive: true });
await cp(join(root, 'README.md'), join(dist, 'README.md'));
await cp(join(root, 'index.html'), join(dist, '404.html'));
await writeFile(join(dist, '.nojekyll'), '');

console.log('Built static site in dist/');
