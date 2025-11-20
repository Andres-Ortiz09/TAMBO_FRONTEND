import React, { useEffect, useState } from 'react';
import {
  FaHome,
  FaUsers,
  FaBoxOpen,
  FaSignOutAlt,
  FaUserTie
} from 'react-icons/fa';
import logo from '../assets/img/logo-tambo2.png';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ setVista, vista }) => {
  const navigate = useNavigate();
  const [nombreAdmin, setNombreAdmin] = useState('');

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('registroUsuario'));
    if (usuario && usuario.firstName) {
      setNombreAdmin(usuario.firstName);
    } else {
      setNombreAdmin('Administrador');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('registroUsuario');
    navigate('/');
  };

  return (
    <nav className="sidebar">
      <a href="#" className="sidebar-logo-link">
        <img src={logo} alt="Logo Tambo" className="sidebar-logo-img" />
      </a>

      <div className="sidebar-welcome">
        <FaUserTie className="sidebar-admin-icon" />
        <div>
          <p className="sidebar-welcome-title">Bienvenido</p>
          <p className="sidebar-welcome-name">{nombreAdmin}</p>
        </div>
      </div>

      <hr />

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
      </ul>

      <hr />

      <div className="mt-auto">
        <button className="btn btn-outline-danger w-100" onClick={handleLogout}>
          <FaSignOutAlt className="me-2" /> Cerrar sesión
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;

