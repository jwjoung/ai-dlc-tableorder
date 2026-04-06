const sizes = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

function Loading({ size = 'md', text = '' }) {
  return (
    <div className="flex flex-col items-center justify-center p-4" data-testid="loading-spinner">
      <svg
        className={`animate-spin text-blue-600 ${sizes[size]}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      {text && <p className="mt-2 text-sm text-gray-500">{text}</p>}
    </div>
  );
}

export default Loading;
