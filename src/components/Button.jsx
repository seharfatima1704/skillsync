import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  onClick, 
  type = 'button',
  disabled = false,
  loading = false,
  className = '',
  style = {},
  ...props 
}) => {
  const buttonClasses = `
    btn
    btn-${variant}
    btn-${size}
    ${disabled ? 'disabled' : ''}
    ${loading ? 'loading' : ''}
    ${className}
  `.trim();

  const buttonStyle = {
    opacity: disabled ? 0.6 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
    ...style
  };

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <div 
            style={{
              width: '16px',
              height: '16px',
              border: '2px solid transparent',
              borderTop: '2px solid currentColor',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}
          />
          <span>Loading...</span>
        </>
      );
    }
    return children;
  };

  return (
    <button
      className={buttonClasses}
      style={buttonStyle}
      onClick={onClick}
      type={type}
      disabled={disabled || loading}
      {...props}
    >
      {renderContent()}
    </button>
  );
};

export default Button;
