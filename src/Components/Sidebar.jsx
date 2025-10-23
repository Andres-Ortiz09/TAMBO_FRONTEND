import React from 'react';
import { FaHome, FaUsers, FaBoxOpen, FaShoppingCart, FaSignOutAlt } from 'react-icons/fa';
import logo from '../assets/img/logo-tambo2.png';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ setVista, vista }) => {
  const navigate = useNavigate();

  // Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('registroUsuario'); // limpiar sesión
    navigate('/'); // volver al inicio
  };

  return (
    <nav className="sidebar">
      {/* Logo */}
      <a href="#" className="sidebar-logo-link">
        <img src={logo} alt="Logo Tambo" className="sidebar-logo-img" />
      </a>

      <hr />

      {/* Navegación */}
      <ul className="nav flex-column mb-auto">
        <li>
          <a
            href="#"
            className={`nav-link ${vista === 'dashboard' ? 'active' : ''}`}
            onClick={() => setVista('dashboard')} // Solo dashboard tiene acción
          >
            <FaHome className="me-2" /> Dashboard
          </a>
        </li>
        <li>
          <span
            className={`nav-link ${vista === 'usuarios' ? 'active' : ''}`}
            style={{ cursor: 'default', color: 'inherit' }}
          >
            <FaUsers className="me-2" /> Usuarios
          </span>
        </li>
        <li>
          <span
            className={`nav-link ${vista === 'productos' ? 'active' : ''}`}
            style={{ cursor: 'default', color: 'inherit' }}
          >
            <FaBoxOpen className="me-2" /> Productos
          </span>
        </li>
        <li>
          <span
            className={`nav-link ${vista === 'pedidos' ? 'active' : ''}`}
            style={{ cursor: 'default', color: 'inherit' }}
          >
            <FaShoppingCart className="me-2" /> Pedidos
          </span>
        </li>
      </ul>

      <hr />

      {/* Botón cerrar sesión */}
      <div className="mt-auto">
        <button className="btn btn-outline-danger w-100" onClick={handleLogout}>
          <FaSignOutAlt className="me-2" /> Cerrar sesión
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;