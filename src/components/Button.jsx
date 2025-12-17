const Button = ({ 
  children, 
  variant = 'primary', 
  onClick, 
  className = '', 
  disabled = false,
  type = 'button'
}) => {
  const baseStyles = 'px-5 py-2.5 rounded-full font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary text-white shadow-md hover:shadow-lg hover:brightness-110',
    secondary: 'bg-peach text-burgundy hover:brightness-105 shadow-sm',
    accent: 'bg-accent text-burgundy hover:brightness-110 shadow-sm',
    outline: 'border border-burgundy text-burgundy bg-transparent hover:bg-burgundy hover:text-white',
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

