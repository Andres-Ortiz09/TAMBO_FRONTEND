import React, { useState, useEffect } from 'react';
import { FaUsers, FaHome, FaBoxOpen, FaShoppingCart, FaExclamationTriangle, FaSignOutAlt } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UsuarioAdmin.css';
import logo from '../assets/img/logo-tambo2.png';

const UsuarioAdmin = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="app-container d-flex">
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

      <main className="content-container">
        <header className="header">
          <div className="header-left">
            <img src="https://img.icons8.com/ios-filled/50/000000/cow.png" alt="Logo Tambo" />
            <h1 className="h4 mb-0">Gestión de Usuarios</h1>
          </div>
          <div className="d-flex align-items-center">
            <span>Administrador</span>
          </div>
        </header>

        <div className="card shadow-sm">
          <div className="card-body">
            <h5>Registrar Usuario</h5>
            <form onSubmit={handleSubmit} noValidate>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <input type="text" name="firstName" value={form.firstName} onChange={handleChange} placeholder="Nombre" className="form-control" />
                </div>
                <div className="col-md-6 mb-3">
                  <input type="text" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Apellido" className="form-control" />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Correo electrónico" className="form-control" />
                </div>
                <div className="col-md-6 mb-3">
                  <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Contraseña" className="form-control" />
                </div>
              </div>
              <div className="mb-3">
                <input type="text" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="Teléfono" className="form-control" />
              </div>
              <button type="submit" className="btn btn-primary">Agregar Usuario</button>
            </form>
          </div>
        </div>
        
        <div className="card shadow-sm table-container">
          <div className="card-body">
            <h5>Lista de Usuarios</h5>
            <p>No hay usuarios registrados.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UsuarioAdmin;