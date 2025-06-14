import Sidebar from './componentes/Sidebar';
import Dashboard from './componentes/Dashboard';
import Message from './componentes/Message';
import Reports from './componentes/Reports';
import Roles from './componentes/Roles';
import Users from './componentes/Users';
import Settings from './componentes/Settings';
import Logout from './componentes/Logout';
import Login from './componentes/Login';
import Register from './componentes/Register';
import { useState, useEffect } from 'react';
import { sidebarIcons } from './componentes/SidebarIcons';
import { useLocation, useNavigate, Routes, Route, Navigate } from 'react-router-dom';


// Elimina el import de BrowserRouter y NO uses <Router> aquí

const navButtons = [
  { icon: <sidebarIcons.dashboard />, label: "Dashboard", to: "/dashboard" },
  { icon: <sidebarIcons.mensajes />, label: "Mensajes", to: "/mensajes" },
  { icon: <sidebarIcons.reportes />, label: "Reportes", to: "/reportes" },
  { icon: <sidebarIcons.roles />, label: "Roles", to: "/roles" },
  { icon: <sidebarIcons.usuarios />, label: "Usuarios", to: "/usuarios" },
  { icon: <sidebarIcons.configuracion />, label: "Configuración", to: "/configuracion" }, // <-- Añade este
  { icon: <sidebarIcons.logout />, label: "Cerrar sesión", to: "/logout" } // <-- Y este
];

const BottomBar = () => {
  const navigate = useNavigate();
  return (
    <div className="bottom-bar" style={{
      position: 'fixed',
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 100,
      background: '#183366',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      height: '56px'
    }}>
      {navButtons.map(btn => (
        <button
          key={btn.to}
          onClick={() => navigate(btn.to)}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: '28px',
            cursor: 'pointer'
          }}
          title={btn.label}
        >
          {btn.icon}
        </button>
      ))}
    </div>
  );
};

const App = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Verificar si hay una sesión guardada en localStorage
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  console.log('App location:', location);
  console.log('App backgroundLocation:', location.state?.backgroundLocation);

  // Función para manejar el login
  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
    navigate('/dashboard');
  };

  // Función para manejar el logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    navigate('/');
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isLoggedIn) {
    return showRegister ? (
      <Register onLogin={() => setShowRegister(false)} />
    ) : (
      <Login
        onRegister={() => setShowRegister(true)}
        onLoginSuccess={handleLogin}
      />
    );
  }

  return (
    <div style={{ display: 'flex' }}>
    {!isMobile && <Sidebar />}
    <div style={{ flex: 1, position: 'relative', minHeight: '100vh' }}>
      <Routes location={location.state?.backgroundLocation || location}>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mensajes" element={<Message />} />
        <Route path="/reportes" element={<Reports />} />
        <Route path="/roles" element={<Roles />} />
        <Route path="/usuarios" element={<Users />} />
        <Route path="/configuracion" element={<Settings />} />
        {/* Fallback: si no hay backgroundLocation y la ruta es /logout, muestra Dashboard */}
       
      </Routes>
      {location.pathname === "/logout" && (
        <Logout onLogout={handleLogout} />
      )}
      {isMobile && <BottomBar />}
    </div>
  </div>
  );
};

export default App;