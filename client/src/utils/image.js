import { SERVER_BASE_URL } from './constants';

export const resolveImageUrl = (url) => {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  const normalized = url.startsWith('/') ? url : `/${url}`;
  return `${SERVER_BASE_URL}${normalized}`;
};
