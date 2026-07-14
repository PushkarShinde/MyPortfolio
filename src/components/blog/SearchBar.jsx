import { useState, useCallback } from 'react';

const SearchBar = ({ onSearch }) => {
  const [value, setValue] = useState('');

  const handleChange = useCallback(
    (e) => {
      const query = e.target.value;
      setValue(query);

      // Simple debounce with clearTimeout
      if (handleChange._timer) clearTimeout(handleChange._timer);
      handleChange._timer = setTimeout(() => {
        onSearch(query);
      }, 300);
    },
    [onSearch],
  );

  return (
    <div className="relative w-full sm:max-w-sm">
      {/* Magnifying glass icon */}
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500 pointer-events-none"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="text"
        placeholder="Search posts..."
        value={value}
        onChange={handleChange}
        aria-label="Search blog posts"
        className="w-full pl-10 pr-4 py-2.5 text-sm font-dm-sans
                   bg-white/10 border border-white/10 rounded-lg
                   text-white placeholder-neutral-500
                   transition duration-200
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime/40"
      />
    </div>
  );
};

export default SearchBar;
