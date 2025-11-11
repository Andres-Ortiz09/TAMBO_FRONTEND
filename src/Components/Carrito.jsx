// Carrito.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Carrito.css';

const Carrito = ({ carrito, actualizarCantidad, eliminarDelCarrito }) => {
  const navigate = useNavigate();
  const total = carrito.reduce((acc, item) => acc + item.price * item.cantidad, 0);

  return (
    <section className="carrito-seccion">
      <div className="carrito-tabla-container">
        <h2>🛒 Carrito de Compras</h2>
        {carrito.length === 0 ? (
          <p className="carrito-vacio">Tu carrito está vacío.</p>
        ) : (
          <>
            <table className="carrito-tabla">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Descripción</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Total</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {carrito.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.description || '—'}</td>
                    <td>S/.{item.price.toFixed(2)}</td>
                    <td>
                      <div className="cantidad-controles">
                        <button onClick={() => actualizarCantidad(item.id, item.cantidad - 1)} disabled={item.cantidad <= 1}>−</button>
                        <span>{item.cantidad}</span>
                        <button onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}>+</button>
                      </div>
                    </td>
                    <td>S/.{(item.price * item.cantidad).toFixed(2)}</td>
                    <td>
                      <button className="btn-eliminar" onClick={() => eliminarDelCarrito(item.id)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="carrito-total">Total: S/.{total.toFixed(2)}</div>
            <div className="carrito-acciones">
              <button className="btn-volver" onClick={() => navigate(-1)}>Volver</button>
              <button className="btn-comprar">Comprar</button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Carrito;
