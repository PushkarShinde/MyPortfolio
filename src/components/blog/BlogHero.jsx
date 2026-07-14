import { motion } from 'motion/react';

const BlogHero = () => {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="c-space pt-32 pb-8 md:pt-40 md:pb-12">
      <motion.h1
        className="font-syne font-bold text-5xl md:text-7xl text-white"
        variants={variants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5 }}
      >
        Blogs
      </motion.h1>
      <motion.p
        className="mt-4 font-dm-sans text-lg md:text-xl text-neutral-400 max-w-2xl"
        variants={variants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        Thoughts on backend engineering, distributed systems, and the craft of
        writing resilient software.
      </motion.p>
      <motion.div
        className="mt-8 bg-gradient-to-r from-transparent via-neutral-700 to-transparent h-[1px] w-full"
        variants={variants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, delay: 0.3 }}
      />
    </section>
  );
};

export default BlogHero;
