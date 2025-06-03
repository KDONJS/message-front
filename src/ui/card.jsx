import React from 'react';

const Card = ({ children, style, className = '' }) => (
  <div
    className={`dashboard-card ${className}`}
    style={{
      background: '#fff',
      borderRadius: 12,
      boxShadow: '0 2px 12px #0001',
      padding: 24,
      margin: 8,
      ...style
    }}
  >
    {children}
  </div>
);

export default Card;