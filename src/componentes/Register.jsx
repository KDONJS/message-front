import React, { useState } from "react";
import teslanet from '../assets/teslanet.svg';
import fondo from '../assets/hero1.webp';

const Register = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      return;
    }
    setErrorMessage("");
    console.log({
      firstName,
      lastName,
      email,
      password,
    });
  };

  // Agrega más campos según tu necesidad

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-logo">
          <img src={teslanet} alt="Pacas Pro" />
        </div>
        <h2 className="login-title">¡REGÍSTRATE!</h2>
        <p className="login-subtitle">Crea tu cuenta para continuar.</p>
        <form className="login-form" onSubmit={handleSubmit}>
          <input 
            type="text"
            placeholder="Nombres"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            className="login-input"
          />
          <input
            type="text"
            placeholder="Apellidos"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            className="login-input"
          />
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
          <input
            type="password-confirm"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="login-input"
          />

          {/* Agrega más inputs aquí */}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button
            type="submit"
            className="login-btn"
            disabled={!email || !password || !confirmPassword || password !== confirmPassword}>
            REGISTRARME
          </button>
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