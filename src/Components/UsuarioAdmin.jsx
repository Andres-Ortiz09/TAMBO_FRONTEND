import React, { useState, useEffect } from 'react';
import { FaUser, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UsuarioAdmin.css';

const UsuarioAdmin = () => {
  const [usuarios, setUsuarios] = useState(() => {
    return JSON.parse(localStorage.getItem('usuariosTambo')) || [];
  });

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
  });

  const [editingId, setEditingId] = useState(null);
  const [mensajeExito, setMensajeExito] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    localStorage.setItem('usuariosTambo', JSON.stringify(usuarios));
  }, [usuarios]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validar = () => {
    const errores = {};

    if (!form.firstName.trim()) {
      errores.firstName = 'Nombre es requerido';
    } else if (/\d/.test(form.firstName)) {
      errores.firstName = 'El nombre no puede contener números';
    }

    if (!form.lastName.trim()) {
      errores.lastName = 'Apellido es requerido';
    } else if (/\d/.test(form.lastName)) {
      errores.lastName = 'El apellido no puede contener números';
    }

    if (!form.email.trim()) {
      errores.email = 'Correo es requerido';
    } else if (!form.email.endsWith('@gmail.com')) {
      errores.email = 'El correo debe terminar en @gmail.com';
    }

    if (!form.password) {
      errores.password = 'Contraseña es requerida';
    } else if (form.password.length < 6) {
      errores.password = 'Debe tener mínimo 6 caracteres';
    }

    if (!form.phoneNumber.trim()) {
      errores.phoneNumber = 'Teléfono es requerido';
    } else if (!/^\d{9}$/.test(form.phoneNumber)) {
      errores.phoneNumber = 'Teléfono debe tener exactamente 9 dígitos numéricos';
    }

    return errores;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errores = validar();
    if (Object.keys(errores).length > 0) {
      setErrors(errores);
      setMensajeExito('');
      return;
    }

    if (editingId !== null) {
      setUsuarios(usuarios.map((u, idx) => (idx === editingId ? form : u)));
      setEditingId(null);
      setMensajeExito('Usuario actualizado correctamente');
    } else {
      setUsuarios([...usuarios, form]);
      setMensajeExito('Usuario registrado correctamente');
    }

    setForm({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phoneNumber: '',
    });
    setErrors({});
  };

  const handleEdit = (idx) => {
    setForm(usuarios[idx]);
    setEditingId(idx);
    setErrors({});
    setMensajeExito('');
  };

  const handleDelete = (idx) => {
    if (window.confirm('¿Seguro que quieres eliminar este usuario?')) {
      setUsuarios(usuarios.filter((_, i) => i !== idx));
      setMensajeExito('Usuario eliminado');
      if (editingId === idx) {
        setEditingId(null);
        setForm({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          phoneNumber: '',
        });
        setErrors({});
      }
    }
  };

  return (
    <>
      <div className="header d-flex justify-content-between align-items-center mb-4">
        <div className="header-left d-flex align-items-center">
          <img src="https://img.icons8.com/ios-filled/50/000000/cow.png" alt="Logo Tambo" />
          <h1 className="h4 mb-0 ms-2">Gestión de Usuarios</h1>
        </div>
        <div className="d-flex align-items-center">
          <FaUser size={30} className="text-secondary me-2" />
          <span>Administrador</span>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <h5>{editingId !== null ? 'Editar Usuario' : 'Registrar Usuario'}</h5>
          <form onSubmit={handleSubmit} noValidate>
            <div className="row">
              <div className="col-md-6 mb-3">
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
                    setForm({ ...form, firstName: value });
                    setErrors({ ...errors, firstName: '' });
                  }}
                  onKeyPress={(e) => {
                    if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/.test(e.key)) e.preventDefault();
                  }}
                  placeholder="Nombre"
                  className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                  required
                />
                {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
              </div>

              <div className="col-md-6 mb-3">
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
                    setForm({ ...form, lastName: value });
                    setErrors({ ...errors, lastName: '' });
                  }}
                  onKeyPress={(e) => {
                    if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/.test(e.key)) e.preventDefault();
                  }}
                  placeholder="Apellido"
                  className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                  required
                />
                {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
              </div>

            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Correo electrónico"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  required
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>
              <div className="col-md-6 mb-3">
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Contraseña"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  required
                />
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>
            </div>
            <div className="mb-3">
              <input
                type="text"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d{0,9}$/.test(value)) {
                    setForm({ ...form, phoneNumber: value });
                    setErrors({ ...errors, phoneNumber: '' });
                  }
                }}
                placeholder="Teléfono"
                className={`form-control ${errors.phoneNumber ? 'is-invalid' : ''}`}
                required
              />
              {errors.phoneNumber && <div className="invalid-feedback">{errors.phoneNumber}</div>}
            </div>
            <button type="submit" className="btn btn-primary me-2">
              {editingId !== null ? 'Actualizar' : (<><FaPlus className="me-1" /> Agregar Usuario</>)}
            </button>
            {mensajeExito && <span className="text-success fw-semibold ms-3">{mensajeExito}</span>}
          </form>
        </div>
      </div>

      <div className="card shadow-sm table-container mt-4">
        <div className="card-body">
          <h5>Lista de Usuarios</h5>
          {usuarios.length === 0 ? (
            <p>No hay usuarios registrados.</p>
          ) : (
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario, idx) => (
                  <tr key={idx}>
                    <td>{usuario.firstName}</td>
                    <td>{usuario.lastName}</td>
                    <td>{usuario.email}</td>
                    <td>{usuario.phoneNumber}</td>
                    <td>
                      <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(idx)} title="Editar">
                        <FaEdit />
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(idx)} title="Eliminar">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default UsuarioAdmin;
