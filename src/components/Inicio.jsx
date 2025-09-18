import React from 'react';
import './Inicio.css';
import logo from '../assets/img/logo-tambo2.png';

const Inicio = () => {
  return (
    <div className="inicio-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <img src={logo} alt="Logo Tambo" className="navbar-logo" />
          <ul className="navbar-links">
            <li><a href="#">Inicio</a></li>
            <li><a href="#">Servicios</a></li>
            <li><a href="#">Contacto</a></li>
          </ul>
        </div>
        <div className="navbar-right">
          <button className="btn-login">Iniciar sesión</button>
          <button className="btn-register">Registrarse</button>
        </div>
      </nav>

      {/* Banner */}
      <section className="inicio-banner">
        <div className="banner-content">
          <h1>DISFRUTA DE TUS MARCAS FAVORITAS</h1>
          <p>HASTA -25% DESCUENTO en productos seleccionados</p>
          <small>TOMAR BEBIDAS ALCOHÓLICAS EN EXCESO ES DAÑINO</small>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>© {new Date().getFullYear()} Tiendas Tambo+. Todos los derechos reservados.</p>
          <ul className="footer-links">
            <li><a href="#">Política de Privacidad</a></li>
            <li><a href="#">Términos y Condiciones</a></li>
            <li><a href="#">Contacto</a></li>
          </ul>
        </div>
      </footer>
    </div>
  );
};

export default Inicio;
