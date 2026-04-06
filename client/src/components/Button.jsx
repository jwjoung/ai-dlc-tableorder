const variants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm min-h-[36px]',
  md: 'px-4 py-2.5 text-base min-h-[44px]',
  lg: 'px-6 py-3 text-lg min-h-[52px]',
};

function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  type = 'button',
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center rounded-lg font-medium
        focus:outline-none focus:ring-2 focus:ring-offset-2
        transition-colors duration-200
        ${variants[variant]}
        ${sizes[size]}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}

export default Button;
