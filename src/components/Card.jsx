const Card = ({ children, className = '' }) => {
  return (
    <div
      className={`bg-white/95 rounded-3xl shadow-card-soft p-6 ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;

