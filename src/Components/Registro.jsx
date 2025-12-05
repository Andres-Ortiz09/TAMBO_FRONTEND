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
    confirmPassword: '',
    address: '',
    phone: ''
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validaciones por campo en tiempo real
    if (name === 'firstName' || name === 'lastName') {
      const soloLetras = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ\s]/g, '');
      setForm({ ...form, [name]: soloLetras });
    } else if (name === 'phone') {
      const soloNumeros = value.replace(/\D/g, '').slice(0, 9);
      setForm({ ...form, [name]: soloNumeros });
    } else {
      setForm({ ...form, [name]: value });
    }

    setErrors({ ...errors, [name]: '' }); // limpiar error al escribir
  };

  const validateForm = () => {
    const { firstName, lastName, email, password, confirmPassword, address, phone } = form;
    const newErrors = {};

    if (!firstName.trim()) newErrors.firstName = "El nombre es obligatorio";
    else if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(firstName)) newErrors.firstName = "Solo letras en el nombre";

    if (!lastName.trim()) newErrors.lastName = "El apellido es obligatorio";
    else if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(lastName)) newErrors.lastName = "Solo letras en el apellido";

    if (!email.trim()) newErrors.email = "El correo es obligatorio";
    else if (!/^[\w.-]+@[\w.-]+\.\w+$/.test(email)) newErrors.email = "Correo inválido";

    if (!password.trim()) newErrors.password = "La contraseña es obligatoria";
    else if (password.length < 6) newErrors.password = "Debe tener al menos 6 caracteres";

    if (!confirmPassword.trim()) newErrors.confirmPassword = "Debe repetir la contraseña";
    else if (password !== confirmPassword) newErrors.confirmPassword = "Las contraseñas no coinciden";

    if (!address.trim()) newErrors.address = "La dirección es obligatoria";

    if (!phone.trim()) newErrors.phone = "El teléfono es obligatorio";
    else if (!/^\d{9}$/.test(phone)) newErrors.phone = "Debe tener exactamente 9 dígitos";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        address: form.address,
        phone: form.phone
      });
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

        <input type="text" name="firstName" placeholder="Nombre" value={form.firstName} onChange={handleChange} required />
        {errors.firstName && <p className="error">{errors.firstName}</p>}

        <input type="text" name="lastName" placeholder="Apellido" value={form.lastName} onChange={handleChange} required />
        {errors.lastName && <p className="error">{errors.lastName}</p>}

        <input type="email" name="email" placeholder="Correo electrónico" value={form.email} onChange={handleChange} required />
        {errors.email && <p className="error">{errors.email}</p>}

        <input type="password" name="password" placeholder="Contraseña" value={form.password} onChange={handleChange} required />
        {errors.password && <p className="error">{errors.password}</p>}

        <input type="password" name="confirmPassword" placeholder="Repetir contraseña" value={form.confirmPassword} onChange={handleChange} required />
        {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}

        <textarea
         name="address"
         placeholder="Dirección"
         value={form.address}
         onChange={handleChange}
         rows="3"
         required
         ></textarea>
        {errors.address && <p className="error">{errors.address}</p>}

        <input type="tel" name="phone" placeholder="Teléfono" value={form.phone} onChange={handleChange} maxLength="9" inputMode="numeric" required />
        {errors.phone && <p className="error">{errors.phone}</p>}

        {errors.submit && <p className="error">{errors.submit}</p>}

        <button type="submit">Registrarme</button>
      </form>
    </div>
  );
}

export default Registro;
