import React, { useEffect, useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/img/logo-tambo2.png';
import { getCurrentUser } from '../api';
import Productos from "./Productos";

export default function Inicio({ carrito, agregarAlCarrito, eliminarDelCarrito, actualizarCantidad }) {
  const [user, setUser] = useState(null);
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setAnimate(true);
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

  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <div style={styles.container}>
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
              <div style={styles.welcomeWrapper}>
                <span style={styles.welcome}>Bienvenido, {user.firstName || user.name || "Usuario"}</span>
                <div style={styles.carritoWrapper} onClick={() => navigate('/carrito')} title="Ir al carrito">
                  <span style={styles.carritoIcon}>🛒</span>
                  {totalItems > 0 && <span style={styles.badge}>{totalItems}</span>}
                </div>
              </div>
              <button style={styles.btnLogout} onClick={handleLogout}>Cerrar Sesión</button>
            </div>
          )}
        </nav>
      </header>

      <Productos agregarAlCarrito={agregarAlCarrito} />

      <footer style={styles.footerBottom}>
        <p>© 2025 Tambo. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    backgroundColor: "#f3e5f5",
    color: "#4a148c",
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
    objectFit: "contain"
  },
  nav: { display: "flex", alignItems: "center", gap: "1rem" },
  navLink: {
    color: "white",
    textDecoration: "none",
    fontWeight: 600,
    padding: "0.5rem 1rem",
    borderRadius: "20px",
    transition: "0.3s",
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
  carritoWrapper: {
    position: 'relative',
    display: 'inline-block',
    marginLeft: '0.5rem',
  },

  carritoIcon: {
    fontSize: '1.8rem',
    color: 'white',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
  },

  badge: {
    position: 'absolute',
    top: '-6px',
    right: '-10px',
    backgroundColor: '#ff5252',
    color: 'white',
    borderRadius: '50%',
    padding: '2px 6px',
    fontSize: '0.7rem',
    fontWeight: 'bold',
    boxShadow: '0 0 0 2px #7b1fa2', 
  },

  footerBottom: {
    backgroundColor: "#ce996dff",
    color: "white",
    textAlign: "center",
    padding: "1rem",
    fontWeight: 600,
  },
};
