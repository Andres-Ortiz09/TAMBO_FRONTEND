import React from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

const Gracias = () => {
  const navigate = useNavigate();

  const descargarPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Comprobante de Pedido", 20, 20);

    doc.setFontSize(12);
    doc.text("Gracias por tu compra 🎉", 20, 40);
    doc.text("Tu pedido ha sido registrado correctamente.", 20, 50);

    // Aquí puedes añadir más detalles del pedido si los guardas en localStorage
    doc.text("Fecha: " + new Date().toLocaleDateString(), 20, 70);

    doc.save("comprobante-pedido.pdf");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>✅ ¡Gracias por tu compra!</h2>
      <p>Tu pedido ha sido registrado correctamente.</p>

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            backgroundColor: "#6a0dad",
            color: "white",
            border: "none",
            padding: "12px 20px",
            borderRadius: "8px",
            marginRight: "10px",
            cursor: "pointer"
          }}
        >
          Volver al inicio
        </button>

        <button
          onClick={descargarPDF}
          style={{
            backgroundColor: "#9b4dca",
            color: "white",
            border: "none",
            padding: "12px 20px",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          Descargar PDF
        </button>
      </div>
    </div>
  );
};

export default Gracias;
