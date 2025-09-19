import React, { useState, useEffect } from 'react';
import { FaBoxOpen, FaEdit, FaTrash } from 'react-icons/fa';
import './ProductosAdmin.css';

const ProductosAdmin = () => {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({ nombre: '', precio: '', stock: '' });
  const [editingId, setEditingId] = useState(null);

  // Leer productos del localStorage al iniciar
  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem('productosTambo')) || [];
    setProductos(guardados);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId !== null) {
      // Actualizar producto existente
      const nuevosProductos = productos.map((p, idx) =>
        idx === editingId ? form : p
      );
      setProductos(nuevosProductos);
      localStorage.setItem('productosTambo', JSON.stringify(nuevosProductos));
      setEditingId(null);
    } else {
      // Agregar nuevo producto
      const nuevosProductos = [...productos, form];
      setProductos(nuevosProductos);
      localStorage.setItem('productosTambo', JSON.stringify(nuevosProductos));
    }
    setForm({ nombre: '', precio: '', stock: '' });
  };

  const handleEdit = (idx) => {
    setForm(productos[idx]);
    setEditingId(idx);
  };

  const handleDelete = (idx) => {
    const nuevosProductos = productos.filter((_, i) => i !== idx);
    setProductos(nuevosProductos);
    localStorage.setItem('productosTambo', JSON.stringify(nuevosProductos));
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
                className="form-control mb-2"
                required
              />
              <input
                type="number"
                name="precio"
                value={form.precio}
                onChange={handleChange}
                placeholder="Precio"
                className="form-control mb-2"
                required
              />
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="Stock"
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
            <h5>Lista de Productos</h5>
            {productos.length === 0 ? (
              <p>No hay productos registrados.</p>
            ) : (
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((producto, idx) => (
                    <tr key={idx}>
                      <td>{producto.nombre}</td>
                      <td>{producto.precio}</td>
                      <td>{producto.stock}</td>
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

export default ProductosAdmin;