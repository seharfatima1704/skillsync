import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  title, 
  description, 
  padding = '32px',
  hover = true 
}) => {
  const cardClasses = `
    card
    ${hover ? '' : 'card:hover'}
    ${className}
  `.trim();

  const cardStyle = {
    padding: padding,
  };

  return (
    <div className={cardClasses} style={cardStyle}>
      {(title || description) && (
        <div className="card-header">
          {title && <h3 className="card-title">{title}</h3>}
          {description && <p className="card-description">{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
