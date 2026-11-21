export const TECHSTACK_MARKER_START = '<!-- techstack-studio:start -->';
export const TECHSTACK_MARKER_END = '<!-- techstack-studio:end -->';

export interface PatchReadmeOptions {
  heading?: string;
}

export interface PatchReadmeResult {
  content: string;
  mode: 'updated' | 'appended';
  changed: boolean;
}

/**
 * Idempotently inserts or replaces a generated tech stack block inside a README
 * between <!-- techstack-studio:start --> and <!-- techstack-studio:end --> markers.
 * Throws if markers are unbalanced so surrounding README content is never corrupted.
 */
export function patchReadmeContent(
  readme: string,
  block: string,
  options: PatchReadmeOptions = {}
): PatchReadmeResult {
  const eol = readme.includes('\r\n') ? '\r\n' : '\n';
  const normalizedBlock = block.trim().replace(/\r?\n/g, eol);
  const managed = `${TECHSTACK_MARKER_START}${eol}${normalizedBlock}${eol}${TECHSTACK_MARKER_END}`;

  const startIdx = readme.indexOf(TECHSTACK_MARKER_START);
  const endIdx = readme.indexOf(TECHSTACK_MARKER_END);

  if (startIdx !== -1 && endIdx === -1) {
    throw new Error(
      `Found ${TECHSTACK_MARKER_START} without matching ${TECHSTACK_MARKER_END}. Refusing to overwrite README.`
    );
  }
  if (startIdx === -1 && endIdx !== -1) {
    throw new Error(
      `Found ${TECHSTACK_MARKER_END} without matching ${TECHSTACK_MARKER_START}. Refusing to overwrite README.`
    );
  }
  if (startIdx !== -1 && endIdx < startIdx) {
    throw new Error(
      `Found ${TECHSTACK_MARKER_END} before ${TECHSTACK_MARKER_START}. Refusing to overwrite README.`
    );
  }

  if (startIdx !== -1 && endIdx !== -1) {
    const before = readme.slice(0, startIdx);
    const after = readme.slice(endIdx + TECHSTACK_MARKER_END.length);
    const next = `${before}${managed}${after}`;
    return {
      content: next,
      mode: 'updated',
      changed: next !== readme,
    };
  }

  const heading = options.heading === undefined ? '## Tech Stack' : options.heading.trim();
  const section = heading ? `${heading}${eol}${eol}${managed}${eol}` : `${managed}${eol}`;
  const trimmedEnd = readme.replace(/[ \t\r\n]+$/, '');
  const next = trimmedEnd ? `${trimmedEnd}${eol}${eol}${section}` : section;

  return {
    content: next,
    mode: 'appended',
    changed: next !== readme,
  };
}
