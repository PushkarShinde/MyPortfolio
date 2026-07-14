import { Link } from 'react-router-dom';
import { getCategoryIcon } from './icons/categoryIconMap';

const BlogPostHeader = ({ post }) => {
  const Icon = getCategoryIcon(post.category);

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="mb-10">
      {/* Back link */}
      <Link
        to="/blogs"
        className="inline-flex items-center gap-2 text-sm font-dm-sans text-neutral-400
                   hover:text-lime transition-colors duration-200 mb-8 group"
      >
        <svg
          className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M13 8H3M7 4l-4 4 4 4" />
        </svg>
        Back to blogs
      </Link>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-3 text-sm font-dm-sans">
        <span className="text-lime">
          <Icon className="size-5" />
        </span>
        <span className="px-2.5 py-0.5 rounded-full bg-lime/10 text-lime font-medium">
          {post.category}
        </span>
        <span className="text-neutral-500">{formattedDate}</span>
        <span className="text-neutral-600">·</span>
        <span className="text-neutral-500">{post.readTime}</span>
      </div>

      {/* Title */}
      <h1 className="mt-5 font-syne font-bold text-3xl md:text-5xl text-white leading-tight">
        {post.title}
      </h1>

      {/* Divider */}
      <div className="mt-8 bg-gradient-to-r from-transparent via-neutral-700 to-transparent h-[1px] w-full" />
    </header>
  );
};

export default BlogPostHeader;
