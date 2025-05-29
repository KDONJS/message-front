import React, { useState } from "react";
import teslanet from '../assets/teslanet.svg';
import fondo from '../assets/hero1.webp';

const Login = ({ onRegister, onLoginSuccess }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email === "admin@admin" && password === "admin") {
            setError("");
            onLoginSuccess();
        } else {
            setError("Usuario o contraseña incorrectos");
        }
    };

    return (
        <>
            <div className="login-bg-overlay"></div>
            <img src={fondo} alt="Fondo" className="login-bg-img" />
            <div className="login-container">
                <div className="login-left">
                    <div className="login-logo">
                        <img src={teslanet} alt="teslanet" />
                    </div>
                    <h2 className="login-title">¡BIENVENIDO!</h2>
                    <p className="login-subtitle">Por favor, ingrese a su cuenta.</p>
                    <form className="login-form" onSubmit={handleSubmit}>
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
                        {error && (
                            <div style={{ color: "#c0392b", marginBottom: 8, fontSize: 14 }}>
                                {error}
                            </div>
                        )}
                        <div className="login-options">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={remember}
                                    onChange={e => setRemember(e.target.checked)}
                                />
                                Recordar contraseña
                            </label>
                            <button
                                type="button"
                                className="login-link-forgot"
                                onClick={() => alert('Funcionalidad próximamente')}
                                style={{ background: 'none', border: 'none', color: '#c0392b', cursor: 'pointer', padding: 0 }}
                            >
                                Olvidaste contraseña
                            </button>
                        </div>
                        <button type="submit" className="login-btn">INGRESAR</button>
                    </form>
                    <div className="login-register">
                        ¿Eres nuevo? <span className="login-link-register" onClick={onRegister}>Regístrate</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;