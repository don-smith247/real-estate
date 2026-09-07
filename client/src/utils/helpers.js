export const formatCurrency = (amount, compact = false) => {
  if (compact && amount >= 1000) {
    return '$' + (amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1) + 'k';
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
};

export const formatDate = (date, options = {}) => {
  if (!date) return 'N/A';
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    ...options,
  }).format(new Date(date));
};

export const formatDateShort = (date) => {
  if (!date) return 'N/A';
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(date));
};

export const formatAvailability = (date) => {
  if (!date) return 'Contact for availability';
  const d = new Date(date);
  const now = new Date();
  const diffDays = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return 'Available Now';
  if (diffDays <= 7) return `Available in ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
  return `Available ${formatDateShort(date)}`;
};

export const propertyTypeLabel = (type) => ({
  studio: 'Studio',
  '1br': '1 Bedroom',
  '2br': '2 Bedrooms',
  '3br': '3 Bedrooms',
  penthouse: 'Penthouse',
  townhouse: 'Townhouse',
  loft: 'Loft',
}[type] || type);

export const bedroomLabel = (n) => {
  if (n === 0) return 'Studio';
  return `${n} BD`;
};

export const truncate = (str, n = 120) => (str && str.length > n ? str.slice(0, n) + '...' : str);

export const getPrimaryImage = (images, fallback = '') => {
  if (!images || images.length === 0) return fallback;
  return images.find((img) => img.isPrimary)?.url || images[0]?.url || fallback;
};

export const statusColors = {
  new: { bg: '#EBF8F0', color: '#22A06B' },
  pending: { bg: '#FEF3C7', color: '#D97706' },
  read: { bg: '#EFF6FF', color: '#3B82F6' },
  contacted: { bg: '#F0FDF4', color: '#16A34A' },
  under_review: { bg: '#FEF3C7', color: '#D97706' },
  approved: { bg: '#EBF8F0', color: '#22A06B' },
  resolved: { bg: '#F0FDF4', color: '#16A34A' },
  denied: { bg: '#FEF2F2', color: '#DC2626' },
  withdrawn: { bg: '#F3F4F6', color: '#6B7280' },
  archived: { bg: '#F3F4F6', color: '#6B7280' },
};

export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};
