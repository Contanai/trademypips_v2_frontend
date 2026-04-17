import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  iconSize?: string;
  textSize?: string;
  showText?: boolean;
  disabled?: boolean;
  textClassName?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  className = "", 
  iconSize = "text-3xl", 
  textSize = "text-2xl",
  showText = true,
  disabled = false,
  textClassName = ""
}) => {
  const content = (
    <div className={`flex items-center gap-2 ${className}`}>
      <span 
        className={`material-symbols-outlined text-primary-container ${iconSize}`} 
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        account_tree
      </span>
      {showText && (
        <span className={`font-headline font-bold tracking-tighter text-primary-container uppercase ${textSize} ${textClassName}`}>
          TRADEMYPIPS
        </span>
      )}
    </div>
  );

  if (disabled) return content;

  return (
    <Link to="/" className="hover:opacity-90 transition-opacity">
      {content}
    </Link>
  );
};

export default Logo;
