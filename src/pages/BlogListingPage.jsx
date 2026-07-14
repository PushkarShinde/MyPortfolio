import { useState, useMemo, useCallback } from 'react';
import Navbar from '../sections/Navbar';
import Footer from '../sections/Footer';
import BlogHero from '../components/blog/BlogHero';
import SearchBar from '../components/blog/SearchBar';
import CategoryPills from '../components/blog/CategoryPills';
import ViewToggle from '../components/blog/ViewToggle';
import BlogCard from '../components/blog/BlogCard';
import Pagination from '../components/blog/Pagination';
import { getAllPosts, getCategories } from '../utils/blogLoader';

const POSTS_PER_PAGE = 6;

const BlogListingPage = () => {
  const allPosts = getAllPosts();
  const categories = getCategories();

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState(() => {
    try {
      return localStorage.getItem('blog-view') || 'grid';
    } catch {
      return 'grid';
    }
  });
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  // Reset visible count when filters change
  const handleCategoryChange = useCallback((cat) => {
    setActiveCategory(cat);
    setVisibleCount(POSTS_PER_PAGE);
  }, []);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setVisibleCount(POSTS_PER_PAGE);
  }, []);

  const handleViewToggle = useCallback((v) => {
    setView(v);
    try {
      localStorage.setItem('blog-view', v);
    } catch {
      /* localStorage unavailable */
    }
  }, []);

  // Filter posts by category + search
  const filteredPosts = useMemo(() => {
    let posts = allPosts;

    if (activeCategory !== 'All') {
      posts = posts.filter((p) => p.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q),
      );
    }

    return posts;
  }, [allPosts, activeCategory, searchQuery]);

  const visiblePosts = filteredPosts.slice(0, visibleCount);

  return (
    <div className="container mx-auto max-w-7xl">
      <Navbar />
      <BlogHero />

      <div className="c-space pb-16">
        {/* Controls row: search + view toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <SearchBar onSearch={handleSearch} />
          <ViewToggle view={view} onToggle={handleViewToggle} />
        </div>

        {/* Category pills */}
        <div className="mb-8">
          <CategoryPills
            categories={categories}
            activeCategory={activeCategory}
            onSelect={handleCategoryChange}
          />
        </div>

        {/* Post grid / list */}
        {visiblePosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg font-dm-sans text-neutral-400">No posts found.</p>
            <p className="mt-1 text-sm font-dm-sans text-neutral-500">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <div
            className={
              view === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'flex flex-col gap-4'
            }
          >
            {visiblePosts.map((post, i) => (
              <BlogCard key={post.slug} post={post} variant={view} index={i} />
            ))}
          </div>
        )}

        {/* Pagination */}
        <Pagination
          shown={visiblePosts.length}
          total={filteredPosts.length}
          onLoadMore={() => setVisibleCount((c) => c + POSTS_PER_PAGE)}
        />
      </div>

      <Footer />
    </div>
  );
};

export default BlogListingPage;
