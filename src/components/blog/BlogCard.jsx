import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { getCategoryIcon } from './icons/categoryIconMap';

/**
 * BlogCard — renders a single blog post preview.
 *
 * Two layout modes controlled by `variant`:
 *   "grid"  — vertical card (default, used in the 3-col grid)
 *   "list"  — horizontal compact row
 *
 * Styling reuses the portfolio's existing patterns:
 *   • bg-gradient-to-b from-storm to-indigo  (same as About grid cards)
 *   • border border-white/10                 (glassmorphic border)
 *   • hover:-translate-y-1 duration-200      (.hover-animation)
 *   • accent glow on hover via lime border
 */
const BlogCard = ({ post, variant = 'grid', index = 0 }) => {
  const Icon = getCategoryIcon(post.category);

  // Staggered fade-in per card
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: index * 0.06, duration: 0.4, ease: 'easeOut' },
    },
  };

  if (variant === 'list') {
    return (
      <motion.div variants={cardVariants} initial="hidden" animate="visible">
        <Link
          to={`/blogs/${post.slug}`}
          className="group flex items-start gap-5 p-5 rounded-2xl
                     bg-gradient-to-b from-storm to-indigo
                     border border-white/10
                     transition-all duration-200
                     hover:-translate-y-0.5 hover:border-lime/30
                     hover:shadow-[0_0_20px_-6px_rgba(200,241,53,0.15)]
                     focus-visible:outline-2 focus-visible:outline-lime focus-visible:outline-offset-2"
          aria-label={`Read: ${post.title}`}
        >
          {/* Icon */}
          <span className="shrink-0 mt-1 text-lime">
            <Icon className="size-6" />
          </span>

          {/* Text block */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3 text-xs font-dm-sans">
              <span className="px-2.5 py-0.5 rounded-full bg-lime/10 text-lime font-medium">
                {post.category}
              </span>
              <span className="text-neutral-500">{formatDate(post.date)}</span>
              <span className="text-neutral-600">·</span>
              <span className="text-neutral-500">{post.readTime}</span>
            </div>

            <h3 className="mt-2 text-lg font-syne font-semibold text-white
                           group-hover:text-lime transition-colors duration-200 line-clamp-1">
              {post.title}
            </h3>

            <p className="mt-1 text-sm font-dm-sans text-neutral-400 line-clamp-2">
              {post.excerpt}
            </p>
          </div>
        </Link>
      </motion.div>
    );
  }

  // ── Grid variant (default) ────────────────────────────────────────
  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible">
      <Link
        to={`/blogs/${post.slug}`}
        className="group flex flex-col h-full p-6 rounded-2xl
                   bg-gradient-to-b from-storm to-indigo
                   border border-white/10
                   transition-all duration-200
                   hover:-translate-y-1 hover:border-lime/30
                   hover:shadow-[0_0_24px_-6px_rgba(200,241,53,0.15)]
                   focus-visible:outline-2 focus-visible:outline-lime focus-visible:outline-offset-2"
        aria-label={`Read: ${post.title}`}
      >
        {/* Icon + meta row */}
        <div className="flex items-center justify-between">
          <span className="text-lime">
            <Icon className="size-7" />
          </span>
          <span className="text-xs font-dm-sans text-neutral-500">
            {post.readTime}
          </span>
        </div>

        {/* Category + date */}
        <div className="flex items-center gap-3 mt-4 text-xs font-dm-sans">
          <span className="px-2.5 py-0.5 rounded-full bg-lime/10 text-lime font-medium">
            {post.category}
          </span>
          <span className="text-neutral-500">{formatDate(post.date)}</span>
        </div>

        {/* Title */}
        <h3 className="mt-3 text-lg font-syne font-semibold text-white leading-snug
                       group-hover:text-lime transition-colors duration-200 line-clamp-2">
          {post.title}
        </h3>

        {/* Excerpt — pushed to bottom with flex grow */}
        <p className="mt-2 flex-1 text-sm font-dm-sans text-neutral-400 line-clamp-3">
          {post.excerpt}
        </p>

        {/* Read more hint */}
        <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-dm-sans
                         text-neutral-500 group-hover:text-lime transition-colors duration-200">
          Read more
          <svg
            className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </span>
      </Link>
    </motion.div>
  );
};

// ── Helpers ────────────────────────────────────────────────────────────────

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default BlogCard;
