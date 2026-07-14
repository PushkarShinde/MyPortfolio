import BlogCard from './BlogCard';
import { getAllPosts } from '../../utils/blogLoader';

const MorePosts = ({ currentSlug }) => {
  const allPosts = getAllPosts();
  // Exclude the current post, take the next 3
  const morePosts = allPosts.filter((p) => p.slug !== currentSlug).slice(0, 3);

  if (morePosts.length === 0) return null;

  return (
    <section className="c-space mt-16 mb-12">
      {/* Divider */}
      <div className="bg-gradient-to-r from-transparent via-neutral-700 to-transparent h-[1px] w-full mb-10" />

      <h2 className="font-syne font-bold text-2xl text-white mb-6">More posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {morePosts.map((post, i) => (
          <BlogCard key={post.slug} post={post} variant="grid" index={i} />
        ))}
      </div>
    </section>
  );
};

export default MorePosts;
