import React, { useState, useEffect } from 'react';
import { FaShoppingCart, FaEdit, FaTrash } from 'react-icons/fa';
import './PedidosAdmin.css';

const PedidosAdmin = () => {
  const [pedidos, setPedidos] = useState([]);
  const [form, setForm] = useState({ cliente: '', producto: '', cantidad: '' });
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [mensajeExito, setMensajeExito] = useState('');

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem('pedidosTambo')) || [];
    setPedidos(guardados);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validar = () => {
    const errores = {};
    if (!form.cliente) errores.cliente = 'Cliente es requerido';
    if (!form.producto) errores.producto = 'Producto es requerido';
    if (!form.cantidad) errores.cantidad = 'Cantidad es requerida';
    else if (!Number.isInteger(Number(form.cantidad)) || Number(form.cantidad) <= 0) errores.cantidad = 'Cantidad inválida';
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
      const nuevosPedidos = pedidos.map((p, idx) =>
        idx === editingId ? form : p
      );
      setPedidos(nuevosPedidos);
      localStorage.setItem('pedidosTambo', JSON.stringify(nuevosPedidos));
      setEditingId(null);
      setMensajeExito('Pedido actualizado correctamente');
    } else {
      const nuevosPedidos = [...pedidos, form];
      setPedidos(nuevosPedidos);
      localStorage.setItem('pedidosTambo', JSON.stringify(nuevosPedidos));
      setMensajeExito('Pedido registrado correctamente');
    }
    setForm({ cliente: '', producto: '', cantidad: '' });
    setErrors({});
  };

  const handleEdit = (idx) => {
    setForm(pedidos[idx]);
    setEditingId(idx);
    setErrors({});
    setMensajeExito('');
  };

  const handleDelete = (idx) => {
    const nuevosPedidos = pedidos.filter((_, i) => i !== idx);
    setPedidos(nuevosPedidos);
    localStorage.setItem('pedidosTambo', JSON.stringify(nuevosPedidos));
    setMensajeExito('Pedido eliminado');
    if (editingId === idx) {
      setEditingId(null);
      setForm({ cliente: '', producto: '', cantidad: '' });
      setErrors({});
    }
  };

  return (
    <>
      <div className="header d-flex justify-content-between align-items-center mb-4">
        <div className="header-left d-flex align-items-center">
          <FaShoppingCart size={40} className="me-2" />
          <h1 className="h4 mb-0 ms-2">Gestión de Pedidos</h1>
        </div>
        <div className="d-flex align-items-center">
          <span>Administrador</span>
        </div>
      </div>
      <div className="admin-container">
        <div className="card">
          <div className="card-body">
            <h5>{editingId !== null ? 'Editar Pedido' : 'Registrar Pedido'}</h5>
            <form onSubmit={handleSubmit} noValidate>
              <input
                type="text"
                name="cliente"
                value={form.cliente}
                onChange={handleChange}
                placeholder="Cliente"
                className={`form-control mb-2 ${errors.cliente ? 'is-invalid' : ''}`}
                required
              />
              {errors.cliente && <div className="invalid-feedback">{errors.cliente}</div>}

              <input
                type="text"
                name="producto"
                value={form.producto}
                onChange={handleChange}
                placeholder="Producto"
                className={`form-control mb-2 ${errors.producto ? 'is-invalid' : ''}`}
                required
              />
              {errors.producto && <div className="invalid-feedback">{errors.producto}</div>}

              <input
                type="number"
                name="cantidad"
                value={form.cantidad}
                onChange={handleChange}
                placeholder="Cantidad"
                className={`form-control mb-2 ${errors.cantidad ? 'is-invalid' : ''}`}
                required
              />
              {errors.cantidad && <div className="invalid-feedback">{errors.cantidad}</div>}

              <button type="submit" className="btn btn-primary me-2">
                {editingId !== null ? 'Actualizar' : 'Registrar'}
              </button>
              {mensajeExito && <span className="text-success ms-3">{mensajeExito}</span>}
            </form>
          </div>
        </div>

        <div className="card mt-4">
          <div className="card-body">
            <h5>Lista de Pedidos</h5>
            {pedidos.length === 0 ? (
              <p>No hay pedidos registrados.</p>
            ) : (
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map((pedido, idx) => (
                    <tr key={idx}>
                      <td>{pedido.cliente}</td>
                      <td>{pedido.producto}</td>
                      <td>{pedido.cantidad}</td>
                      <td>
                        <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(idx)}>
                          <FaEdit /> Editar
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(idx)}>
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

export default PedidosAdmin;