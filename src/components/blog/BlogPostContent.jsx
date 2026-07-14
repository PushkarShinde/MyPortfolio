import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';

/**
 * Custom component mappings for react-markdown.
 * Applies the portfolio's font stack and color scheme to all markdown elements.
 */
const markdownComponents = {
  h1: ({ children }) => (
    <h1 className="mt-10 mb-4 font-syne font-bold text-3xl text-white">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-10 mb-4 font-syne font-bold text-2xl text-white">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-8 mb-3 font-syne font-semibold text-xl text-white">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="mt-6 mb-2 font-syne font-semibold text-lg text-white">{children}</h4>
  ),
  p: ({ children }) => (
    <p className="mb-5 font-dm-sans text-base leading-relaxed text-neutral-300">{children}</p>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-lime hover:underline underline-offset-2 transition-colors duration-200"
    >
      {children}
    </a>
  ),
  strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
  em: ({ children }) => <em className="text-neutral-300 italic">{children}</em>,
  ul: ({ children }) => (
    <ul className="mb-5 ml-6 list-disc space-y-1.5 font-dm-sans text-neutral-300">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-5 ml-6 list-decimal space-y-1.5 font-dm-sans text-neutral-300">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="my-6 pl-5 border-l-2 border-lime/60 italic text-neutral-400 font-dm-sans">
      {children}
    </blockquote>
  ),
  hr: () => (
    <div className="my-8 bg-gradient-to-r from-transparent via-neutral-700 to-transparent h-[1px] w-full" />
  ),
  code: ({ className, children, ...props }) => {
    // Inline code (no language class) vs code blocks (has className from rehype-highlight)
    const isBlock = className?.startsWith('hljs') || className?.startsWith('language-');
    if (isBlock) {
      return (
        <code className={`${className || ''} font-jetbrains text-sm`} {...props}>
          {children}
        </code>
      );
    }
    return (
      <code className="font-jetbrains text-sm bg-white/10 text-lime/90 rounded px-1.5 py-0.5">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="my-6 p-5 rounded-xl bg-midnight/80 border border-white/10 overflow-x-auto
                    scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-sm font-dm-sans">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-white/5">{children}</thead>,
  th: ({ children }) => (
    <th className="px-4 py-3 text-left font-semibold text-white border-b border-white/10">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-3 text-neutral-300 border-b border-white/5">{children}</td>
  ),
  img: ({ src, alt }) => (
    <figure className="my-6">
      <img src={src} alt={alt || ''} className="w-full rounded-xl shadow-lg" loading="lazy" />
      {alt && <figcaption className="mt-2 text-center text-xs text-neutral-500">{alt}</figcaption>}
    </figure>
  ),
};

const BlogPostContent = ({ content }) => {
  return (
    <article className="blog-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
};

export default BlogPostContent;
