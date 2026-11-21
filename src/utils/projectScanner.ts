import fs from 'node:fs';
import path from 'node:path';
import { TechItem } from '../types/stack';
import { detectStackFromFileContent } from './stackDetector';

const MANIFEST_FILENAMES = new Set([
  'package.json',
  'requirements.txt',
  'pyproject.toml',
  'dockerfile',
  'docker-compose.yml',
  'docker-compose.yaml',
  'cargo.toml',
  'go.mod',
  'composer.json',
  'gemfile',
  'pom.xml',
  'build.gradle',
  'build.gradle.kts',
]);

const SKIP_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  '.next',
  '.nuxt',
  '.svelte-kit',
  'vendor',
  'target',
  '.venv',
  'venv',
  '__pycache__',
]);

const MAX_FILE_BYTES = 512 * 1024;

export interface ProjectScanResult {
  ids: string[];
  matchedFiles: string[];
}

function isManifestFile(filename: string): boolean {
  const lower = filename.toLowerCase();
  return MANIFEST_FILENAMES.has(lower) || lower.startsWith('dockerfile.');
}

/**
 * Scans a single manifest file or a project directory (root + depth-1 subdirectories)
 * and extracts canonical Tech Stack Studio icon IDs. Never executes scanned files.
 */
export function scanProjectDirectory(targetPath: string, catalog: TechItem[]): ProjectScanResult {
  const resolved = path.resolve(targetPath);
  if (!fs.existsSync(resolved)) {
    throw new Error(`Path does not exist: ${targetPath}`);
  }

  const stat = fs.statSync(resolved);
  const candidateFiles: string[] = [];

  if (stat.isFile()) {
    candidateFiles.push(resolved);
  } else if (stat.isDirectory()) {
    const entries = fs.readdirSync(resolved, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(resolved, entry.name);
      if (entry.isFile() && isManifestFile(entry.name)) {
        candidateFiles.push(full);
      } else if (entry.isDirectory() && !SKIP_DIRS.has(entry.name) && !entry.name.startsWith('.')) {
        try {
          const subEntries = fs.readdirSync(full, { withFileTypes: true });
          for (const sub of subEntries) {
            if (sub.isFile() && isManifestFile(sub.name)) {
              candidateFiles.push(path.join(full, sub.name));
            }
          }
        } catch {
          // Ignore unreadable subdirectories
        }
      }
    }
  }

  const ids: string[] = [];
  const matchedFiles: string[] = [];

  for (const file of candidateFiles.sort()) {
    try {
      const fStat = fs.statSync(file);
      if (fStat.size > MAX_FILE_BYTES) continue;
      const content = fs.readFileSync(file, 'utf8');
      const detected = detectStackFromFileContent(content, catalog, path.basename(file));
      if (detected.length > 0) {
        matchedFiles.push(
          stat.isDirectory()
            ? path.relative(resolved, file).replace(/\\/g, '/')
            : path.basename(file)
        );
        for (const id of detected) {
          if (!ids.includes(id)) ids.push(id);
        }
      }
    } catch {
      // Skip unreadable files
    }
  }

  return { ids, matchedFiles };
}
