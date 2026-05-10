export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
export const SERVER_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL || 'http://localhost:5000';

export const ACTIVITY_CATEGORIES = ['sightseeing', 'food', 'adventure', 'culture', 'shopping', 'nightlife', 'nature', 'wellness'];
export const PACKING_CATEGORIES = ['clothing', 'documents', 'electronics', 'toiletries', 'medicine', 'food', 'other'];
export const CURRENCIES = ['USD', 'EUR', 'INR', 'GBP', 'JPY', 'AED'];
export const REGIONS = ['Asia', 'Europe', 'Americas', 'Africa', 'Middle East', 'Oceania'];

export const gradientForName = (name = 'A') => {
  const palettes = [
    'from-sky-500 to-emerald-400',
    'from-rose-500 to-amber-400',
    'from-indigo-500 to-cyan-400',
    'from-teal-500 to-lime-400',
    'from-fuchsia-500 to-pink-400',
    'from-blue-600 to-violet-400',
    'from-orange-500 to-red-400',
    'from-emerald-600 to-blue-400'
  ];
  const index = name.charCodeAt(0) % palettes.length;
  return palettes[index];
};

export const categoryClasses = {
  sightseeing: 'border-sky-500 bg-sky-50 text-sky-700',
  food: 'border-orange-500 bg-orange-50 text-orange-700',
  adventure: 'border-emerald-500 bg-emerald-50 text-emerald-700',
  culture: 'border-violet-500 bg-violet-50 text-violet-700',
  shopping: 'border-pink-500 bg-pink-50 text-pink-700',
  nightlife: 'border-slate-700 bg-slate-100 text-slate-700',
  nature: 'border-lime-500 bg-lime-50 text-lime-700',
  wellness: 'border-teal-500 bg-teal-50 text-teal-700'
};
