import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Inicio.css';
import logo from '../assets/img/logo-tambo2.png';

const Inicio = () => {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userString = localStorage.getItem('registroUsuario');
    if (userString) {
      const user = JSON.parse(userString);
      // No mostrar admin aquí; asumimos que admin siempre va a /panel
      if (user.email.endsWith('@tambo.com')) {
        navigate('/panel'); // redirige admin al panel si entra aquí
      } else {
        setUsuario(user);
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('registroUsuario');
    setUsuario(null);
    navigate('/');
  };

  return (
    <div className="inicio-container">
      <nav className="navbar">
        <div className="navbar-left">
          <img src={logo} alt="Logo Tambo" className="navbar-logo" />
          <ul className="navbar-links">
            <li><Link to="/">Inicio</Link></li>
            <li><a href="#servicios">Servicios</a></li>
            <li><a href="#contacto">Contacto</a></li>
          </ul>
        </div>
        <div className="navbar-right">
          {!usuario ? (
            <>
              <Link to="/login" className="btn-login">Iniciar sesión</Link>
              <Link to="/registro" className="btn-register">Registrarse</Link>
            </>
          ) : (
            <>
              <span>Bienvenido, {usuario.firstName}!</span>
              <button onClick={handleLogout} className="btn-register">Cerrar sesión</button>
            </>
          )}
        </div>
      </nav>

      <section className="inicio-banner">
        <div className="banner-content">
          <h1>DISFRUTA DE TUS MARCAS FAVORITAS</h1>
          <p>HASTA -25% DESCUENTO en productos seleccionados</p>
          <small>TOMAR BEBIDAS ALCOHÓLICAS EN EXCESO ES DAÑINO</small>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <p>© {new Date().getFullYear()} Tiendas Tambo+. Todos los derechos reservados.</p>
          <ul className="footer-links">
            <li><a href="#politica">Política de Privacidad</a></li>
            <li><a href="#terminos">Términos y Condiciones</a></li>
            <li><a href="#contacto-footer">Contacto</a></li>
          </ul>
        </div>
      </footer>
    </div>
  );
};

export default Inicio;
