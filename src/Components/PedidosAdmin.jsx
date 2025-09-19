import React, { useState, useEffect } from 'react';
import { FaShoppingCart, FaEdit, FaTrash } from 'react-icons/fa';
import './PedidosAdmin.css';

const PedidosAdmin = () => {
  const [pedidos, setPedidos] = useState([]);
  const [form, setForm] = useState({ cliente: '', producto: '', cantidad: '' });
  const [editingId, setEditingId] = useState(null);

  // Leer pedidos al montar
  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem('pedidosTambo')) || [];
    setPedidos(guardados);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId !== null) {
      const nuevosPedidos = pedidos.map((p, idx) =>
        idx === editingId ? form : p
      );
      setPedidos(nuevosPedidos);
      localStorage.setItem('pedidosTambo', JSON.stringify(nuevosPedidos));
      setEditingId(null);
    } else {
      const nuevosPedidos = [...pedidos, form];
      setPedidos(nuevosPedidos);
      localStorage.setItem('pedidosTambo', JSON.stringify(nuevosPedidos));
    }
    setForm({ cliente: '', producto: '', cantidad: '' });
  };

  const handleEdit = (idx) => {
    setForm(pedidos[idx]);
    setEditingId(idx);
  };

  const handleDelete = (idx) => {
    const nuevosPedidos = pedidos.filter((_, i) => i !== idx);
    setPedidos(nuevosPedidos);
    localStorage.setItem('pedidosTambo', JSON.stringify(nuevosPedidos));
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
                className="form-control mb-2"
                required
              />
              <input
                type="text"
                name="producto"
                value={form.producto}
                onChange={handleChange}
                placeholder="Producto"
                className="form-control mb-2"
                required
              />
              <input
                type="number"
                name="cantidad"
                value={form.cantidad}
                onChange={handleChange}
                placeholder="Cantidad"
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