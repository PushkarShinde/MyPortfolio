import BackendIcon from './BackendIcon';
import DistributedIcon from './DistributedIcon';
import DevOpsIcon from './DevOpsIcon';
import CareerIcon from './CareerIcon';
import CompetitiveIcon from './CompetitiveIcon';
import DefaultIcon from './DefaultIcon';

const iconMap = {
  'Backend Engineering': BackendIcon,
  'Distributed Systems': DistributedIcon,
  'DevOps': DevOpsIcon,
  'Career': CareerIcon,
  'Competitive Programming': CompetitiveIcon,
};

/**
 * Returns the icon component for a given category string.
 * Falls back to DefaultIcon for unknown categories.
 */
export function getCategoryIcon(category) {
  return iconMap[category] || DefaultIcon;
}
