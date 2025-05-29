import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = ({ onLogout }) => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    if (onLogout) onLogout(); // Cambia el estado en App.jsx
    navigate('/login');
  };

  const handleCancel = () => {
    setShowConfirm(false);
    navigate(-1);
  };

  if (!showConfirm) return null;

  return (
    <div className="logout-confirm-overlay" >
      <div className="logout-confirm-box">
        <h2>¿Seguro que quieres salir?</h2>
        <div className="logout-confirm-actions">
          <button className="logout-btn" onClick={handleLogout}>
            Salir
          </button>
          <button className="cancel-btn" onClick={handleCancel}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;