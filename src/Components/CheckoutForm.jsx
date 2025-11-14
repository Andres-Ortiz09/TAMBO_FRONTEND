import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CheckoutForm.css";

const CheckoutForm = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    correo: "",
    tarjetaNumero: "",
    vencimiento: "",
    cvv: ""
  });

  const [carrito, setCarrito] = useState([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const datos = localStorage.getItem("carritoParaPago");
    if (datos) setCarrito(JSON.parse(datos));
  }, []);

  // Validaciones
  const validarTarjeta = (numero) => /^\d{13,16}$/.test(numero);
  const validarCVV = (cvv) => /^\d{3}$/.test(cvv);
  const validarVencimiento = (v) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(v);
  const validarTelefono = (tel) => /^\d{9}$/.test(tel);

  // Sanitización en tiempo real
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "telefono") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 9);
      setForm((prev) => ({ ...prev, telefono: digitsOnly }));
      return;
    }

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
      let v = value.replace(/[^\d/]/g, "");
      if (v.length === 2 && form.vencimiento.length < 2) {
        v = v + "/";
      }
      v = v.slice(0, 5);
      setForm((prev) => ({ ...prev, vencimiento: v }));
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
    if (!validarTelefono(form.telefono)) {
      setMensaje("El número de celular debe tener exactamente 9 dígitos.");
      return;
    }
    if (!validarTarjeta(form.tarjetaNumero)) {
      setMensaje("Número de tarjeta inválido. Debe tener entre 13 y 16 dígitos.");
      return;
    }
    if (!validarVencimiento(form.vencimiento)) {
      setMensaje("Fecha de vencimiento inválida. Usa el formato MM/AA.");
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
        estado: "Pendiente"
      };

      await axios.post("http://localhost:8080/api/pedidos", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      localStorage.removeItem("carritoParaPago");
      setCarrito([]);
      setForm({
        nombre: "",
        direccion: "",
        telefono: "",
        correo: "",
        tarjetaNumero: "",
        vencimiento: "",
        cvv: ""
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
      telefono: "",
      correo: "",
      tarjetaNumero: "",
      vencimiento: "",
      cvv: ""
    });
    navigate("/");
  };

  return (
    <div className="checkout-container">
      <h2>Finalizar Compra</h2>
      <form className="checkout-form" onSubmit={handleSubmit}>
        <h3>Información del cliente</h3>
        <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre completo" required />
        <input name="direccion" value={form.direccion} onChange={handleChange} placeholder="Dirección" required />
        <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="Teléfono (9 dígitos)" required />
        <input name="correo" type="email" value={form.correo} onChange={handleChange} placeholder="Correo electrónico" required />

        <h3>Información de pago</h3>
        <input name="tarjetaNumero" value={form.tarjetaNumero} onChange={handleChange} placeholder="Número de la tarjeta (13–16 dígitos)" required />
        <input name="vencimiento" value={form.vencimiento} onChange={handleChange} placeholder="Fecha de vencimiento (MM/AA)" required />
        <input name="cvv" value={form.cvv} onChange={handleChange} placeholder="CVV (3 dígitos)" required />

        <div className="checkout-botones">
          <button type="submit" className="btn-pagar">Confirmar y Pagar</button>
          <button type="button" className="btn-cancelar" onClick={handleCancelar}>Cancelar</button>
        </div>
      </form>

      {mensaje && <p className="checkout-mensaje">{mensaje}</p>}
    </div>
  );
};

export default CheckoutForm;
