import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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
import { useLocation } from 'react-router-dom';


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
  return !!(localStorage.getItem("authToken") || sessionStorage.getItem("authToken"));
});

  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  console.log('App location:', location);
  console.log('App backgroundLocation:', location.state?.backgroundLocation);



  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
  const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
  if (!token) setIsLoggedIn(false);
}, []);


  if (!isLoggedIn) {
    return showRegister ? (
      <Register onLogin={() => setShowRegister(false)} />
    ) : (
      <Login
        onRegister={() => setShowRegister(true)}
        onLoginSuccess={() => {
          setIsLoggedIn(true);
          navigate('/dashboard'); // Redirige al dashboard tras login
        }}
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
        <Logout onLogout={() => setIsLoggedIn(false)} />
      )}
      {isMobile && <BottomBar />}
    </div>
  </div>
  );
};

export default App;