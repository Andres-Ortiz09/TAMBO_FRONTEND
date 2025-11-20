import React from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "./Gracias.css";

const Gracias = () => {
  const navigate = useNavigate();

  const descargarPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Comprobante de Pedido", 20, 20);

    doc.setFontSize(12);
    doc.text("Gracias por tu compra", 20, 40);
    doc.text("Tu pedido ha sido registrado correctamente.", 20, 50);
    doc.text("Fecha: " + new Date().toLocaleDateString(), 20, 60);

    const productos = JSON.parse(localStorage.getItem("carritoParaPago")) || [];

    let y = 80;
    if (productos.length > 0) {
      doc.setFontSize(14);
      doc.text("Resumen de productos:", 20, y);
      y += 10;

      let total = 0;
      productos.forEach((producto, index) => {
        doc.setFontSize(12);
        doc.text(`${index + 1}. ${producto.name}`, 20, y);
        y += 8;
        doc.text(`   Precio unitario: S/. ${producto.price.toFixed(2)}`, 20, y);
        y += 8;
        doc.text(`   Cantidad: ${producto.cantidad}`, 20, y);
        y += 10;
        const subtotal = producto.price * producto.cantidad;
        doc.text(`   Subtotal: S/. ${subtotal.toFixed(2)}`, 20, y);
        y += 12;

        total += subtotal;
      });

      doc.setFontSize(14);
      doc.text(`Total a pagar: S/. ${total.toFixed(2)}`, 20, y + 10);
    } else {
      doc.text("No se encontraron productos en el pedido.", 20, y);
    }

    doc.save("comprobante-pedido.pdf");
  };

  return (
    <div className="gracias-container">
      <h2>✅ ¡Gracias por tu compra!</h2>
      <p>Tu pedido ha sido registrado correctamente.</p>

      <div className="gracias-buttons">
        <button onClick={() => navigate("/")}>Volver al inicio</button>
        <button className="btn-pdf" onClick={descargarPDF}>
          Descargar PDF
        </button>
      </div>
    </div>
  );
};

export default Gracias;

