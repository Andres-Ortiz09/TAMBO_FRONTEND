import React, { useState, useEffect } from 'react';
import { FaBoxOpen, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import './ProductosAdmin.css';

const ProductosAdmin = () => {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
  });
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [mensajeExito, setMensajeExito] = useState('');

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem('productosTambo')) || [];
    setProductos(guardados);
  }, []);

  useEffect(() => {
    localStorage.setItem('productosTambo', JSON.stringify(productos));
  }, [productos]);

  const validar = () => {
    const nuevosErrores = {};
    if (!form.nombre) nuevosErrores.nombre = 'Nombre requerido';
    if (!form.descripcion) nuevosErrores.descripcion = 'Descripción requerida';
    if (!form.precio) nuevosErrores.precio = 'Precio requerido';
    else if (isNaN(form.precio) || Number(form.precio) <= 0) nuevosErrores.precio = 'Precio inválido';
    if (!form.stock) nuevosErrores.stock = 'Stock requerido';
    else if (!Number.isInteger(Number(form.stock)) || Number(form.stock) < 0) nuevosErrores.stock = 'Stock inválido';
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
      const actualizados = productos.map((p) =>
        p.id === editingId ? { ...form, id: editingId } : p
      );
      setProductos(actualizados);
      setEditingId(null);
      setMensajeExito('Producto actualizado correctamente');
    } else {
      const nuevoProducto = { ...form, id: Date.now() };
      setProductos([...productos, nuevoProducto]);
      setMensajeExito('Producto registrado correctamente');
    }
    setForm({ nombre: '', descripcion: '', precio: '', stock: '' });
    setErrors({});
  };

  const handleEdit = (id) => {
    const producto = productos.find((p) => p.id === id);
    if (producto) {
      setForm(producto);
      setEditingId(id);
      setErrors({});
      setMensajeExito('');
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Seguro que quieres eliminar este producto?')) {
      setProductos(productos.filter((p) => p.id !== id));
      setMensajeExito('Producto eliminado');
      if (editingId === id) {
        setEditingId(null);
        setForm({ nombre: '', descripcion: '', precio: '', stock: '' });
        setErrors({});
      }
    }
  };

  return (
    <>
      <div className="header d-flex justify-content-between align-items-center mb-4">
        <div className="header-left d-flex align-items-center">
          <FaBoxOpen size={40} className="me-2" />
          <h1 className="h4 mb-0 ms-2">Gestión de Productos</h1>
        </div>
        <div className="d-flex align-items-center">
          <span>Administrador</span>
        </div>
      </div>

      <div className="admin-container">
        <div className="card">
          <div className="card-body">
            <h5>{editingId !== null ? 'Editar Producto' : 'Registrar Producto'}</h5>
            <form onSubmit={handleSubmit} noValidate>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Nombre"
                className={`form-control mb-2 ${errors.nombre ? 'is-invalid' : ''}`}
              />
              <div className="invalid-feedback">{errors.nombre}</div>
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
                type="number"
                name="precio"
                value={form.precio}
                onChange={handleChange}
                placeholder="Precio"
                className={`form-control mb-2 ${errors.precio ? 'is-invalid' : ''}`}
              />
              <div className="invalid-feedback">{errors.precio}</div>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="Stock"
                className={`form-control mb-2 ${errors.stock ? 'is-invalid' : ''}`}
              />
              <div className="invalid-feedback">{errors.stock}</div>
              <button type="submit" className="btn btn-primary me-2">
                {editingId !== null ? 'Actualizar' : 'Registrar'}
              </button>
              {mensajeExito && <span className="text-success ms-2">{mensajeExito}</span>}
            </form>
          </div>
        </div>

        <div className="card mt-4">
          <div className="card-body">
            <h5>Lista de Productos</h5>
            {productos.length === 0 ? (
              <p>No hay productos registrados.</p>
            ) : (
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((producto) => (
                    <tr key={producto.id}>
                      <td>{producto.nombre}</td>
                      <td>{producto.descripcion}</td>
                      <td>{producto.precio}</td>
                      <td>{producto.stock}</td>
                      <td>
                        <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(producto.id)}>
                          <FaEdit /> Editar
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(producto.id)}>
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

export default ProductosAdmin;