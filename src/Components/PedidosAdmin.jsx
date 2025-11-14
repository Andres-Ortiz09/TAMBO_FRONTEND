import React, { useState, useEffect } from "react";
import axios from "axios";
import "./PedidosAdmin.css";

const estados = ["Pendiente", "Entregado"];

const PedidosAdmin = () => {
  const [form, setForm] = useState({
    pedidoId: null,
    clienteId: "",
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: "",
    productoId: "",
    cantidad: "",
    fecha: "",
    estado: ""
  });

  const [productos, setProductos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [clienteValido, setClienteValido] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    cargarProductos();
    cargarPedidos();
  }, []);

  const cargarProductos = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/products");
      setProductos(res.data);
    } catch (err) {
      console.error("Error al cargar productos", err);
    }
  };

  const cargarPedidos = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:8080/api/pedidos/admin/todos", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setPedidos(res.data);
    console.log("Pedidos recibidos:", res.data);
  } catch (err) {
    console.error("Error al cargar pedidos", err);
  }
};


  const buscarCliente = async (id) => {
    if (!id) {
      setClienteValido(false);
      setForm((prev) => ({
        ...prev,
        nombre: "",
        apellido: "",
        direccion: "",
        telefono: ""
      }));
      return;
    }

    try {
      const res = await axios.get(`http://localhost:8080/users/public/${id}`);
      const cliente = res.data;
      setForm((prev) => ({
        ...prev,
        nombre: cliente.firstName,
        apellido: cliente.lastName,
        direccion: cliente.address,
        telefono: cliente.phone
      }));
      setClienteValido(true);
      setMensaje("");
    } catch (err) {
      console.error("Cliente no encontrado", err);
      setClienteValido(false);
      setMensaje("Cliente no registrado");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "telefono" && value.length > 9) return;

    if (name === "fecha") {
      const hoy = new Date().toISOString().split("T")[0];
      if (value < hoy) {
        setMensaje("La fecha no puede ser anterior a hoy");
        return;
      } else {
        setMensaje("");
      }
    }

    if (name === "cantidad") {
      const cantidadNum = parseInt(value, 10);
      if (cantidadNum <= 0) {
        setMensaje("La cantidad debe ser mayor que 0");
        return;
      }
      const productoSeleccionado = productos.find(
        (p) => p.id === parseInt(form.productoId)
      );
      if (productoSeleccionado && productoSeleccionado.stock === 0) {
  setMensaje("Este producto no tiene stock disponible");
  return;
}

if (productoSeleccionado && cantidadNum > productoSeleccionado.stock) {
  setMensaje(
    `La cantidad no puede superar el stock disponible (${productoSeleccionado.stock})`
  );
  return;
}
      setMensaje("");
    }

    if (
      ["nombre", "apellido", "direccion", "telefono"].includes(name) &&
      clienteValido
    ) {
      return;
    }

    setForm({ ...form, [name]: value });

    if (name === "clienteId") buscarCliente(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clienteValido) {
      setMensaje("No se puede registrar pedido: cliente no válido");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setMensaje("No estás autenticado. Inicia sesión primero.");
      return;
    }

    try {
      const payload = {
        clienteId: form.clienteId,
        productosIds: [form.productoId],
        cantidades: [form.cantidad],
        fecha: form.fecha,
        estado: form.estado
      };

      if (form.pedidoId) {
        await axios.put(`http://localhost:8080/api/pedidos/admin/${form.pedidoId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMensaje("Pedido actualizado");
      } else {
        await axios.post("http://localhost:8080/api/pedidos", payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMensaje("Pedido registrado");
      }

      setForm({
        pedidoId: null,
        clienteId: "",
        nombre: "",
        apellido: "",
        direccion: "",
        telefono: "",
        productoId: "",
        cantidad: "",
        fecha: "",
        estado: ""
      });
      setClienteValido(false);
      cargarPedidos();
    } catch (err) {
      console.error("Error al guardar pedido", err);
      setMensaje("Error al guardar");
    }
  };

  const editarPedido = (pedido) => {
    setForm({
      pedidoId: pedido.id,
      clienteId: pedido.user.id,
      nombre: pedido.user.firstName,
      apellido: pedido.user.lastName,
      direccion: pedido.user.address,
      telefono: pedido.user.phone,
      productoId: pedido.items[0].producto.id,
      cantidad: pedido.items[0].cantidad,
      fecha: pedido.fechaPedido.split("T")[0],
      estado: pedido.estado
    });
    setClienteValido(true);
    setMensaje("");
  };

  const cancelarEdicion = () => {
    setForm({
      pedidoId: null,
      clienteId: "",
      nombre: "",
      apellido: "",
      direccion: "",
      telefono: "",
      productoId: "",
      cantidad: "",
      fecha: "",
      estado: ""
    });
    setClienteValido(false);
    setMensaje("Edición cancelada");
  };

  return (
    <div className="pedidos-container">
      <h2>{form.pedidoId ? "Editar Pedido" : "Registrar Pedido"}</h2>
      <form
        className={`form-card ${form.pedidoId ? "edit-mode" : ""}`}
        onSubmit={handleSubmit}
      >
        <input name="clienteId" value={form.clienteId} onChange={handleChange} placeholder="ID Cliente" required />
        <input name="nombre" value={form.nombre} placeholder="Nombre" disabled />
        <input name="apellido" value={form.apellido} placeholder="Apellido" disabled />
        <input name="direccion" value={form.direccion} placeholder="Dirección" disabled />
        <input name="telefono" value={form.telefono} placeholder="Teléfono" disabled />
        <select name="productoId" value={form.productoId} onChange={handleChange} required>
          <option value="">Seleccione un producto</option>
          {productos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} (Stock: {p.stock})
            </option>
          ))}
        </select>
        <input name="cantidad" type="number" value={form.cantidad} onChange={handleChange} placeholder="Cantidad" required />
        <input name="fecha" type="date" value={form.fecha} onChange={handleChange} min={new Date().toISOString().split("T")[0]} required className="campo-fecha" onClick={(e) => e.target.showPicker()} onKeyDown={(e) => e.preventDefault()} />
        <select name="estado" value={form.estado} onChange={handleChange} required>
          <option value="">Estado</option>
          {estados.map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
        <div>
          <button type="submit" className={form.pedidoId ? "btn-update" : "btn-primary"}>
            {form.pedidoId ? "Actualizar Pedido" : "Registrar Pedido"}
          </button>
          {form.pedidoId && (
            <button type="button" className="btn-cancel-edit" onClick={cancelarEdicion}>
              Cancelar edición
            </button>
          )}
        </div>
      </form>

      {mensaje && <p className="pedidos-message">{mensaje}</p>}

      <h3>Mis Pedidos</h3>
      <div className="pedidos-table-wrapper">
        <table className="pedidos-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.estado}</td>
                <td>{p.fechaPedido}</td>
                <td>
                  <button className="btn-edit" onClick={() => editarPedido(p)}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PedidosAdmin;
