import React, { useState } from 'react';
import "./Login.css";
import { useNavigate } from 'react-router-dom';
import logo from '../assets/img/logo-tambo2.png';
import { login } from '../api';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.email.trim()) newErrors.email = 'El correo es obligatorio';
    if (!form.password.trim()) newErrors.password = 'La contraseña es obligatoria';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const data = await login(form.email, form.password);
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      alert('Login exitoso');

      if (form.email.toLowerCase().endsWith('@tambo.com')) navigate('/panel');
      else navigate('/');
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || err.message || 'Error al iniciar sesión' });
    }
  };

  return (
    <div className="registro-container">
      <div className="registro-imagen"><img src={logo} alt="Logo Tambo" /></div>
      <form className="registro-formulario" onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>

        <input type="email" name="email" placeholder="Correo electrónico" value={form.email} onChange={handleChange} required />
        {errors.email && <p className="error">{errors.email}</p>}

        <input type="password" name="password" placeholder="Contraseña" value={form.password} onChange={handleChange} required />
        {errors.password && <p className="error">{errors.password}</p>}

        {errors.submit && <p className="error">{errors.submit}</p>}

        <button type="submit">Iniciar sesión</button>
        <p className="registro-link">¿No tienes cuenta? <a href="/registro">Regístrate</a></p>
      </form>
    </div>
  );
}

export default Login;
