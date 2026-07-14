import { useParams, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from '../sections/Navbar';
import Footer from '../sections/Footer';
import BlogPostHeader from '../components/blog/BlogPostHeader';
import BlogPostContent from '../components/blog/BlogPostContent';
import MorePosts from '../components/blog/MorePosts';
import { getPostBySlug } from '../utils/blogLoader';

const BlogPostPage = () => {
  const { slug } = useParams();
  const post = getPostBySlug(slug);

  // Scroll to top on slug change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  // 404 fallback — redirect to blog listing
  if (!post) {
    return <Navigate to="/blogs" replace />;
  }

  return (
    <div className="container mx-auto max-w-7xl">
      <Navbar />

      {/* Centered reading column */}
      <article className="max-w-[720px] mx-auto c-space pt-32 md:pt-40">
        <BlogPostHeader post={post} />
        <BlogPostContent content={post.content} />
      </article>

      {/* More posts — full width */}
      <MorePosts currentSlug={slug} />

      <Footer />
    </div>
  );
};

export default BlogPostPage;
