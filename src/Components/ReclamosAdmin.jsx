import React, { useState, useEffect } from 'react';
import { FaExclamationTriangle, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import './ReclamosAdmin.css';

const ReclamosAdmin = () => {
  const [reclamos, setReclamos] = useState([]);
  const [form, setForm] = useState({
    cliente: '',
    descripcion: '',
    estado: '',
  });
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [mensajeExito, setMensajeExito] = useState('');

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem('reclamosTambo')) || [];
    setReclamos(guardados);
  }, []);

  useEffect(() => {
    localStorage.setItem('reclamosTambo', JSON.stringify(reclamos));
  }, [reclamos]);

  const validar = () => {
    const nuevosErrores = {};
    if (!form.cliente) nuevosErrores.cliente = 'Cliente requerido';
    if (!form.descripcion) nuevosErrores.descripcion = 'Descripción requerida';
    if (!form.estado) nuevosErrores.estado = 'Estado requerido';
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
      const actualizados = reclamos.map((r) =>
        r.id === editingId ? { ...form, id: editingId } : r
      );
      setReclamos(actualizados);
      setEditingId(null);
      setMensajeExito('Reclamo actualizado correctamente');
    } else {
      const nuevoReclamo = { ...form, id: Date.now() };
      setReclamos([...reclamos, nuevoReclamo]);
      setMensajeExito('Reclamo registrado correctamente');
    }
    setForm({ cliente: '', descripcion: '', estado: '' });
    setErrors({});
  };

  const handleEdit = (id) => {
    const reclamo = reclamos.find((r) => r.id === id);
    if (reclamo) {
      setForm(reclamo);
      setEditingId(id);
      setErrors({});
      setMensajeExito('');
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Seguro que quieres eliminar este reclamo?')) {
      setReclamos(reclamos.filter((r) => r.id !== id));
      setMensajeExito('Reclamo eliminado');
      if (editingId === id) {
        setEditingId(null);
        setForm({ cliente: '', descripcion: '', estado: '' });
        setErrors({});
      }
    }
  };

  return (
    <>
      <div className="header d-flex justify-content-between align-items-center mb-4">
        <div className="header-left d-flex align-items-center">
          <FaExclamationTriangle size={40} className="me-2" />
          <h1 className="h4 mb-0 ms-2">Gestión de Reclamos</h1>
        </div>
        <div className="d-flex align-items-center">
          <span>Administrador</span>
        </div>
      </div>
      <div className="admin-container">
        <div className="card">
          <div className="card-body">
            <h5>{editingId !== null ? 'Editar Reclamo' : 'Registrar Reclamo'}</h5>
            <form onSubmit={handleSubmit} noValidate>
              <input
                type="text"
                name="cliente"
                value={form.cliente}
                onChange={handleChange}
                placeholder="Cliente"
                className={`form-control mb-2 ${errors.cliente ? 'is-invalid' : ''}`}
              />
              <div className="invalid-feedback">{errors.cliente}</div>
              <input
                type="text"
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                placeholder="Descripción"
                className={`form-control mb-2 ${errors.descripcion ? 'is-invalid' : ''}`}
              />
              <div className="invalid-feedback">{errors.descripcion}</div>
              <input
                type="text"
                name="estado"
                value={form.estado}
                onChange={handleChange}
                placeholder="Estado"
                className={`form-control mb-2 ${errors.estado ? 'is-invalid' : ''}`}
              />
              <div className="invalid-feedback">{errors.estado}</div>
              <button type="submit" className="btn btn-primary me-2">
                {editingId !== null ? 'Actualizar' : 'Registrar'}
              </button>
              {mensajeExito && <span className="text-success ms-2">{mensajeExito}</span>}
            </form>
          </div>
        </div>

        <div className="card mt-4">
          <div className="card-body">
            <h5>Lista de Reclamos</h5>
            {reclamos.length === 0 ? (
              <p>No hay reclamos registrados.</p>
            ) : (
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Descripción</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {reclamos.map((reclamo) => (
                    <tr key={reclamo.id}>
                      <td>{reclamo.cliente}</td>
                      <td>{reclamo.descripcion}</td>
                      <td>{reclamo.estado}</td>
                      <td>
                        <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(reclamo.id)}>
                          <FaEdit /> Editar
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(reclamo.id)}>
                          <FaTrash /> Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ReclamosAdmin;