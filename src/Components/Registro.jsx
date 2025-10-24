import React, { useState } from 'react';
import "./Registro.css";
import { useNavigate } from 'react-router-dom';
import { register } from '../api';
import logo from '../assets/img/logo-tambo2.png';

function Registro() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    address: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'firstName' || name === 'lastName') {
      if (/^[A-Za-z\s]*$/.test(value)) {
        setForm({ ...form, [name]: value });
      }
      return;
    }

    if (name === 'phone') {
      if (/^\d{0,9}$/.test(value)) {
        setForm({ ...form, [name]: value });
      }
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const validateForm = () => {
    const { firstName, lastName, email, password, address, phone } = form;
    const newErrors = {};

    if (!/^[A-Za-z\s]+$/.test(firstName)) newErrors.firstName = "El nombre solo debe contener letras";
    if (!/^[A-Za-z\s]+$/.test(lastName)) newErrors.lastName = "El apellido solo debe contener letras";
    if (!/^[\w.-]+@[\w.-]+\.\w+$/.test(email)) newErrors.email = "Correo electrónico inválido";
    if (password.length < 6) newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    if (!/^\d{9}$/.test(phone)) newErrors.phone = "El teléfono debe tener exactamente 9 dígitos numéricos";
    if (address.trim().length === 0) newErrors.address = "La dirección no puede estar vacía";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return; // stop submit if errors
    }

    try {
      await register(form);
      alert('Usuario registrado con éxito');
      navigate('/login');
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || err.message || 'Error al registrar usuario' });
    }
  };

  return (
    <div className="registro-container">
      <div className="registro-imagen"><img src={logo} alt="Logo Tambo" /></div>
      <form className="registro-formulario" onSubmit={handleSubmit}>
        <h2>Registro</h2>

        <input
          type="text"
          name="firstName"
          placeholder="Nombre"
          value={form.firstName}
          onChange={handleChange}
          required
        />
        {errors.firstName && <p className="error">{errors.firstName}</p>}

        <input
          type="text"
          name="lastName"
          placeholder="Apellido"
          value={form.lastName}
          onChange={handleChange}
          required
        />
        {errors.lastName && <p className="error">{errors.lastName}</p>}

        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
          required
        />
        {errors.email && <p className="error">{errors.email}</p>}

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          required
        />
        {errors.password && <p className="error">{errors.password}</p>}

        <input
          type="text"
          name="address"
          placeholder="Dirección"
          value={form.address}
          onChange={handleChange}
          required
        />
        {errors.address && <p className="error">{errors.address}</p>}

        <input
          type="tel"
          name="phone"
          placeholder="Teléfono"
          value={form.phone}
          onChange={handleChange}
          maxLength="9"
          pattern="[0-9]*"
          inputMode="numeric"
          required
        />
        {errors.phone && <p className="error">{errors.phone}</p>}

        {errors.submit && <p className="error">{errors.submit}</p>}

        <button type="submit">Registrarme</button>
      </form>
    </div>
  );
}

export default Registro;