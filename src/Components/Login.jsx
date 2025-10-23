import React, { useState } from 'react';
import "./Login.css";
import { useNavigate } from 'react-router-dom';
import logo from '../assets/img/logo-tambo2.png';
import { login } from '../api';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = await login(form.email, form.password);

      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      alert("Login exitoso");

      // Verificar dominio del correo para redirigir admin
      if (form.email.toLowerCase().endsWith('@tambo.com')) {
        navigate('/panel'); // Redirige al dashboard admin
      } else {
        navigate('/'); // Redirige a inicio para usuario normal
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="registro-container">
      <div className="registro-imagen">
        <img src={logo} alt="Logo Tambo" />
      </div>
      <form className="registro-formulario" onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          required
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          required
          onChange={handleChange}
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Iniciar sesión</button>
        <p className="registro-link">
          ¿No tienes cuenta? <a href="/registro">Regístrate</a>
        </p>
      </form>
    </div>
  );
}

export default Login;