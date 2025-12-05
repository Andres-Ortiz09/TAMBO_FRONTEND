import React, { useEffect, useState } from 'react';
import API from '../api';
import './Productos.css';

const categorias = ['Todos', 'Bebidas', 'Comidas', 'Snacks', 'Licores'];

const Productos = ({ agregarAlCarrito }) => {
  const [productos, setProductos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');
  const [paginaActual, setPaginaActual] = useState(1);
  const [loading, setLoading] = useState(true);
  const productosPorPagina = 12;

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        const res = await API.get('/products');
        setProductos(res.data);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  const productosFiltrados =
    categoriaSeleccionada === 'Todos'
      ? productos
      : productos.filter((p) => p.category === categoriaSeleccionada);

  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);
  const indiceInicio = (paginaActual - 1) * productosPorPagina;
  const productosPagina = productosFiltrados.slice(indiceInicio, indiceInicio + productosPorPagina);

  const cambiarPagina = (num) => {
    if (num >= 1 && num <= totalPaginas) {
      setPaginaActual(num);
    }
  };

  // bloquea toda interacción mientras carga
  const bloqueoEstilo = loading ? { pointerEvents: "none", opacity: 0.5 } : {};

  return (
    <>
      {/* SPINNER */}
      {loading && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
          <p>Cargando productos...</p>
        </div>
      )}

      <div className="productos-layout" style={bloqueoEstilo}>
        <aside className="sidebar-categorias">
          <h2>Categorías</h2>
          <ul>
            {categorias.map((cat) => (
              <li
                key={cat}
                className={cat === categoriaSeleccionada ? 'categoria-activa' : ''}
                onClick={() => {
                  setCategoriaSeleccionada(cat);
                  setPaginaActual(1);
                }}
              >
                {cat}
              </li>
            ))}
          </ul>
        </aside>

        <div className="productos-publicos-container">
          <h1 className="productos-publicos-title">Nuestros Productos</h1>

          {productosPagina.length === 0 ? (
            <p>No hay productos en esta categoría.</p>
          ) : (
            <>
              <div className="productos-horizontal-scroll">
                {productosPagina.map((p) => (
                  <div key={p.id} className="producto-card-horizontal">
                    <div className="producto-img-container">
                      <img src={p.image} alt={p.name} className="producto-img" />
                      {p.promo && <span className="producto-promo">{p.promo}</span>}
                    </div>
                    <div className="producto-info">
                      <h3 className="producto-nombre" title={p.name}>{p.name}</h3>
                      <p className="producto-descripcion" title={p.description}>{p.description}</p>
                      <div className="producto-precio-carrito">
                        <span className="producto-precio">S/.{p.price}</span>
                        <button className="btn-agregar" onClick={() => agregarAlCarrito(p)}>
                          Agregar al carrito
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="paginacion">
                {[...Array(totalPaginas)].map((_, i) => (
                  <button
                    key={i + 1}
                    className={`pagina-btn ${paginaActual === i + 1 ? 'pagina-activa' : ''}`}
                    onClick={() => cambiarPagina(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Productos;

