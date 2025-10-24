import React, { useState, useEffect } from 'react';
import './ReclamosAdmin.css';

const estados = ['Pendiente', 'Resuelto'];

const ReclamosAdmin = () => {
  const [reclamos, setReclamos] = useState(() => {
    return JSON.parse(localStorage.getItem('reclamosTambo')) || [];
  });

  const [form, setForm] = useState({ cliente: '', detalle: '', estado: 'Pendiente' });
  const [editingId, setEditingId] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [detalleExpandido, setDetalleExpandido] = useState(null);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    localStorage.setItem('reclamosTambo', JSON.stringify(reclamos));
  }, [reclamos]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.cliente.trim() || !form.detalle.trim()) {
      setMensaje('Completa todos los campos.');
      return;
    }
    if (editingId !== null) {
      setReclamos(reclamos.map((r, idx) => (idx === editingId ? form : r)));
      setMensaje('Reclamo actualizado correctamente.');
      setEditingId(null);
    } else {
      setReclamos([{ ...form }, ...reclamos]);
      setMensaje('Reclamo registrado correctamente.');
    }
    setForm({ cliente: '', detalle: '', estado: 'Pendiente' });
    setTimeout(() => setMensaje(''), 2000);
  };

  const handleEdit = (idx) => {
    setForm(reclamos[idx]);
    setEditingId(idx);
  };

  const handleDelete = (idx) => {
    if (window.confirm('¿Seguro que deseas eliminar este reclamo?')) {
      setReclamos(reclamos.filter((_, i) => i !== idx));
    }
  };

  const handleEstado = (idx) => {
    const nuevoEstado = reclamos[idx].estado === 'Pendiente' ? 'Resuelto' : 'Pendiente';
    setReclamos(
      reclamos.map((r, i) => (i === idx ? { ...r, estado: nuevoEstado } : r))
    );
  };

  const reclamosFiltrados = reclamos.filter(r => {
    const coincideBusqueda =
      r.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.estado.toLowerCase().includes(busqueda.toLowerCase());

    const coincideEstado =
      filtroEstado === 'Todos' || r.estado === filtroEstado;

    return coincideBusqueda && coincideEstado;
  });

  const total = reclamos.length;
  const pendientes = reclamos.filter(r => r.estado === 'Pendiente').length;
  const resueltos = reclamos.filter(r => r.estado === 'Resuelto').length;

  return (
    <div className="reclamos-admin-container">
      <h2 className="reclamos-admin-title">Gestión de Reclamos</h2>

      <div className="reclamos-admin-cards">
        <div className="reclamos-admin-card reclamos-admin-card-total">
          <span>Total Reclamos</span>
          <span>{total}</span>
        </div>
        <div className="reclamos-admin-card reclamos-admin-card-pendientes">
          <span>Pendientes</span>
          <span>{pendientes}</span>
        </div>
        <div className="reclamos-admin-card reclamos-admin-card-resueltos">
          <span>Resueltos</span>
          <span>{resueltos}</span>
        </div>
      </div>


      <div className="reclamos-admin-busqueda">
        <input
          type="text"
          placeholder="Buscar por cliente o estado..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
        <select
          value={filtroEstado}
          onChange={e => setFiltroEstado(e.target.value)}
          className="ms-2"
        >
          <option value="Todos">Todos</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Resuelto">Resuelto</option>
        </select>
        <span className="ms-3">
          Mostrando <b>{reclamosFiltrados.length}</b> reclamos
        </span>
      </div>

      <div className="reclamos-admin-table-container">
        <table className="reclamos-admin-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Detalle</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reclamosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={4} className="reclamos-admin-table-empty">
                  No hay reclamos registrados.
                </td>
              </tr>
            ) : (
              reclamosFiltrados.map((r, idx) => (
                <tr key={idx}>
                  <td>{r.cliente}</td>
                  <td>
                    <div className={`detalle-wrapper ${detalleExpandido === idx ? 'expandido' : ''}`}>
                      <div className="detalle-contenido">
                        {detalleExpandido === idx
                          ? r.detalle
                          : r.detalle.length > 50
                            ? `${r.detalle.slice(0, 50)}...`
                            : r.detalle}
                      </div>
                      {r.detalle.length > 50 && (
                        <button
                          className="btn-ver-toggle"
                          onClick={() =>
                            setDetalleExpandido(detalleExpandido === idx ? null : idx)
                          }
                        >
                          {detalleExpandido === idx ? 'Ver menos' : 'Ver más'}
                        </button>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`reclamos-admin-estado ${r.estado === 'Pendiente' ? 'pendiente' : 'resuelto'}`}>
                      {r.estado}
                    </span>
                  </td>
                  <td>
                    <button className="btn-estado" onClick={() => handleEstado(idx)}>
                      {r.estado === 'Pendiente' ? 'Marcar Resuelto' : 'Marcar Pendiente'}
                    </button>
                    <button className="btn-eliminar" onClick={() => handleDelete(idx)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReclamosAdmin;
