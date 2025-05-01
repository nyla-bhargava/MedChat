
import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="typing-indicator my-2">
      <span style={{ animationDelay: '0ms' }}></span>
      <span style={{ animationDelay: '300ms' }}></span>
      <span style={{ animationDelay: '600ms' }}></span>
    </div>
  );
};

export default TypingIndicator;
