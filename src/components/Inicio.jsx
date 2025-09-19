import React, { useState } from 'react';
import './Inicio.css';

import logo from '../assets/img/logo-tambo2.png';
import cervezaImg from '../assets/img/Cerveza_3_Cruces.jpg';
import empanadaImg from '../assets/img/empanada_pollo.jpeg';
import aguaImg from '../assets/img/Agua_Mineral.jpeg';
import papitasImg from '../assets/img/Inka_chips.jpeg';

const Inicio = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const productos = [
    {
      nombre: 'Cerveza Tres Cruces Lager Six Pack Lata',
      categoria: 'Bebidas',
      descripcion: 'Pack de 6 cervezas artesanales con sabor refrescante y cuerpo ligero.',
      imagen: cervezaImg,
    },
    {
      nombre: 'Empanada de Pollo Tambo',
      categoria: 'Comida',
      descripcion: 'Empanada rellena de pollo jugoso y especias, ideal para cualquier momento.',
      imagen: empanadaImg,
    },
    {
      nombre: 'Agua Mineral',
      categoria: 'Bebidas',
      descripcion: 'Agua purificada y mineralizada, perfecta para mantenerte hidratado.',
      imagen: aguaImg,
    },
    {
      nombre: 'Inka Chips',
      categoria: 'Snacks',
      descripcion: 'Chips crocantes de papas nativas, sabor peruano auténtico.',
      imagen: papitasImg,
    },
  ];

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="inicio-container">
      
      {/* Barra de navegación */}
      <nav className="navbar">
        <div className="navbar-left">
          <img src={logo} alt="Logo Tambo" className="navbar-logo" />
          <button className="hamburger-btn" onClick={toggleMenu}>
            ☰ Productos
          </button>
        </div>
        <div className="navbar-right">
          <button className="btn-login">Iniciar sesión</button>
          <button className="btn-register">Registrarse</button>
        </div>
      </nav>

      {/* Pop-up de productos */}
      {menuOpen && (
        <div className="popup-menu">
          <div className="popup-content">
            <h3>Categorías de productos</h3>
            <ul>
              {productos.map((producto, index) => (
                <li key={index}>
                  <span className="producto-nombre">{producto.nombre}</span>
                  <span className="producto-categoria">{producto.categoria}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Sección promocional principal con cards incluidas */}
      <section className="inicio-banner">
        <div className="banner-content">
          <h1 className="titulo-promos">PROMOS DEL DÍA</h1>

          <div className="card-grid">
            {productos.map((producto, index) => (
              <div className="producto-card" key={index}>
                <img src={producto.imagen} alt={producto.nombre} className="producto-imagen" />
                <h4>{producto.nombre}</h4>
                <p className="categoria">{producto.categoria}</p>
                <p className="descripcion">{producto.descripcion}</p>
                <button className="btn-add">Añadir</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pie de página */}
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
