import React, { useState } from 'react';
import Sidebar from './Components/Sidebar';
import UsuarioAdmin from './Components/UsuarioAdmin';
import ProductosAdmin from './Components/ProductosAdmin';
import PedidosAdmin from './Components/PedidosAdmin';
import ReclamosAdmin from './Components/ReclamosAdmin';

const Inicio = () => (
  <div style={{ padding: '2rem' }}>
    <h2>Bienvenido al Panel de Administración</h2>
    <p>Selecciona una opción en el menú lateral.</p>
  </div>
);

const App = () => {
  const [vista, setVista] = useState('inicio');

  const renderVista = () => {
    switch (vista) {
      case 'usuarios':
        return <UsuarioAdmin />;
      case 'productos':
        return <ProductosAdmin />;
      case 'pedidos':
        return <PedidosAdmin />;
      case 'reclamos':
        return <ReclamosAdmin />;
      case 'inicio':
      default:
        return <Inicio />;
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

export default App;