import React from 'react';
import { FaHome, FaUsers, FaBoxOpen, FaShoppingCart, FaExclamationTriangle, FaSignOutAlt } from 'react-icons/fa';
import logo from '../assets/img/logo-tambo2.png';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <nav className="sidebar">
      <a href="/" className="sidebar-logo-link">
        <img src={logo} alt="Logo" className="sidebar-logo-img" />
      </a>

      <hr />

      <ul className="nav flex-column mb-auto">
        <li><a href="#" className="nav-link"><FaHome className="me-2" />Inicio</a></li>
        <li><a href="#" className="nav-link active"><FaUsers className="me-2" />Usuarios</a></li>
        <li><a href="#" className="nav-link"><FaBoxOpen className="me-2" />Productos</a></li>
        <li><a href="#" className="nav-link"><FaShoppingCart className="me-2" />Pedidos</a></li>
        <li><a href="#" className="nav-link"><FaExclamationTriangle className="me-2" />Reclamos</a></li>
      </ul>

      <hr />

      <div className="mt-auto">
        <button className="btn btn-outline-danger w-100">
          <FaSignOutAlt className="me-2" />Cerrar sesión
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;