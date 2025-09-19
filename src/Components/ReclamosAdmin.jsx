import React, { useState, useEffect } from 'react';
import { FaExclamationTriangle, FaEdit, FaTrash } from 'react-icons/fa';
import './ReclamosAdmin.css';

const ReclamosAdmin = () => {
  const [reclamos, setReclamos] = useState([]);
  const [form, setForm] = useState({ cliente: '', detalle: '' });
  const [editingId, setEditingId] = useState(null);

  // Leer reclamos al montar
  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem('reclamosTambo')) || [];
    setReclamos(guardados);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId !== null) {
      const nuevosReclamos = reclamos.map((r, idx) =>
        idx === editingId ? form : r
      );
      setReclamos(nuevosReclamos);
      localStorage.setItem('reclamosTambo', JSON.stringify(nuevosReclamos));
      setEditingId(null);
    } else {
      const nuevosReclamos = [...reclamos, form];
      setReclamos(nuevosReclamos);
      localStorage.setItem('reclamosTambo', JSON.stringify(nuevosReclamos));
    }
    setForm({ cliente: '', detalle: '' });
  };

  const handleEdit = (idx) => {
    setForm(reclamos[idx]);
    setEditingId(idx);
  };

  const handleDelete = (idx) => {
    const nuevosReclamos = reclamos.filter((_, i) => i !== idx);
    setReclamos(nuevosReclamos);
    localStorage.setItem('reclamosTambo', JSON.stringify(nuevosReclamos));
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
                className="form-control mb-2"
                required
              />
              <input
                type="text"
                name="detalle"
                value={form.detalle}
                onChange={handleChange}
                placeholder="Detalle"
                className="form-control mb-2"
                required
              />
              <button type="submit" className="btn btn-primary me-2">
                {editingId !== null ? 'Actualizar' : 'Registrar'}
              </button>
            </form>
          </div>
        </div>

        <div className="card mt-4">
          <div className="card-body">
            <h5>Lista de Reclamos</h5>
            {reclamos.length === 0 ? (
              <p>No hay reclamos registrados.</p>
            ) : (
              <ul className="list-group">
                {reclamos.map((reclamo, idx) => (
                  <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                    {reclamo.cliente} - {reclamo.detalle}
                    <div>
                      <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(idx)}>
                        <FaEdit /> Editar
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(idx)}>
                        <FaTrash /> Eliminar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ReclamosAdmin;