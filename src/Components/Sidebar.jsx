import React, { useEffect, useState } from 'react';
import { FaHome, FaUsers, FaBoxOpen, FaShoppingCart, FaSignOutAlt, FaUserTie } from 'react-icons/fa';
import logo from '../assets/img/logo-tambo2.png';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ setVista, vista }) => {
  const navigate = useNavigate();
  const [nombreAdmin, setNombreAdmin] = useState("");

  // Recuperar datos del usuario logueado
  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("registroUsuario"));
    if (usuario && usuario.firstName) {
      setNombreAdmin(usuario.firstName);
    } else {
      setNombreAdmin("Administrador");
    }
  }, []);

  // Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('registroUsuario');

    //Redirigir al inicio
    navigate('/');
  };

  return (
    <nav className="sidebar">
      {/* Logo */}
      <a href="#" className="sidebar-logo-link">
        <img src={logo} alt="Logo Tambo" className="sidebar-logo-img" />
      </a>

      {/*Sección de bienvenida */}
      <div className="sidebar-welcome">
        <FaUserTie className="sidebar-admin-icon" />
        <div>
          <p className="sidebar-welcome-title">Bienvenido</p>
          <p className="sidebar-welcome-name">{nombreAdmin}</p>
        </div>
      </div>

      <hr />

      {/* Navegación */}
      <ul className="nav flex-column mb-auto">
        <li>
          <a
            href="#"
            className={`nav-link ${vista === 'dashboard' ? 'active' : ''}`}
            onClick={() => setVista('dashboard')}
          >
            <FaHome className="me-2" /> Dashboard
          </a>
        </li>
        <li>
          <span
            className={`nav-link ${vista === 'usuarios' ? 'active' : ''}`}
            onClick={() => setVista('usuarios')}
            style={{ cursor: 'pointer' }}
          >
            <FaUsers className="me-2" /> Usuarios
          </span>
        </li>
        <li>
          <span
            className={`nav-link ${vista === 'productos' ? 'active' : ''}`}
            onClick={() => setVista('productos')}
            style={{ cursor: 'pointer' }}
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
