/** Network nodes icon — Distributed Systems */
const DistributedIcon = ({ className = '' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="5" r="2.5" />
    <circle cx="5" cy="19" r="2.5" />
    <circle cx="19" cy="19" r="2.5" />
    <line x1="12" y1="7.5" x2="5" y2="16.5" />
    <line x1="12" y1="7.5" x2="19" y2="16.5" />
    <line x1="7.5" y1="19" x2="16.5" y2="19" />
  </svg>
);

export default DistributedIcon;
