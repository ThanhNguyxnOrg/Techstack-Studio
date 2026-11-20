// Minimal XML reader/writer for the machine-made SVGs in this repo.
// Keeps attribute order so a round trip changes nothing it does not need to.

const ENTITY = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };

export function parseXml(source) {
  const root = { tag: '#root', attrs: [], children: [] };
  const stack = [root];
  const re =
    /<!--[\s\S]*?-->|<!\[CDATA\[([\s\S]*?)\]\]>|<\?[\s\S]*?\?>|<!DOCTYPE[^>]*>|<\/([A-Za-z][\w:.-]*)\s*>|<([A-Za-z][\w:.-]*)((?:\s+[\w:.-]+\s*=\s*(?:"[^"]*"|'[^']*'))*)\s*(\/?)>|([^<]+)/g;
  let m;
  while ((m = re.exec(source)) !== null) {
    const top = stack[stack.length - 1];
    if (m[1] !== undefined) top.children.push({ tag: '#text', text: m[1], cdata: true });
    else if (m[2]) {
      if (stack.length > 1) stack.pop();
    } else if (m[3]) {
      const node = { tag: m[3], attrs: parseAttrs(m[4] || ''), children: [] };
      top.children.push(node);
      if (!m[5]) stack.push(node);
    } else if (m[6] !== undefined) {
      if (m[6].trim()) top.children.push({ tag: '#text', text: m[6] });
    }
  }
  return root;
}

function parseAttrs(raw) {
  const out = [];
  const re = /([\w:.-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
  let m;
  while ((m = re.exec(raw)) !== null) {
    const value = (m[2] ?? m[3]).replace(/&(amp|lt|gt|quot|apos);/g, (_, e) => ENTITY[e]);
    out.push([m[1], value]);
  }
  return out;
}

const escAttr = (v) =>
  String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

export function serialize(node) {
  if (Array.isArray(node)) return node.map(serialize).join('');
  if (node.tag === '#root') return serialize(node.children);
  if (node.tag === '#text') return node.cdata ? `<![CDATA[${node.text}]]>` : node.text;
  if (node.tag === '#raw') return node.text;
  const attrs = node.attrs.map(([k, v]) => ` ${k}="${escAttr(v)}"`).join('');
  if (!node.children.length) return `<${node.tag}${attrs}/>`;
  return `<${node.tag}${attrs}>${serialize(node.children)}</${node.tag}>`;
}

export const getAttr = (node, name) => {
  const hit = node.attrs?.find(([k]) => k === name);
  return hit ? hit[1] : null;
};

export const setAttr = (node, name, value) => {
  const hit = node.attrs.find(([k]) => k === name);
  if (value === null || value === undefined) {
    node.attrs = node.attrs.filter(([k]) => k !== name);
  } else if (hit) hit[1] = String(value);
  else node.attrs.push([name, String(value)]);
};

export const el = (tag, attrs = {}, children = []) => ({
  tag,
  attrs: Object.entries(attrs).filter(([, v]) => v !== undefined && v !== null),
  children,
});

export const raw = (text) => ({ tag: '#raw', text });

export function walk(node, fn, parents = []) {
  if (fn(node, parents) === false) return;
  for (const child of node.children || []) walk(child, fn, [...parents, node]);
}

/** Inline `style="a:b;c:d"` into presentation attributes so inheritance is visible. */
export function styleValue(node, name) {
  const direct = getAttr(node, name);
  const style = getAttr(node, 'style');
  if (style) {
    const m = new RegExp(`(?:^|;)\\s*${name}\\s*:\\s*([^;]+)`).exec(style);
    if (m) return m[1].trim();
  }
  return direct;
}
