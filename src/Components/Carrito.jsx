import React, { useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/img/logo-tambo2.png'; // Asegúrate de importar el logo correctamente
import { getCurrentUser } from '../api';
import './Carrito.css';

const Carrito = ({ carrito, actualizarCantidad, eliminarDelCarrito }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const total = carrito.reduce((acc, item) => acc + item.price * item.cantidad, 0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getCurrentUser(token)
        .then(u => setUser(u))
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const irAComprar = () => {
    localStorage.setItem("carritoParaPago", JSON.stringify(carrito));
    navigate("/checkout");
  };

  // Función para eliminar todos los productos del carrito
  const eliminarTodoDelCarrito = () => {
    // Llamamos al método de eliminar todos los productos
    carrito.forEach(item => eliminarDelCarrito(item.id)); // Eliminar cada producto
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logoWrapper}>
          <img src={logo} alt="Logo Tambo" style={styles.logotambo} />
        </div>

        <nav style={styles.nav}>
          {!user ? (
            <>
              <Link to="/login" style={styles.navLink}>Iniciar Sesión</Link>
              <Link to="/registro" style={styles.navLink}>Registrarse</Link>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={styles.welcome}>Bienvenido, {user.firstName || user.name || "Usuario"}</span>
              <button style={styles.btnLogout} onClick={handleLogout}>Cerrar Sesión</button>
            </div>
          )}
        </nav>
      </header>

      {/* Carrito Section */}
      <section className="carrito-seccion">
        <div className="carrito-tabla-container">
          <h2>🛒 Carrito de Compras</h2>
          {carrito.length === 0 ? (
            <p className="carrito-vacio">Tu carrito está vacío.</p>
          ) : (
            <>
              <table className="carrito-tabla">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Descripción</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Total</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {carrito.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.description || "—"}</td>
                      <td>S/.{item.price.toFixed(2)}</td>
                      <td>
                        <div className="cantidad-controles">
                          <button
                            onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                            disabled={item.cantidad <= 1}
                          >
                            −
                          </button>
                          <span>{item.cantidad}</span>
                          <button
                            onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td>S/.{(item.price * item.cantidad).toFixed(2)}</td>
                      <td>
                        <button
                          className="btn-eliminar"
                          onClick={() => eliminarDelCarrito(item.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="carrito-total">Total: S/.{total.toFixed(2)}</div>
            </>
          )}

          {/* Botones acciones siempre visibles */}
          <div className="carrito-acciones">
            <button className="btn-volver" onClick={() => navigate(-1)}>
              Volver
            </button>
            {carrito.length > 0 && (
              <>
                <button className="btn-comprar" onClick={irAComprar}>
                  Comprar
                </button>
                {/* Botón para eliminar todos los productos del carrito */}
                <button className="btn-eliminar-todo" onClick={eliminarTodoDelCarrito}>
                  Eliminar Todo
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footerBottom}>
        <p>© 2025 Tambo. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    backgroundColor: "#f3e5f5",
    color: "#4a148c",
    margin: 0,
    padding: 0,
    boxSizing: "border-box",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    backgroundColor: "#58007eff",
    color: "white",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  logoWrapper: { flex: "0 0 auto" },
  logotambo: {
    height: "50px",
    width: "auto",
    objectFit: "contain",
  },
  nav: { display: "flex", alignItems: "center", gap: '1rem' },
  navLink: {
    color: "white",
    textDecoration: "none",
    fontWeight: 600,
    padding: "0.5rem 1rem",
    borderRadius: "20px",
    backgroundColor: "#9c27b0",
  },
  welcome: { fontWeight: 600, marginRight: "1rem" },
  btnLogout: {
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "20px",
    backgroundColor: "#d500f9",
    color: "white",
    fontWeight: 600,
    cursor: "pointer",
  },
  footerBottom: {
    backgroundColor: "#ce996dff",
    color: "white",
    textAlign: "center",
    padding: "0.5rem 0",  
    fontWeight: 600,
    marginTop: "auto",  
  },
  // Estilo para el botón "Eliminar todo"
  btnEliminarTodo: {
    padding: "0.5rem 1rem",
    backgroundColor: "#ff0000",  
    color: "white",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    fontWeight: 600,
    marginTop: "10px",  
  },
};

export default Carrito;
