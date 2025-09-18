import React, { useState } from 'react';
import './Login.css'; 
import famisLogo from '../assets/img/logo-tambo2.png';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);

  const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(regex.test(value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validEmail = 'leo@mail.com';
    const validPassword = '123456';

    if (email === validEmail && password === validPassword) {
      setError('');
      alert('Inicio de sesión exitoso');
    } else {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className="registro-container">
      <div className="registro-imagen">
        <img src={famisLogo} alt="FAMIS Logo" />
      </div>

      <form className="registro-formulario" onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>

        <input
          type="email"
          placeholder="Correo Electrónico"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            validateEmail(e.target.value);
          }}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="error">{error}</p>}

        <button
          type="submit"
          disabled={!email || !password || !isValidEmail}
        >
          Iniciar sesión
        </button>

        <p className="registro-link">
          ¿No tienes cuenta? <a href="/registro">Regístrate</a>
        </p>
      </form>
    </div>
  );
}

export default Login;
