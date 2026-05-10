export default function Button({ type = 'button', variant = 'primary', size = 'md', className = '', children, ...props }) {
  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white',
    secondary: 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-200',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
    danger: 'bg-danger hover:bg-red-600 text-white',
    success: 'bg-accent-500 hover:bg-emerald-600 text-white'
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-3 text-base'
  };

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
