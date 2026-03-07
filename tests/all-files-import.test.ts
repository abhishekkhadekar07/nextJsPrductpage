import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { readdirSync } from 'node:fs';

const SOURCE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx']);
const ROOT_DIR = path.resolve(__dirname, '..');

function collectSourceFiles(relativeDir: string): string[] {
  const absoluteDir = path.join(ROOT_DIR, relativeDir);
  const entries = readdirSync(absoluteDir, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const entryRelativePath = path.join(relativeDir, entry.name);
    if (entry.isDirectory()) {
      return collectSourceFiles(entryRelativePath);
    }
    const extension = path.extname(entry.name).toLowerCase();
    const isTestFile = /\.test\.(ts|tsx|js|jsx)$/.test(entry.name);
    if (!SOURCE_EXTENSIONS.has(extension) || isTestFile) return [];
    return [entryRelativePath];
  });
}

const fileTargets = [
  ...collectSourceFiles('app'),
  ...collectSourceFiles('lib'),
  ...collectSourceFiles('store'),
  'proxy.ts',
  'next.config.ts',
];

describe('Source Module Imports', () => {
  it.each(fileTargets)('imports %s', async (relativeFilePath) => {
    const absolutePath = path.join(ROOT_DIR, relativeFilePath);
    const moduleUrl = pathToFileURL(absolutePath).href;
    const importedModule = await import(moduleUrl);
    expect(importedModule).toBeTruthy();
  });
});
