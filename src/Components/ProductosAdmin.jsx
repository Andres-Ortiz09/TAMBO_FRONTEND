import React, { useState, useEffect } from 'react';
import { FaBoxOpen, FaEdit, FaTrash } from 'react-icons/fa';
import API from '../api';
import './ProductosAdmin.css';

const categorias = ['Bebidas', 'Comidas', 'Snacks', 'Licores'];

const formatPrecio = (precio) => `S/.${precio}`;

const ProductosAdmin = () => {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({
    name: '',
    price: '',
    stock: '',
    image: '',
    category: '',
    description: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [mensajeExito, setMensajeExito] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const res = await API.get('/products');
      console.log("Productos cargados:", res.data);
      setProductos(res.data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  };

  // Validaciones frontend
  const validar = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = 'El nombre es obligatorio';
    else if (form.name.length > 100) newErrors.name = 'Máximo 100 caracteres';

    if (!form.price) newErrors.price = 'El precio es obligatorio';
    else if (isNaN(form.price) || Number(form.price) <= 0)
      newErrors.price = 'Debe ser un número positivo';

    if (form.stock === '') newErrors.stock = 'El stock es obligatorio';
    else if (!Number.isInteger(Number(form.stock)) || Number(form.stock) < 0)
      newErrors.stock = 'Debe ser un número entero positivo';

    if (!form.category) newErrors.category = 'Seleccione una categoría';

    if (!form.image) newErrors.image = 'La imagen es obligatoria';

    if (!form.description.trim()) newErrors.description = 'La descripción es obligatoria';
    else if (form.description.length > 255)
      newErrors.description = 'Máximo 255 caracteres';

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Bloquear negativos en campos numéricos
    if (name === 'price' || name === 'stock') {
      if (Number(value) < 0) return;
    }

    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, image: reader.result });
      setErrors({ ...errors, image: '' });
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const valErrors = validar();
    if (Object.keys(valErrors).length > 0) {
      setErrors(valErrors);
      setMensajeExito('');
      return;
    }

    try {
      if (editingId) {
        await API.put(`/products/${editingId}`, form);
        setMensajeExito('Producto actualizado correctamente');
      } else {
        await API.post('/products', form);
        setMensajeExito('Producto registrado correctamente');
      }

      setForm({
        name: '',
        price: '',
        stock: '',
        image: '',
        category: '',
        description: '',
      });
      setEditingId(null);
      cargarProductos();
    } catch (error) {
      console.error('Error al guardar producto:', error);
    }
  };

  const handleEdit = (producto) => {
    setForm(producto);
    setEditingId(producto.id);
    setMensajeExito('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto?')) return;
    try {
      await API.delete(`/products/${id}`);
      setMensajeExito('Producto eliminado correctamente');
      cargarProductos();
    } catch (error) {
      console.error('Error al eliminar producto:', error);
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
        {/* FORMULARIO */}
        <div className="card">
          <div className="card-body">
            <h5>{editingId ? 'Editar Producto' : 'Registrar Producto'}</h5>
            <form onSubmit={handleSubmit} noValidate>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nombre"
                className={`form-control mb-2 ${errors.name ? 'is-invalid' : ''}`}
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}

              <div className="input-group mb-2">
                <span className="input-group-text">S/.</span>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Precio"
                  min="0"
                  step="0.01"
                  className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                />
              </div>
              {errors.price && <div className="invalid-feedback d-block">{errors.price}</div>}

              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="Stock"
                min="0"
                className={`form-control mb-2 ${errors.stock ? 'is-invalid' : ''}`}
              />
              {errors.stock && <div className="invalid-feedback">{errors.stock}</div>}

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className={`form-control mb-2 ${errors.category ? 'is-invalid' : ''}`}
              >
                <option value="">Seleccione una categoría</option>
                {categorias.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && <div className="invalid-feedback">{errors.category}</div>}

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Descripción"
                maxLength="255"
                className={`form-control mb-2 ${errors.description ? 'is-invalid' : ''}`}
              />
              {errors.description && <div className="invalid-feedback">{errors.description}</div>}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={`form-control mb-2 ${errors.image ? 'is-invalid' : ''}`}
              />
              {errors.image && <div className="invalid-feedback d-block">{errors.image}</div>}

              {form.image && (
                <img
                  src={form.image}
                  alt="Previsualización"
                  style={{
                    width: 100,
                    height: 100,
                    objectFit: 'cover',
                    marginBottom: '10px',
                  }}
                />
              )}

              <button type="submit" className="btn btn-primary me-2">
                {editingId ? 'Actualizar' : 'Registrar'}
              </button>
              {mensajeExito && <span className="text-success ms-3">{mensajeExito}</span>}
            </form>
          </div>
        </div>

        {/* LISTA DE PRODUCTOS */}
        <div className="card mt-4">
          <div className="card-body">
            <h5>Lista de Productos</h5>
            {productos.length === 0 ? (
              <p>No hay productos registrados.</p>
            ) : (
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Categoría</th>
                    <th>Descripción</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((producto) => (
                    <tr key={producto.id}>
                      <td>
                        {producto.image ? (
                          <img
                            src={producto.image}
                            alt={producto.name}
                            style={{
                              width: 50,
                              height: 50,
                              objectFit: 'cover',
                            }}
                          />
                        ) : (
                          'Sin imagen'
                        )}
                      </td>
                      <td>{producto.name}</td>
                      <td>{formatPrecio(producto.price)}</td>
                      <td>{producto.stock}</td>
                      <td>{producto.category}</td>
                      <td>{producto.description}</td>
                      <td>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => handleEdit(producto)}
                        >
                          <FaEdit /> Editar
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(producto.id)}
                        >
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
