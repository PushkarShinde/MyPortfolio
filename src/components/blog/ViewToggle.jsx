const ViewToggle = ({ view, onToggle }) => {
  const btnBase =
    'p-2 rounded-lg transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-lime focus-visible:outline-offset-2';

  return (
    <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1 border border-white/10">
      {/* Grid icon */}
      <button
        onClick={() => onToggle('grid')}
        aria-label="Grid view"
        aria-pressed={view === 'grid'}
        className={`${btnBase} ${
          view === 'grid' ? 'bg-lime/15 text-lime' : 'text-neutral-500 hover:text-neutral-300'
        }`}
      >
        <svg className="size-4" viewBox="0 0 16 16" fill="currentColor">
          <rect x="1" y="1" width="6" height="6" rx="1" />
          <rect x="9" y="1" width="6" height="6" rx="1" />
          <rect x="1" y="9" width="6" height="6" rx="1" />
          <rect x="9" y="9" width="6" height="6" rx="1" />
        </svg>
      </button>

      {/* List icon */}
      <button
        onClick={() => onToggle('list')}
        aria-label="List view"
        aria-pressed={view === 'list'}
        className={`${btnBase} ${
          view === 'list' ? 'bg-lime/15 text-lime' : 'text-neutral-500 hover:text-neutral-300'
        }`}
      >
        <svg className="size-4" viewBox="0 0 16 16" fill="currentColor">
          <rect x="1" y="1" width="14" height="3" rx="1" />
          <rect x="1" y="6.5" width="14" height="3" rx="1" />
          <rect x="1" y="12" width="14" height="3" rx="1" />
        </svg>
      </button>
    </div>
  );
};

export default ViewToggle;
