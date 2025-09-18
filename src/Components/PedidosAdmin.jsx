import React, { useState, useEffect } from 'react';
import { FaShoppingCart, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import './PedidosAdmin.css';

const PedidosAdmin = () => {
  const [pedidos, setPedidos] = useState([]);
  const [form, setForm] = useState({
    cliente: '',
    producto: '',
    cantidad: '',
    estado: '',
  });
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [mensajeExito, setMensajeExito] = useState('');

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem('pedidosTambo')) || [];
    setPedidos(guardados);
  }, []);

  useEffect(() => {
    localStorage.setItem('pedidosTambo', JSON.stringify(pedidos));
  }, [pedidos]);

  const validar = () => {
    const nuevosErrores = {};
    if (!form.cliente) nuevosErrores.cliente = 'Cliente requerido';
    if (!form.producto) nuevosErrores.producto = 'Producto requerido';
    if (!form.cantidad) nuevosErrores.cantidad = 'Cantidad requerida';
    else if (!Number.isInteger(Number(form.cantidad)) || Number(form.cantidad) <= 0) nuevosErrores.cantidad = 'Cantidad inválida';
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
      const actualizados = pedidos.map((p) =>
        p.id === editingId ? { ...form, id: editingId } : p
      );
      setPedidos(actualizados);
      setEditingId(null);
      setMensajeExito('Pedido actualizado correctamente');
    } else {
      const nuevoPedido = { ...form, id: Date.now() };
      setPedidos([...pedidos, nuevoPedido]);
      setMensajeExito('Pedido registrado correctamente');
    }
    setForm({ cliente: '', producto: '', cantidad: '', estado: '' });
    setErrors({});
  };

  const handleEdit = (id) => {
    const pedido = pedidos.find((p) => p.id === id);
    if (pedido) {
      setForm(pedido);
      setEditingId(id);
      setErrors({});
      setMensajeExito('');
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Seguro que quieres eliminar este pedido?')) {
      setPedidos(pedidos.filter((p) => p.id !== id));
      setMensajeExito('Pedido eliminado');
      if (editingId === id) {
        setEditingId(null);
        setForm({ cliente: '', producto: '', cantidad: '', estado: '' });
        setErrors({});
      }
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
              />
              <div className="invalid-feedback">{errors.cliente}</div>
              <input
                type="text"
                name="producto"
                value={form.producto}
                onChange={handleChange}
                placeholder="Producto"
                className={`form-control mb-2 ${errors.producto ? 'is-invalid' : ''}`}
              />
              <div className="invalid-feedback">{errors.producto}</div>
              <input
                type="number"
                name="cantidad"
                value={form.cantidad}
                onChange={handleChange}
                placeholder="Cantidad"
                className={`form-control mb-2 ${errors.cantidad ? 'is-invalid' : ''}`}
              />
              <div className="invalid-feedback">{errors.cantidad}</div>
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
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map((pedido) => (
                    <tr key={pedido.id}>
                      <td>{pedido.cliente}</td>
                      <td>{pedido.producto}</td>
                      <td>{pedido.cantidad}</td>
                      <td>{pedido.estado}</td>
                      <td>
                        <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(pedido.id)}>
                          <FaEdit /> Editar
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(pedido.id)}>
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