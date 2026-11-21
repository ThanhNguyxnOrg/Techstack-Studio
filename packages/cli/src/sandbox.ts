import path from 'node:path';

/**
 * Resolves a caller-supplied path. When rootDir is configured (via --root or
 * TECHSTACK_STUDIO_ROOT), enforces that the resolved target stays inside rootDir
 * to prevent path traversal.
 */
export function resolveSafePath(inputPath: string, rootDir?: string): string {
  if (!inputPath || !inputPath.trim()) {
    throw new Error('Path must not be empty.');
  }
  if (!rootDir) {
    return path.resolve(inputPath);
  }
  const resolvedRoot = path.resolve(rootDir);
  const resolvedTarget = path.isAbsolute(inputPath)
    ? path.resolve(inputPath)
    : path.resolve(resolvedRoot, inputPath);
  const rel = path.relative(resolvedRoot, resolvedTarget);
  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    throw new Error(`Path "${inputPath}" escapes the configured root directory "${resolvedRoot}".`);
  }
  return resolvedTarget;
}
