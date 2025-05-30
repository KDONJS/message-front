import React, { forwardRef } from 'react';
import { Link } from 'react-router-dom';

const SidebarButton = forwardRef(({ icon, label, to, onClick, expandido, isActive }, ref) => {
  if (!to) {
    return (
      <button
        ref={ref}
        onClick={onClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: expandido ? 'flex-start' : 'center',
          padding: expandido ? '12px 20px' : '12px 0',
          background: 'transparent',
          color: '#fff',
          border: 'none',
          borderRadius: expandido ? '24px' : '50%',
          width: !expandido ? '40px' : 'auto',
          height: !expandido ? '40px' : 'auto',
          margin: '8px 12px',
          fontWeight: 'normal',
          cursor: 'pointer',
          transition: 'background 0.2s, color 0.2s, padding 0.3s, border-radius 0.3s, width 0.3s, height 0.3s'
        }}
      >
        <span
          style={{
            marginRight: expandido && label ? '12px' : '0',
            fontSize: '1.2rem'
          }}
        >
          {icon}
        </span>
        {expandido && label && (
          <span
            style={{
              color: '#fff'
            }}
          >
            {label}
          </span>
        )}
      </button>
    );
  }

  return (
    <Link
    to={to}
    style={{ textDecoration: 'none' }}
  >
    <div
      ref={ref}
      onClick={onClick} // <-- Mueve el onClick aquí
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: expandido ? 'flex-start' : 'center',
        width: expandido ? '100%' : '40px',
        height: '40px',
        margin: '8px 12px',
        fontWeight: isActive ? 'bold' : 'normal',
        cursor: 'pointer',
        color: isActive ? '#183366' : '#fff',
        background: 'transparent',
        borderRadius: expandido ? '24px' : '16px',
        zIndex: 2,
        transition: 'color 0.2s, font-weight 0.2s, border-radius 0.3s'
      }}
    >
        <span
          style={{
            fontSize: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            color: isActive ? '#183366' : '#fff',
            transition: 'color 0.2s'
          }}
        >
          {icon}
        </span>
        {expandido && (
          <span
            style={{
              marginLeft: '12px',
              color: isActive ? '#183366' : '#fff',
              transition: 'color 0.2s'
            }}
          >
            {label}
          </span>
        )}
      </div>
    </Link>
  );
});

export default SidebarButton;