import React, { useState, useEffect } from 'react';
import { FaUser, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UsuarioAdmin.css';

const UsuarioAdmin = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
  });
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [mensajeExito, setMensajeExito] = useState('');

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem('usuariosTambo')) || [];
    setUsuarios(guardados);
  }, []);

  useEffect(() => {
    localStorage.setItem('usuariosTambo', JSON.stringify(usuarios));
  }, [usuarios]);

  const validar = () => {
    const nuevosErrores = {};
    if (!form.firstName) nuevosErrores.firstName = 'Nombre es requerido';
    if (!form.lastName) nuevosErrores.lastName = 'Apellido es requerido';
    if (!form.email) nuevosErrores.email = 'Email es requerido';
    else if (!/\S+@\S+\.\S+/.test(form.email)) nuevosErrores.email = 'Email inválido';
    if (!form.password) nuevosErrores.password = 'Contraseña requerida';
    else if (form.password.length < 6) nuevosErrores.password = 'Debe tener mínimo 6 caracteres';
    if (!form.phoneNumber) nuevosErrores.phoneNumber = 'Teléfono es requerido';
    return nuevosErrores;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validacion = validar();
    if (Object.keys(validacion).length > 0) {
      setErrors(validacion);
      setMensajeExito('');
      return;
    }
    if (editingId !== null) {
      const actualizados = usuarios.map((u) =>
        u.id === editingId ? { ...form, id: editingId } : u
      );
      setUsuarios(actualizados);
      setEditingId(null);
      setMensajeExito('Usuario actualizado correctamente');
    } else {
      const nuevoUsuario = { ...form, id: Date.now() };
      setUsuarios([...usuarios, nuevoUsuario]);
      setMensajeExito('Usuario registrado correctamente');
    }
    setForm({ firstName: '', lastName: '', email: '', password: '', phoneNumber: '' });
    setErrors({});
  };

  const handleEdit = (id) => {
    const usuario = usuarios.find((u) => u.id === id);
    if (usuario) {
      setForm(usuario);
      setEditingId(id);
      setErrors({});
      setMensajeExito('');
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Seguro que quieres eliminar este usuario?')) {
      setUsuarios(usuarios.filter((u) => u.id !== id));
      setMensajeExito('Usuario eliminado');
      if (editingId === id) {
        setEditingId(null);
        setForm({ firstName: '', lastName: '', email: '', password: '', phoneNumber: '' });
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
                  onChange={handleChange}
                  placeholder="Nombre"
                  className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                />
                <div className="invalid-feedback">{errors.firstName}</div>
              </div>
              <div className="col-md-6 mb-3">
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Apellido"
                  className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                />
                <div className="invalid-feedback">{errors.lastName}</div>
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
                />
                <div className="invalid-feedback">{errors.email}</div>
              </div>
              <div className="col-md-6 mb-3">
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Contraseña"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                />
                <div className="invalid-feedback">{errors.password}</div>
              </div>
            </div>
            <div className="mb-3">
              <input
                type="text"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                placeholder="Teléfono"
                className={`form-control ${errors.phoneNumber ? 'is-invalid' : ''}`}
              />
              <div className="invalid-feedback">{errors.phoneNumber}</div>
            </div>
            <button type="submit" className="btn btn-primary me-2">
              {editingId !== null ? 'Actualizar' : (<><FaPlus className="me-1" /> Agregar Usuario</>)}
            </button>
            {mensajeExito && <span className="text-success fw-semibold">{mensajeExito}</span>}
          </form>
        </div>
      </div>
      <div className="card shadow-sm table-container">
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
                {usuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>{usuario.firstName}</td>
                    <td>{usuario.lastName}</td>
                    <td>{usuario.email}</td>
                    <td>{usuario.phoneNumber}</td>
                    <td>
                      <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(usuario.id)} title="Editar">
                        <FaEdit />
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(usuario.id)} title="Eliminar">
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
