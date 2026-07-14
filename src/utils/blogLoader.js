import fm from 'front-matter';

// ---------------------------------------------------------------------------
// Build-time markdown loader using Vite 8 glob import API.
// `eager: true`  → resolved at build time, no lazy chunks.
// `query: '?raw'` + `import: 'default'` → each module resolves to the raw
//   file string (replaces the deprecated `{ as: 'raw' }` syntax).
//
// Using `front-matter` instead of `gray-matter` because gray-matter depends
// on Node.js `Buffer` which is unavailable in the browser.
// ---------------------------------------------------------------------------
const modules = import.meta.glob('/content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

/**
 * Parse every markdown file once and cache the result.
 * Each entry contains { attributes (frontmatter), body (markdown content) }.
 */
const parsedPosts = Object.entries(modules).map(([filepath, raw]) => {
  const { attributes, body } = fm(raw);
  return {
    ...attributes,         // title, date, category, excerpt, slug, readTime
    content: body,         // markdown body
    _filepath: filepath,   // retained for debugging, never rendered
  };
});

/**
 * Return all posts sorted by date descending (newest first).
 */
export function getAllPosts() {
  return [...parsedPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

/**
 * Look up a single post by its `slug` frontmatter field.
 * Returns `undefined` when no match is found (caller should handle 404).
 */
export function getPostBySlug(slug) {
  return parsedPosts.find((post) => post.slug === slug);
}

/**
 * Derive the deduplicated, sorted list of categories from all posts.
 * Always includes "All" as the first entry.
 */
export function getCategories() {
  const cats = [...new Set(parsedPosts.map((p) => p.category))].sort();
  return ['All', ...cats];
}
