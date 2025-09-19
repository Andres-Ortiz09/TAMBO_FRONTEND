import React, { useState, useEffect } from 'react';
import { FaUser, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UsuarioAdmin.css';

const UsuarioAdmin = () => {
  const [usuarios, setUsuarios] = useState(() => {
    // Cargar usuarios solo una vez al montar
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

  // Guardar usuarios cada vez que cambian
  useEffect(() => {
    localStorage.setItem('usuariosTambo', JSON.stringify(usuarios));
  }, [usuarios]);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Agregar o editar usuario
  const handleSubmit = (e) => {
    e.preventDefault();
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
  };

  // Editar usuario
  const handleEdit = (idx) => {
    setForm(usuarios[idx]);
    setEditingId(idx);
  };

  // Eliminar usuario
  const handleDelete = (idx) => {
    if (window.confirm('¿Seguro que quieres eliminar este usuario?')) {
      setUsuarios(usuarios.filter((_, i) => i !== idx));
      setMensajeExito('Usuario eliminado');
      if (editingId === idx) {
        setEditingId(null);
        setForm({ firstName: '', lastName: '', email: '', password: '', phoneNumber: '' });
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
                  className="form-control"
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Apellido"
                  className="form-control"
                  required
                />
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
                  className="form-control"
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Contraseña"
                  className="form-control"
                  required
                />
              </div>
            </div>
            <div className="mb-3">
              <input
                type="text"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                placeholder="Teléfono"
                className="form-control"
                required
              />
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
