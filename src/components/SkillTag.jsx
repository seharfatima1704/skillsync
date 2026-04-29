import React from 'react';

const SkillTag = ({ 
  skill, 
  type = 'default', 
  selected = false, 
  onClick, 
  removable = false,
  onRemove
}) => {
  const tagClasses = `
    skill-tag
    ${type === 'teach' ? 'teach' : ''}
    ${type === 'learn' ? 'learn' : ''}
    ${selected ? 'selected' : ''}
    ${onClick ? 'cursor-pointer' : ''}
  `.trim();

  const handleClick = () => {
    if (onClick) {
      onClick(skill);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(skill);
    }
  };

  return (
    <div className={tagClasses} onClick={handleClick}>
      <span>{skill}</span>
      {removable && (
        <button 
          className="btn-remove-skill"
          onClick={handleRemove}
          style={{
            background: 'none',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            padding: '0 4px',
            marginLeft: '4px',
            fontSize: '16px',
            lineHeight: '1'
          }}
        >
          ×
        </button>
      )}
    </div>
  );
};

export default SkillTag;
