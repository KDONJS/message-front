import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SidebarButton from './SidebarButton';
import { sidebarIcons } from './SidebarIcons';
import teslanet from '../assets/teslanet.svg';
import teslanetLogo from '../assets/teslanetLogo.webp';

const navButtons = [
  { icon: <sidebarIcons.dashboard />, label: "Dashboard", to: "/dashboard" },
  { icon: <sidebarIcons.mensajes />, label: "Mensajes", to: "/mensajes" },
  { icon: <sidebarIcons.reportes />, label: "Reportes", to: "/reportes" },
  { icon: <sidebarIcons.roles />, label: "Roles", to: "/roles" },
  { icon: <sidebarIcons.usuarios />, label: "Usuarios", to: "/usuarios" },
  { icon: <sidebarIcons.task />, label: "Tareas", to: "/tareas" },
  { icon: <sidebarIcons.configuracion />, label: "Configuración", to: "/configuracion" },
  { icon: <sidebarIcons.logout />, label: "Cerrar sesión", to: "/logout" },
   // <-- Asegúrate de tener el ícono
];

const Sidebar = ({ className = "", onMensajesClick }) => {
  const [expandido, setExpandido] = useState(true);
  const [expandidoPorPanel, setExpandidoPorPanel] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const activeIndex = useMemo(
    () => navButtons.findIndex(btn => btn.to === location.pathname),
    [location.pathname]
  );

  // refs para cada botón
  const buttonRefs = useRef([]);
  const [highlightStyle, setHighlightStyle] = useState({ top: 0, left: 10, width: 0, height: 0 });

  // Recalcula el highlight cuando cambia el tamaño de la ventana o el botón activo
  useEffect(() => {
    function updateHighlight() {
      if (activeIndex >= 0 && buttonRefs.current[activeIndex]) {
        const el = buttonRefs.current[activeIndex];
        const style = {
          top: el.offsetTop,
          left: el.offsetLeft,
          width: el.offsetWidth ,
          height: el.offsetHeight
        };
        setHighlightStyle(style);
      }
    }
    const raf = requestAnimationFrame(updateHighlight);
    window.addEventListener('resize', updateHighlight);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', updateHighlight);
    };
  }, [activeIndex, expandido]);




  const handleToggle = () => {
    setExpandido(prev => !prev);
    setExpandidoPorPanel(prev => !prev); // Solo el panel cambia este estado
  };

  const handleNavClick = (to) => {
    if (to === '/logout') {
      navigate('/logout', { state: { backgroundLocation: location } });
      return;
    }

    navigate(to);

    if (to === '/mensajes') {
      // Solo colapsa si el panel está expandido por el botón del panel
      if (expandido && expandidoPorPanel) {
        setExpandido(false);
        // NO cambies expandidoPorPanel aquí
      }
      if (typeof onMensajesClick === 'function') {
        onMensajesClick();
      }
    } else {
      // Solo expande si el panel está expandido por el panel
      if (expandidoPorPanel) {
        setExpandido(true);
      }
      // Si el panel está colapsado por el panel, no expandas aquí
    }
  };

  return (
    <div
      className={className}
      style={
        className
          ? undefined
          : {
            width: expandido ? '280px' : '60px',
            background: '#fff',
            height: '100vh',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'width 0.3s',
            position: 'relative',
            overflow: 'hidden'
          }
      }
    >
      <div
        style={{
          position: 'relative',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: expandido ? 'flex-start' : 'center',
        }}
      >
        {/* Highlight animado */}
        {activeIndex >= 0 && (
          <div
            style={{
              position: 'absolute',
              top: expandido ? highlightStyle.top - 6 : highlightStyle.top ,
              width: expandido ? 200 : highlightStyle.height,
              height: expandido ? 54 : highlightStyle.height,
              left: expandido ? highlightStyle.left : 10,
              transition: 'top 0.3s, left 0.3s, width 0.3s, height 0.3s',
              pointerEvents: 'none',
              background: '#33a29a',
              borderRadius: expandido ? '10px' : '50%',
              zIndex: 1,
              boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.07)'

            }}
          />
        )}

        {/* Encabezado y botón panel */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            padding: expandido ? '32px 16px' : '32px 8px',
            justifyContent: expandido ? 'space-between' : 'center'
          }}
        >
          <img
            src={expandido ? teslanet : teslanetLogo}
            alt="Teslanet"
            style={{
              width: expandido ? '140px' : '45px',
              height: expandido ? 'auto' : '45px',
              transition: 'width 0.3s, height 0.3s',
              objectFit: 'contain',
              flex: expandido ? 1 : 'unset'
            }}
          />
          {expandido && (
            <SidebarButton
              expandido={expandido}
              icon={<sidebarIcons.panel />}
              label={''}
              onClick={handleToggle}
            />
          )}
        </div>
        {!expandido && (
          <SidebarButton
            expandido={expandido}
            icon={<sidebarIcons.panel />}
            label={''}
            onClick={handleToggle}
          />
        )}
        {/* Botones de navegación */}
        {navButtons.slice(0, 5).map((btn, idx) => (
          <SidebarButton
            key={btn.to}
            expandido={expandido}
            icon={btn.icon}
            label={expandido ? btn.label : ""}
            to={btn.to}
            isActive={activeIndex === idx}
            ref={el => buttonRefs.current[idx] = el}
            onClick={() => handleNavClick(btn.to)}
          />
        ))}
        {/* Botones de navegación inferiores */}
        {navButtons.slice(5).map((btn, idx) => (
          <SidebarButton
            key={btn.to}
            expandido={expandido}
            icon={btn.icon}
            label={expandido ? btn.label : ""}
            to={btn.to}
            isActive={activeIndex === idx + 5}
            ref={el => buttonRefs.current[idx + 5] = el}
            onClick={() => handleNavClick(btn.to)}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;