import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import Sidebar from './Components/Sidebar';
import UsuarioAdmin from './Components/UsuarioAdmin';
import ProductosAdmin from './Components/ProductosAdmin';
import PedidosAdmin from './Components/PedidosAdmin';
import Inicio from './Components/Inicio';
import PaginaPrincipal from './Components/PaginaPrincipal'; 
import Login from './Components/Login';
import Registro from './Components/Registro';
import Dashboard from './Components/Dashboard';
import ProductosPublicos from './Components/Productos';
import Carrito from './Components/Carrito';
import CheckoutForm from './Components/CheckoutForm';
import Gracias from './Components/Gracias';

const PanelAdmin = () => {
  const [vista, setVista] = useState('dashboard');

  const renderVista = () => {
    switch (vista) {
      case 'usuarios':
        return <UsuarioAdmin />;
      case 'productos':
        return <ProductosAdmin />;
      case 'pedidos':
        return <PedidosAdmin />;
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-container d-flex">
      <Sidebar setVista={setVista} vista={vista} />
      <main className="content-container" style={{ flex: 1 }}>
        {renderVista()}
      </main>
    </div>
  );
};

const App = () => {
  const [carrito, setCarrito] = useState([]);

  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      const existente = prev.find((item) => item.id === producto.id);
      if (existente) {
        return prev.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        return [...prev, { ...producto, cantidad: 1 }];
      }
    });
  };

  const eliminarDelCarrito = (id) => {
    setCarrito((prev) => prev.filter((item) => item.id !== id));
  };

  const actualizarCantidad = (id, nuevaCantidad) => {
    setCarrito((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, cantidad: nuevaCantidad > 0 ? nuevaCantidad : 1 }
          : item
      )
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Página principal - PaginaPrincipal */}
        <Route path="/" element={
          <PaginaPrincipal />
        } />

        {/* Otras rutas */}
        <Route path="/inicio" element={
          <Inicio
            carrito={carrito}
            agregarAlCarrito={agregarAlCarrito}
            eliminarDelCarrito={eliminarDelCarrito}
            actualizarCantidad={actualizarCantidad}
          />
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/panel" element={<PanelAdmin />} />
        <Route path="/carrito" element={
          <Carrito
            carrito={carrito}
            actualizarCantidad={actualizarCantidad}
            eliminarDelCarrito={eliminarDelCarrito}
          />
        } />
        <Route path="/productos" element={
          <ProductosPublicos agregarAlCarrito={agregarAlCarrito} />
        } />
        <Route path="/checkout" element={<CheckoutForm />} />
        <Route path="/gracias" element={<Gracias />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
