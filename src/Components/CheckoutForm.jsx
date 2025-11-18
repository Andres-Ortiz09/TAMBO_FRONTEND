import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CheckoutForm.css";

const CheckoutForm = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    correo: "",
    titular: "",
    tarjetaNumero: "",
    vencimiento: "",
    cvv: "",
  });

  const [carrito, setCarrito] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [minVencimiento, setMinVencimiento] = useState("");

  useEffect(() => {
    const datos = localStorage.getItem("carritoParaPago");
    if (datos) setCarrito(JSON.parse(datos));

    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = (hoy.getMonth() + 1).toString().padStart(2, "0");
    setMinVencimiento(`${yyyy}-${mm}`);
  }, []);

  // Validaciones
  const validarTarjeta = (numero) => /^\d{8,16}$/.test(numero);
  const validarCVV = (cvv) => /^\d{3}$/.test(cvv);
  const validarVencimiento = (v) => /^\d{4}-(0[1-9]|1[0-2])$/.test(v);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "tarjetaNumero") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 16);
      setForm((prev) => ({ ...prev, tarjetaNumero: digitsOnly }));
      return;
    }

    if (name === "cvv") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 3);
      setForm((prev) => ({ ...prev, cvv: digitsOnly }));
      return;
    }

    if (name === "vencimiento") {
      const allowed = value.replace(/[^\d-]/g, "").slice(0, 7);
      setForm((prev) => ({ ...prev, vencimiento: allowed }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    const token = localStorage.getItem("token");
    if (!token) {
      setMensaje("No estás autenticado.");
      return;
    }
    if (carrito.length === 0) {
      setMensaje("Tu carrito está vacío.");
      return;
    }
    if (!validarTarjeta(form.tarjetaNumero)) {
      setMensaje("Número de tarjeta inválido. Debe tener entre 8 y 16 dígitos.");
      return;
    }
    if (!validarVencimiento(form.vencimiento)) {
      setMensaje("Fecha de vencimiento inválida. Usa el formato YYYY-MM.");
      return;
    }
    if (form.vencimiento < minVencimiento) {
      setMensaje("La fecha de vencimiento no puede ser anterior al mes actual.");
      return;
    }
    if (!validarCVV(form.cvv)) {
      setMensaje("CVV inválido. Debe tener exactamente 3 dígitos.");
      return;
    }

    try {
      const payload = {
        clienteId: form.nombre,
        productosIds: carrito.map((item) => item.id),
        cantidades: carrito.map((item) => item.cantidad),
        fecha: new Date().toISOString().split("T")[0],
        estado: "Pendiente",
      };

      await axios.post("http://localhost:8080/api/pedidos", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.removeItem("carritoParaPago");
      setCarrito([]);
      setForm({
        nombre: "",
        direccion: "",
        correo: "",
        titular: "",
        tarjetaNumero: "",
        vencimiento: "",
        cvv: "",
      });

      navigate("/gracias");
    } catch (err) {
      console.error("Error al guardar pedido", err);
      setMensaje("❌ Error al registrar el pedido");
    }
  };

  const handleCancelar = () => {
    localStorage.removeItem("carritoParaPago");
    setCarrito([]);
    setForm({
      nombre: "",
      direccion: "",
      correo: "",
      titular: "",
      tarjetaNumero: "",
      vencimiento: "",
      cvv: "",
    });
    navigate("/");
  };

  return (
    <div className="checkout-container">
      <h2>Finalizar Compra</h2>
      <form className="checkout-form" onSubmit={handleSubmit}>
        <h3>Detalles de la entrega</h3>
        <input
          name="direccion"
          value={form.direccion}
          onChange={handleChange}
          placeholder="Dirección de entrega"
          required
        />

        <h3>Información de pago</h3>
        <input
          name="titular"
          value={form.titular}
          onChange={handleChange}
          placeholder="Nombre del titular de la tarjeta"
          required
        />
        <input
          name="tarjetaNumero"
          value={form.tarjetaNumero}
          onChange={handleChange}
          placeholder="Número de la tarjeta (8–16 dígitos)"
          required
        />
        <input
          type="month"
          name="vencimiento"
          value={form.vencimiento}
          onChange={handleChange}
          placeholder="Fecha de vencimiento (YYYY-MM)"
          min={minVencimiento}
          required
        />
        <input
          name="cvv"
          value={form.cvv}
          onChange={handleChange}
          placeholder="CVV (3 dígitos)"
          required
        />

        <div className="checkout-botones">
          <button type="submit" className="btn-pagar">
            Confirmar y Pagar
          </button>
          <button type="button" className="btn-cancelar" onClick={handleCancelar}>
            Cancelar
          </button>
        </div>
      </form>
      {mensaje && <p className="checkout-mensaje">{mensaje}</p>}
    </div>
  );
};

export default CheckoutForm;
