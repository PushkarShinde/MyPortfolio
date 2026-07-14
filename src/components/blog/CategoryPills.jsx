import { useRef, useEffect } from 'react';

const CategoryPills = ({ categories, activeCategory, onSelect }) => {
  const scrollRef = useRef(null);

  // Scroll active pill into view on mount / change
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const active = container.querySelector('[data-active="true"]');
    if (active) {
      active.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    }
  }, [activeCategory]);

  return (
    <div
      ref={scrollRef}
      className="flex gap-2 overflow-x-auto pb-2 scrollbar-none"
      role="tablist"
      aria-label="Filter posts by category"
    >
      {categories.map((cat) => {
        const isActive = cat === activeCategory;
        return (
          <button
            key={cat}
            role="tab"
            aria-selected={isActive}
            data-active={isActive}
            onClick={() => onSelect(cat)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-dm-sans font-medium
                        transition-all duration-200 cursor-pointer
                        focus-visible:outline-2 focus-visible:outline-lime focus-visible:outline-offset-2
                        ${
                          isActive
                            ? 'bg-lime text-primary shadow-[0_0_16px_-4px_rgba(200,241,53,0.3)]'
                            : 'bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:border-white/20'
                        }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryPills;
