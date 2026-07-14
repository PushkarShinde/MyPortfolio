const Pagination = ({ shown, total, onLoadMore }) => {
  if (shown >= total) return null;

  return (
    <div className="flex flex-col items-center gap-3 mt-12">
      <p className="text-sm font-dm-sans text-neutral-500">
        Showing {shown} of {total} posts
      </p>
      <button
        onClick={onLoadMore}
        className="relative px-8 py-3 text-sm font-dm-sans font-medium text-white
                   rounded-full bg-primary border border-white/10
                   cursor-pointer overflow-hidden
                   transition-all duration-200
                   hover:-translate-y-1 hover:border-lime/30
                   hover:shadow-[0_0_20px_-6px_rgba(200,241,53,0.2)]
                   focus-visible:outline-2 focus-visible:outline-lime focus-visible:outline-offset-2"
      >
        Load more
      </button>
    </div>
  );
};

export default Pagination;
