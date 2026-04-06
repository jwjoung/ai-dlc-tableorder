function Card({ children, onClick, className = '' }) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-lg shadow-md p-4
        ${onClick ? 'hover:shadow-lg cursor-pointer transition-shadow duration-200' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export default Card;
