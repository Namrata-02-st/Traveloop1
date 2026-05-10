import { format, formatDistanceToNow, parseISO } from 'date-fns';

const toDate = (value) => (typeof value === 'string' ? parseISO(value) : value);

export const formatDate = (value, pattern = 'MMM d, yyyy') => {
  if (!value) return '';
  return format(toDate(value), pattern);
};

export const formatRange = (start, end) => {
  if (!start || !end) return '';
  return `${formatDate(start, 'MMM d')} - ${formatDate(end, 'MMM d, yyyy')}`;
};

export const relativeTime = (value) => {
  if (!value) return '';
  return formatDistanceToNow(toDate(value), { addSuffix: true });
};
