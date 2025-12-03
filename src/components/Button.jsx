const Button = ({ 
  children, 
  variant = 'primary', 
  onClick, 
  className = '', 
  disabled = false,
  type = 'button'
}) => {
  const baseStyles = 'px-4 py-2 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-opacity-90',
    secondary: 'bg-secondary text-white hover:bg-opacity-90',
    accent: 'bg-accent text-white hover:bg-opacity-90',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
    danger: 'bg-red-500 text-white hover:bg-red-600'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;

