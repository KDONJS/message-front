import React, { useState } from "react";
import teslanet from '../assets/teslanet.svg';
import fondo from '../assets/hero1.webp';

const Register = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Agrega más campos según tu necesidad

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-logo">
          <img src={teslanet} alt="Pacas Pro" />
        </div>
        <h2 className="login-title">¡REGÍSTRATE!</h2>
        <p className="login-subtitle">Crea tu cuenta para continuar.</p>
        <form className="login-form">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="login-input"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="login-input"
          />
          {/* Agrega más inputs aquí */}
          <button type="submit" className="login-btn">REGISTRARME</button>
        </form>
        <div className="login-register">
          ¿Ya tienes cuenta? <span className="login-link-register" onClick={onLogin}>Inicia sesión</span>
        </div>
      </div>
      <div className="login-right">
        <div className="login-bg-overlay"></div>
        <img src={fondo} alt="Fondo" className="login-bg-img" />
      </div>
    </div>
  );
};

export default Register;