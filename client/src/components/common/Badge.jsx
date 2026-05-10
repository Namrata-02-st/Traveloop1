const variants = {
  default: 'bg-gray-100 text-gray-700',
  planning: 'bg-blue-50 text-blue-700',
  ongoing: 'bg-emerald-50 text-emerald-700',
  completed: 'bg-slate-100 text-slate-700',
  danger: 'bg-red-50 text-red-700',
  warning: 'bg-amber-50 text-amber-700'
};

export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
}
